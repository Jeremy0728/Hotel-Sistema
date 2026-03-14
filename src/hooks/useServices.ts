import { useCallback } from 'react';
import useSWR from 'swr';
import { serviciosAdicionalesApi } from '@/apis/servicios-adicionales.api';
import { ApiError } from '@/types/api';

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes?: number;
  category: string;
  is_active: boolean;
}

interface UseServicesOptions {
  page?: number;
  limit?: number;
  category?: string;
  is_active?: boolean;
  refreshInterval?: number;
}

interface UseServicesReturn {
  services: Service[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | undefined;
  refreshServices: () => void;
}

/**
 * Custom hook para obtener y gestionar servicios adicionales usando SWR
 */
export function useServices(options: UseServicesOptions = {}): UseServicesReturn {
  const {
    page = 1,
    limit = 100,
    category,
    is_active,
    refreshInterval,
  } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['services', page, limit, category, is_active],
    async () => {
      const response = await serviciosAdicionalesApi.traerTodos(page, limit, category, is_active);
      return {
        services: response.services || [],
        totalCount: response.totalCount,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval,
    }
  );

  const refreshServices = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    services: data?.services || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshServices,
  };
}

/**
 * Hook para obtener un servicio individual por ID
 */
export function useService(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['service', id] : null,
    async () => {
      const response = await serviciosAdicionalesApi.traerPorId(id);
      return response.servicio;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshService = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    service: data,
    isLoading,
    isError: !!error,
    error,
    refreshService,
  };
}
