import useSWR from 'swr';
import { serviciosAdicionalesApi } from '@/apis/servicios-adicionales.api';

interface ServicioAdicional {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes?: number;
  category: string;
  is_active: boolean;
}

interface UseServiciosAdicionalesOptions {
  page?: number;
  limit?: number;
  category?: string;
  is_active?: boolean;
  refreshInterval?: number;
}

export function useServiciosAdicionales(options: UseServiciosAdicionalesOptions = {}) {
  const { page = 1, limit = 100, category, is_active, refreshInterval } = options;

  const swrKey = ['servicios-adicionales', page, limit, category, is_active]
    .filter((val) => val !== undefined)
    .join('-');

  const fetcher = async () => {
    return await serviciosAdicionalesApi.traerTodos(page, limit, category, is_active);
  };

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    refreshInterval,
  });

  const refresh = () => {
    mutate();
  };

  return {
    services: data?.services || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    mutate,
    refresh,
  };
}

// Hook helper para obtener solo servicios activos
export function useActiveServiciosAdicionales(category?: string) {
  return useServiciosAdicionales({ is_active: true, limit: 100, category });
}

export type { ServicioAdicional };
