import { useState, useMemo, useCallback } from 'react';
import type { ReservationStatus } from '@/types/hotel';
import { reservasApi, checkinApi } from '@/apis/reservas.api';
import { huespedesApi } from '@/apis/huespedes.api';
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
  total: number;
  channel?: string;
}

interface Invoice {
  id: string;
  reservationCode: string;
  balance: number;
}

interface UseReservationOperationsProps {
  reservations: Reservation[];
  invoices: Invoice[];
  onSuccess?: () => void;
}

export function useReservationOperations({
  reservations,
  invoices,
  onSuccess,
}: UseReservationOperationsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [guestFilter, setGuestFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const paymentStatus = (reservationCode: string) => {
    const invoice = invoices.find((entry) => entry.reservationCode === reservationCode);
    if (!invoice) return 'none';
    return invoice.balance > 0 ? 'pending' : 'paid';
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        reservation.code.toLowerCase().includes(search.toLowerCase()) ||
        reservation.guestName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : reservation.status === statusFilter;
      const matchesGuest =
        guestFilter === 'all' ? true : reservation.guestId === guestFilter;
      const matchesRoom =
        roomFilter === 'all' ? true : reservation.roomId === roomFilter;
      const matchesDateFrom = dateFrom ? reservation.checkIn >= dateFrom : true;
      const matchesDateTo = dateTo ? reservation.checkOut <= dateTo : true;
      const matchesChannel =
        channelFilter === 'all' ? true : reservation.channel === channelFilter;
      const matchesPayment =
        paymentFilter === 'all'
          ? true
          : paymentStatus(reservation.code) === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGuest &&
        matchesRoom &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesChannel &&
        matchesPayment
      );
    });
  }, [
    reservations,
    search,
    statusFilter,
    guestFilter,
    roomFilter,
    dateFrom,
    dateTo,
    channelFilter,
    paymentFilter,
    invoices,
    paymentStatus,
  ]);

  const applyView = (view: 'today' | 'pending' | 'week') => {
    if (view === 'today') {
      setDateFrom(todayStr);
      setDateTo(todayStr);
      setStatusFilter('all');
      setPaymentFilter('all');
      return;
    }
    if (view === 'pending') {
      setPaymentFilter('pending');
      setStatusFilter('all');
      setDateFrom('');
      setDateTo('');
      return;
    }
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    setDateFrom(todayStr);
    setDateTo(weekEndStr);
    setStatusFilter('all');
    setPaymentFilter('all');
  };

  const handleConfirm = useCallback(async (id: string) => {
    const reservationId = parseInt(id, 10);
    if (isNaN(reservationId)) return;

    setIsUpdating(true);
    try {
      await reservasApi.cambiarEstado(reservationId, 'confirmed');
      toast.success('Reserva confirmada exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      toast.error('Error al confirmar la reserva');
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess]);

  const handleCancel = useCallback(async (id: string) => {
    const reservationId = parseInt(id, 10);
    if (isNaN(reservationId)) return;

    setIsUpdating(true);
    try {
      await reservasApi.cambiarEstado(reservationId, 'cancelled');
      toast.success('Reserva cancelada exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      toast.error('Error al cancelar la reserva');
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess]);

  const handleCheckIn = useCallback(async (id: string) => {
    const reservationId = parseInt(id, 10);
    if (isNaN(reservationId)) return;

    setIsUpdating(true);
    try {
      await checkinApi.realizarCheckIn(reservationId);
      toast.success('Check-in realizado exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error al realizar check-in:', error);
      toast.error('Error al realizar el check-in');
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess]);

  const handleCheckOut = useCallback(async (id: string) => {
    const reservationId = parseInt(id, 10);
    if (isNaN(reservationId)) return;

    // Buscar la reserva para obtener el checkInId
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) {
      toast.error('Reserva no encontrada');
      return;
    }

    // TODO: Necesitamos obtener el checkInId de la reserva
    // Por ahora, mostraremos un error indicando que falta esta información
    toast.error('No se puede realizar check-out: falta información de check-in');
    
    // Implementación completa cuando tengamos el checkInId:
    // setIsUpdating(true);
    // try {
    //   await checkinApi.realizarCheckOut(checkInId, {
    //     final_amount: reservation.total,
    //     payment_status: 'pending',
    //     room_condition: 'good'
    //   });
    //   toast.success('Check-out realizado exitosamente');
    //   onSuccess?.();
    // } catch (error) {
    //   console.error('Error al realizar check-out:', error);
    //   toast.error('Error al realizar el check-out');
    // } finally {
    //   setIsUpdating(false);
    // }
  }, [reservations, onSuccess]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    guestFilter,
    setGuestFilter,
    roomFilter,
    setRoomFilter,
    channelFilter,
    setChannelFilter,
    paymentFilter,
    setPaymentFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filteredReservations,
    applyView,
    handleConfirm,
    handleCancel,
    handleCheckIn,
    handleCheckOut,
    paymentStatus,
    isUpdating,
  };
}

/**
 * Hook para operaciones específicas del detalle de una reserva
 */
export function useReservationDetailOperations(reservationId: number | null, onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateReservationStatus = useCallback(async (status: 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out') => {
    if (!reservationId) return;
    
    setIsUpdating(true);
    try {
      await reservasApi.cambiarEstado(reservationId, status);
      toast.success(`Reserva ${status === 'confirmed' ? 'confirmada' : status === 'cancelled' ? 'cancelada' : status === 'checked_in' ? 'check-in completado' : 'check-out completado'} exitosamente`);
      onSuccess?.();
    } catch (error) {
      toast.error('Error al actualizar el estado de la reserva');
      console.error('Error updating reservation status:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [reservationId, onSuccess]);

  const confirmReservation = useCallback(() => {
    return updateReservationStatus('confirmed');
  }, [updateReservationStatus]);

  const cancelReservation = useCallback(() => {
    return updateReservationStatus('cancelled');
  }, [updateReservationStatus]);

  const checkInReservation = useCallback(() => {
    return updateReservationStatus('checked_in');
  }, [updateReservationStatus]);

  const checkOutReservation = useCallback(() => {
    return updateReservationStatus('checked_out');
  }, [updateReservationStatus]);

  const createGuest = useCallback(async (guestData: {
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string;
    document_type: string;
    document_number: string;
    email?: string;
    phone?: string;
  }) => {
    setIsUpdating(true);
    try {
      const response = await huespedesApi.crear({
        ...guestData,
        apellido_materno: guestData.apellido_materno || '',
        email: guestData.email || '',
        phone: guestData.phone || '',
        document_type: guestData.document_type as 'dni' | 'passport' | 'ce',
        is_active: true,
      });
      toast.success('Huésped creado exitosamente');
      onSuccess?.();
      return response.huesped;
    } catch (error) {
      toast.error('Error al crear el huésped');
      console.error('Error creating guest:', error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess]);

  return {
    isUpdating,
    confirmReservation,
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    createGuest,
  };
}
