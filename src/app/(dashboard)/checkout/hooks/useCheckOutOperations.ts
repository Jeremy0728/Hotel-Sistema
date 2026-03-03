import { useState, useMemo } from 'react';
import type { ReservationStatus } from '@/types/hotel';

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
  paymentMethod: string;
  manualCharge: number;
  discount: number;
  notes: string;
}

const extraOptions = [
  { id: "minibar", label: "Consumo minibar", amount: 40 },
  { id: "laundry", label: "Lavandería", amount: 35 },
  { id: "late", label: "Late check-out", amount: 60 },
] as const;

interface UseCheckOutOperationsProps {
  reservations: Reservation[];
  guests: Guest[];
  rooms: Room[];
  onCompleteCheckOut: (reservationId: string, formData: CheckOutForm, total: number, extras: string[]) => Promise<void>;
  onUpdateReservation: (reservationId: string, updates: Partial<Reservation>) => Promise<void>;
}

export function useCheckOutOperations({
  reservations,
  guests,
  rooms,
  onCompleteCheckOut,
  onUpdateReservation,
}: UseCheckOutOperationsProps) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [extras, setExtras] = useState<string[]>([]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [form, setForm] = useState<CheckOutForm>({
    date: todayStr,
    time: '12:00',
    paymentMethod: 'Tarjeta',
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
    return extraOptions.reduce((sum, extra) => {
      return extras.includes(extra.id) ? sum + extra.amount : sum;
    }, 0);
  }, [extras]);

  const baseTotal = selectedReservation?.total ?? 0;
  const subtotal = baseTotal + extrasTotal + form.manualCharge;
  const discountAmount = Math.round(subtotal * (form.discount / 100));
  const total = Math.max(0, subtotal - discountAmount);

  const handleToggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setForm({
      date: todayStr,
      time: '12:00',
      paymentMethod: 'Tarjeta',
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
      await onCompleteCheckOut(selectedReservation.id, form, total, extras);

      const extraLabels = extraOptions
        .filter((extra) => extras.includes(extra.id))
        .map((extra) => extra.label);

      const notesParts: string[] = [];
      if (selectedReservation.notes) notesParts.push(selectedReservation.notes);
      if (form.notes) notesParts.push(form.notes);
      if (extraLabels.length) notesParts.push(`Extras: ${extraLabels.join(', ')}`);
      if (form.manualCharge > 0) notesParts.push(`Cargo manual: S/ ${form.manualCharge}`);
      if (form.discount > 0) notesParts.push(`Descuento: ${form.discount}%`);
      notesParts.push(`Pago: ${form.paymentMethod}`);

      await onUpdateReservation(selectedReservation.id, {
        actualCheckOut: form.date,
        total,
        notes: notesParts.join(' | '),
      });

      setSuccess('Check-out completado. Habitación en limpieza.');
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al completar el check-out');
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
    handleSelect,
    handleComplete,
    handleCancel,
  };
}
