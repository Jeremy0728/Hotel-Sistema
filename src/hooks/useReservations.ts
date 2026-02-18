import { useCallback } from 'react';
import useSWR from 'swr';
import { reservasApi } from '@/apis/reservas.api';
import { ApiError } from '@/types/api';

interface Reservation {
  id: number;
  confirmation_code: string;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  total_amount: string;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  special_requests?: string;
  huesped?: {
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string;
    email: string;
  };
  habitacion?: {
    number: string;
    tipo?: string;
  };
}

interface UseReservationsOptions {
  page?: number;
  limit?: number;
  status?: string;
  room_id?: number;
  guest_id?: number;
  refreshInterval?: number;
}

interface UseReservationsReturn {
  reservations: Reservation[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | undefined;
  mutate: () => void;
  refreshReservations: () => void;
}

/**
 * Custom hook para obtener y gestionar reservas usando SWR
 */
export function useReservations(options: UseReservationsOptions = {}): UseReservationsReturn {
  const {
    page = 1,
    limit = 100,
    status,
    room_id,
    guest_id,
    refreshInterval,
  } = options;

  // Construir la key para SWR con los parámetros
  const swrKey = ['reservations', page, limit, status, room_id, guest_id]
    .filter(Boolean)
    .join('-');

  // Fetcher function que llama a la API
  const fetcher = async () => {
    const filters: Record<string, string> = {};
    if (status) filters.status = status;
    if (room_id) filters.room_id = room_id.toString();
    if (guest_id) filters.guest_id = guest_id.toString();

    const response = await reservasApi.traerTodos(page, limit, filters);
    return response;
  };

  // Usar SWR para obtener los datos
  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      reservas: Reservation[];
      total: number;
      page: number;
      totalPages: number;
    },
    ApiError
  >(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
      shouldRetryOnError: false,
      dedupingInterval: 2000,
    }
  );

  // Función para refrescar manualmente los datos
  const refreshReservations = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    reservations: data?.reservas || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    mutate,
    refreshReservations,
  };
}

/**
 * Hook para obtener una reserva específica por ID
 */
export function useReservation(id: number | null) {
  const swrKey = id ? `reservation-${id}` : null;

  const fetcher = async () => {
    if (!id) return null;
    const response = await reservasApi.traerPorId(id);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      reserva: Reservation;
    } | null,
    ApiError
  >(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  return {
    reservation: data?.reserva || null,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook para obtener reservas activas (checked_in)
 */
export function useActiveReservations() {
  return useReservations({ status: 'checked_in', limit: 1000 });
}

/**
 * Hook para obtener reservas de hoy
 */
export function useTodayReservations() {
  const today = new Date().toISOString().split('T')[0];
  
  const swrKey = `reservations-today-${today}`;

  const fetcher = async () => {
    const response = await reservasApi.traerTodos(1, 1000, {
      check_in_date: today,
    });
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      reservas: Reservation[];
      total: number;
      page: number;
      totalPages: number;
    },
    ApiError
  >(swrKey, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    refreshInterval: 60000, // Refrescar cada minuto
  });

  return {
    reservations: data?.reservas || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
