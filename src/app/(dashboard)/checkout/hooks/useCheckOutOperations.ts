import { useState, useMemo } from 'react';
import type { ReservationStatus } from '@/types/hotel';
import { checkoutApi } from '@/apis/checkout.api';
import { reservasApi } from '@/apis/reservas.api';
import { useActiveServiciosAdicionales } from '@/hooks/useServiciosAdicionales';
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
  checkInId?: number;
  checkOut: string;
  nights: number;
  total: number;
  notes?: string;
  actualCheckOut?: string;
}

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Room {
  id: number;
  number: string;
  floor: number;
  roomType?: {
    name: string;
  };
}

interface CheckOutForm {
  date: string;
  time: string;
  paymentMethod: number;
  manualCharge: number;
  discount: number;
  notes: string;
}

interface UseCheckOutOperationsProps {
  reservations: Reservation[];
  guests: Guest[];
  rooms: Room[];
  onSuccess?: () => void;
}

export function useCheckOutOperations({
  reservations,
  guests,
  rooms,
  onSuccess,
}: UseCheckOutOperationsProps) {
  // Obtener servicios adicionales activos desde la API
  const { services: extraOptions } = useActiveServiciosAdicionales();
  
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [extras, setExtras] = useState<{ id: number; quantity: number }[]>([]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [form, setForm] = useState<CheckOutForm>({
    date: todayStr,
    time: '12:00',
    paymentMethod: 6,
    manualCharge: 0,
    discount: 0,
    notes: '',
  });

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (reservation.status !== 'checkin') return false;
      const query = search.toLowerCase();
      return (
        reservation.code.toLowerCase().includes(query) ||
        reservation.guestName.toLowerCase().includes(query) ||
        reservation.roomNumber.toLowerCase().includes(query)
      );
    });
  }, [reservations, search]);

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

  const canComplete = selectedReservation?.status === 'checkin';

  const extrasTotal = useMemo(() => {
    return extras.reduce((sum, item) => {
      const extra = extraOptions.find((e) => e.id === item.id);
      return extra ? sum + parseFloat(extra.price) * item.quantity : sum;
    }, 0);
  }, [extras, extraOptions]);

  const baseTotal = selectedReservation?.total ?? 0;
  const subtotal = baseTotal + extrasTotal + form.manualCharge;
  const discountAmount = Math.round(subtotal * (form.discount / 100));
  const total = Math.max(0, subtotal - discountAmount);

  const handleToggleExtra = (id: number) => {
    setExtras((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setExtras((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setForm({
      date: todayStr,
      time: '12:00',
      paymentMethod: 6,
      manualCharge: 0,
      discount: 0,
      notes: '',
    });
    setExtras([]);
    setError(null);
    setSuccess(null);
  };

  const handleComplete = async () => {
    if (!selectedReservation) {
      setError('Selecciona una reserva para completar el check-out.');
      return;
    }
    if (selectedReservation.status !== 'checkin') {
      setError('La reserva ya fue cerrada.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const reservationId = parseInt(selectedReservation.id, 10);
      console.log("🚀 ~ handleComplete ~ selectedReservation:", selectedReservation)
      
      // Preparar etiquetas de extras para las notas
      const extraLabels = extras.map((item) => {
        const extra = extraOptions.find((e) => e.id === item.id);
        return extra ? `${extra.name} x${item.quantity}` : '';
      }).filter(Boolean);

      // Preparar datos para el check-out con unit_price
      const additionalCharges = extras.length > 0 ? extras.map((item) => {
        const extra = extraOptions.find((e) => e.id === item.id);
        return {
          service_id: item.id,
          quantity: item.quantity,
          unit_price: extra ? parseFloat(extra.price) : 0,
        };
      }) : undefined;

      const checkOutData = {
        check_in_id: selectedReservation.checkInId || reservationId,
        reservation_id: reservationId,
        actual_check_out: `${form.date}T${form.time}:00`,
        final_amount: total,
        payment_status: 'paid' as const,
        notes: form.notes || undefined,
        additional_charges: additionalCharges,
        guest_id: parseInt(selectedReservation.guestId, 10),
      };

      // Realizar check-out con la API
      await checkoutApi.realizar(checkOutData);

      // Preparar notas para actualizar la reserva
      const notesParts: string[] = [];
      if (selectedReservation.notes) notesParts.push(selectedReservation.notes);
      if (form.notes) notesParts.push(form.notes);
      if (extraLabels.length) notesParts.push(`Servicios adicionales: ${extraLabels.join(', ')}`);
      if (form.manualCharge > 0) notesParts.push(`Cargo manual: S/ ${form.manualCharge}`);
      if (form.discount > 0) notesParts.push(`Descuento: ${form.discount}%`);
      notesParts.push(`Método de pago ID: ${form.paymentMethod}`);

      // Actualizar reserva con información adicional y total final
      await reservasApi.actualizar(reservationId, {
        notes: notesParts.length ? notesParts.join(' | ') : selectedReservation.notes,
        total_amount: total.toString(),
      });

      toast.success('Check-out completado exitosamente');
      setSuccess('Check-out completado. Habitación en limpieza.');
      setSelectedId(null);
      
      // Llamar callback de éxito para refrescar datos
      onSuccess?.();
    } catch (err) {
      console.error('Error al completar check-out:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al completar el check-out';
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
    selectedId,
    form,
    setForm,
    extras,
    processing,
    error,
    success,
    todayStr,
    filteredReservations,
    selectedReservation,
    selectedGuest,
    selectedRoom,
    canComplete,
    extrasTotal,
    baseTotal,
    subtotal,
    discountAmount,
    total,
    extraOptions,
    handleToggleExtra,
    handleQuantityChange,
    handleSelect,
    handleComplete,
    handleCancel,
  };
}
