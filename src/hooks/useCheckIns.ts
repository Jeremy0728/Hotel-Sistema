import useSWR from 'swr';
import { checkinApi } from '@/apis/checkin.api';

export interface CheckIn {
  id: number;
  reservation_id: number;
  check_in_date: string;
  check_in_time: string;
  actual_guests: number;
  notes?: string;
  checked_in_by: number;
}

interface UseCheckInsOptions {
  limit?: number;
}

export function useCheckIns(options: UseCheckInsOptions = {}) {
  const { limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['checkins', limit],
    async () => {
      const response = await checkinApi.traerTodos(1, limit);
      return response.checkins || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshCheckIns = () => mutate();

  return {
    checkIns: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshCheckIns,
  };
}

export function useCheckIn(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['checkin', id] : null,
    async () => {
      const response = await checkinApi.traerPorId(id);
      return response.checkin;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshCheckIn = () => mutate();

  return {
    checkIn: data,
    isLoading,
    isError: !!error,
    error,
    refreshCheckIn,
  };
}

export function useCheckInByReservation(reservationId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    reservationId ? ['checkin-reservation', reservationId] : null,
    async () => {
      const response = await checkinApi.traerPorReserva(reservationId);
      return response.checkin;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshCheckIn = () => mutate();

  return {
    checkIn: data,
    isLoading,
    isError: !!error,
    error,
    refreshCheckIn,
  };
}

export function usePendingCheckIns() {
  const { data, error, isLoading, mutate } = useSWR(
    'checkins-pending',
    async () => {
      const response = await checkinApi.obtenerPendientes();
      return response.reservas || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshPendingCheckIns = () => mutate();

  return {
    pendingReservations: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshPendingCheckIns,
  };
}
