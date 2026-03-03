import useSWR from 'swr';
import { ubicacionesInventarioApi } from '@/apis/ubicaciones-inventario.api';

export interface InventoryLocation {
  id: number;
  name: string;
  type: string;
  room_id?: number;
  is_active: boolean;
  created_at?: string;
}

interface UseInventoryLocationsOptions {
  page?: number;
  limit?: number;
}

export function useInventoryLocations(options: UseInventoryLocationsOptions = {}) {
  const { page = 1, limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['inventory-locations', page, limit],
    async () => {
      const response = await ubicacionesInventarioApi.traerTodos(page, limit);
      return {
        locations: response.ubicaciones || [],
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

  const refreshLocations = () => mutate();

  return {
    locations: data?.locations || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshLocations,
  };
}

export function useInventoryLocation(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['inventory-location', id] : null,
    async () => {
      const response = await ubicacionesInventarioApi.traerPorId(id);
      return response.ubicacion;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshLocation = () => mutate();

  return {
    location: data,
    isLoading,
    isError: !!error,
    error,
    refreshLocation,
  };
}

export function useActiveInventoryLocations() {
  const { data, error, isLoading, mutate } = useSWR(
    'active-inventory-locations',
    async () => {
      const response = await ubicacionesInventarioApi.obtenerActivas();
      return response.ubicaciones || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshActiveLocations = () => mutate();

  return {
    locations: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshActiveLocations,
  };
}
