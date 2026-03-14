import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { habitacionesApi } from '@/apis/habitaciones.api';
import { ApiError } from '@/types/api';
import type { Room } from '@/types/room';

interface UseRoomsOptions {
  page?: number;
  limit?: number;
  status?: string;
  floor?: number;
  refreshInterval?: number;
}

interface UseRoomsReturn {
  rooms: Room[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | undefined;
  mutate: () => void;
  updateRoomStatus: (id: number, status: string) => Promise<void>;
  refreshRooms: () => void;
}

/**
 * Custom hook para obtener y gestionar habitaciones usando SWR
 */
export function useRooms(options: UseRoomsOptions = {}): UseRoomsReturn {
  const {
    page = 1,
    limit = 10,
    status,
    floor,
    refreshInterval,
  } = options;

  // Construir la key para SWR con los parámetros usando useMemo
  const key = useMemo(() => {
    return [
      `rooms-${page}-${limit}-${status || ''}-${floor || ''}`,
      page,
      limit,
      status,
      floor
    ];
  }, [page, limit, status, floor]);

  // Fetcher function que llama a la API
  const fetcher = async ([, page, limit, status]: [string, number, number, string | undefined, number | undefined]) => {
    const response = await habitacionesApi.traerTodos(page, limit, status);
    return response;
  };

  // Usar SWR para obtener los datos
  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      habitaciones: Room[];
      total: number;
      page: number;
      totalPages: number;
    },
    ApiError
  >(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
      shouldRetryOnError: false,
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  );

  // Función para actualizar el estado de una habitación
  const updateRoomStatus = useCallback(
    async (id: number, newStatus: string) => {
      try {
        await habitacionesApi.cambiarEstado(id, newStatus);
        // Revalidar los datos después de la actualización
        await mutate();
      } catch (err) {
        console.error('Error al actualizar estado de habitación:', err);
        throw err;
      }
    },
    [mutate]
  );

  // Función para refrescar manualmente los datos
  const refreshRooms = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    rooms: data?.habitaciones || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    mutate,
    updateRoomStatus,
    refreshRooms,
  };
}

/**
 * Hook para obtener habitaciones disponibles
 */
export function useAvailableRooms() {
  const key = useMemo(() => 'rooms-available', []);

  const fetcher = async () => {
    const response = await habitacionesApi.obtenerDisponibles();
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      habitaciones: Room[];
    },
    ApiError
  >(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
  });

  return {
    rooms: data?.habitaciones || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook para obtener habitaciones por piso
 */
export function useRoomsByFloor(floor: number) {
  const key = useMemo(() => {
    return floor ? `rooms-floor-${floor}` : null;
  }, [floor]);

  const fetcher = async () => {
    if (!floor) return null;
    const response = await habitacionesApi.obtenerPorPiso(floor);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      habitaciones: Room[];
    } | null,
    ApiError
  >(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
  });

  return {
    rooms: data?.habitaciones || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook para obtener una habitación específica por ID
 */
export function useRoom(id: number | null) {
  const key = useMemo(() => {
    return id ? `room-${id}` : null;
  }, [id]);

  const fetcher = async () => {
    if (!id) return null;
    const response = await habitacionesApi.traerPorId(id);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      habitacion: Room;
    } | null,
    ApiError
  >(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
  });

  return {
    room: data?.habitacion || null,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
