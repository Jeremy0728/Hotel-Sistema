import useSWR from 'swr';
import { tiposHabitacionApi } from '@/apis/tipos-habitacion.api';

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  base_price: string;
  max_occupancy: number;
  amenities?: Record<string, unknown>;
  is_active: boolean;
}

interface UseRoomTypesOptions {
  page?: number;
  limit?: number;
}

export function useRoomTypes(options: UseRoomTypesOptions = {}) {
  const { page = 1, limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['room-types', page, limit],
    async () => {
      const response = await tiposHabitacionApi.traerTodos(page, limit);
      return {
        roomTypes: response.tipos || [],
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshRoomTypes = () => mutate();

  return {
    roomTypes: data?.roomTypes || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshRoomTypes,
  };
}

export function useRoomType(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['room-type', id] : null,
    async () => {
      const response = await tiposHabitacionApi.traerPorId(id);
      return response.tipo;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshRoomType = () => mutate();

  return {
    roomType: data,
    isLoading,
    isError: !!error,
    error,
    refreshRoomType,
  };
}
