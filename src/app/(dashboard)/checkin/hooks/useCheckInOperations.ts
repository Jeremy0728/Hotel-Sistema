import { useState, useMemo } from 'react';
import type { ReservationStatus } from '@/types/hotel';
import { checkinApi } from '@/apis/reservas.api';
import { reservasApi } from '@/apis/reservas.api';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  code: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  status: ReservationStatus;
  checkIn: string;
  checkOut: string;
  nights: number;
  notes?: string;
  actualCheckIn?: string;
}

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  document_type: string;
  document_number: string;
}

interface Room {
  id: number;
  number: string;
  floor: number;
  roomType?: {
    name: string;
  };
}

interface CheckInForm {
  date: string;
  time: string;
  documentType: number;
  documentNumber: string;
  paymentMethod: number;
  deposit: number;
  notes: string;
}

interface UseCheckInOperationsProps {
  reservations: Reservation[];
  guests: Guest[];
  rooms: Room[];
  onSuccess?: () => void;
}

export function useCheckInOperations({
  reservations,
  guests,
  rooms,
  onSuccess,
}: UseCheckInOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currentTime = useMemo(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  const [form, setForm] = useState<CheckInForm>({
    date: todayStr,
    time: currentTime,
    documentType: 1, // DNI por defecto
    documentNumber: '',
    paymentMethod: 1, // Primer método de pago por defecto
    deposit: 0,
    notes: '',
  });

  const eligibleStatuses: ReservationStatus[] = ['confirmed', 'pending'];

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (!eligibleStatuses.includes(reservation.status)) return false;
      const query = search.toLowerCase();
      const matchesSearch =
        reservation.code.toLowerCase().includes(query) ||
        reservation.guestName.toLowerCase().includes(query) ||
        reservation.roomNumber.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' ? true : reservation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  const selectedReservation = useMemo(
    () => reservations.find((reservation) => reservation.id === selectedId) ?? null,
    [reservations, selectedId]
  );

  const selectedGuest = selectedReservation
    ? guests.find((guest) => String(guest.id) === selectedReservation.guestId)
    : undefined;

  const selectedRoom = selectedReservation
    ? rooms.find((room) => String(room.id) === selectedReservation.roomId)
    : undefined;

  const canComplete =
    selectedReservation && eligibleStatuses.includes(selectedReservation.status);

  const handleSelect = (id: string) => {
    const reservation = reservations.find((item) => item.id === id);
    const guest = reservation
      ? guests.find((item) => String(item.id) === reservation.guestId)
      : undefined;
    console.log("🚀 ~ handleSelect ~ guest:", guest)

    // Obtener fecha y hora actual para el check-in
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setSelectedId(id);
    setForm({
      date: currentDate,
      time: currentTimeStr,
      documentType: guest?.documentType?.id ?? 1,
      documentNumber: guest?.document_number ?? '',
      paymentMethod: 6,
      deposit: 0,
      notes: '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleComplete = async () => {
    if (!selectedReservation) {
      setError('Selecciona una reserva para completar el check-in.');
      return;
    }
    if (!eligibleStatuses.includes(selectedReservation.status)) {
      setError('La reserva ya fue procesada.');
      return;
    }
    if (!form.documentNumber) {
      setError('Completa el documento del huésped.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const reservationId = parseInt(selectedReservation.id, 10);
      
      // Preparar datos para el check-in
      const checkInData = {
        actual_check_in: `${form.date}T${form.time}:00`,
        notes: form.notes || undefined,
      };

      // Realizar check-in con la API
      await checkinApi.realizarCheckIn(reservationId, checkInData);

      // Preparar notas para actualizar la reserva
      const notesParts: string[] = [];
      if (selectedReservation.notes) notesParts.push(selectedReservation.notes);
      if (form.notes) notesParts.push(form.notes);
      if (form.deposit > 0) {
        notesParts.push(`Depósito: S/ ${form.deposit} (Método ID: ${form.paymentMethod})`);
      }

      // Actualizar reserva con información adicional
      await reservasApi.actualizar(reservationId, {
        notes: notesParts.length ? notesParts.join(' | ') : selectedReservation.notes,
      });

      toast.success('Check-in completado exitosamente');
      setSuccess('Check-in completado. Habitación marcada como ocupada.');
      setSelectedId(null);
      
      // Llamar callback de éxito para refrescar datos
      onSuccess?.();
    } catch (err) {
      console.error('Error al completar check-in:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al completar el check-in';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setSelectedId(null);
    setError(null);
    setSuccess(null);
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedId,
    form,
    setForm,
    processing,
    error,
    success,
    todayStr,
    filteredReservations,
    selectedReservation,
    selectedGuest,
    selectedRoom,
    canComplete,
    handleSelect,
    handleComplete,
    handleCancel,
  };
}
