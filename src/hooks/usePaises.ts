import { useCallback } from 'react';
import useSWR from 'swr';
import { paisesApi, type Pais, type ResponsePaises } from '@/apis/paises.api';
import { ApiError } from '@/types/api';

interface UsePaisesOptions {
  page?: number;
  limit?: number;
  is_active?: boolean;
  refreshInterval?: number;
}

interface UsePaisesReturn {
  countries: Pais[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | undefined;
  mutate: () => void;
  refresh: () => void;
}

/**
 * Custom hook para obtener y gestionar países usando SWR
 */
export function usePaises(options: UsePaisesOptions = {}): UsePaisesReturn {
  const {
    page = 1,
    limit = 100,
    is_active,
    refreshInterval,
  } = options;

  // Construir la key para SWR con los parámetros
  const swrKey = ['countries', page, limit, is_active]
    .filter((val) => val !== undefined)
    .join('-');

  // Fetcher function que llama a la API
  const fetcher = async () => {
    const response = await paisesApi.traerTodos(page, limit, is_active);
    return response;
  };

  // Usar SWR para obtener los datos
  const { data, error, isLoading, mutate } = useSWR<
    ResponsePaises,
    ApiError
  >(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
      shouldRetryOnError: false,
      dedupingInterval: 5000, // Cache por 5 segundos
    }
  );

  // Función para refrescar manualmente los datos
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    countries: data?.countries || [],
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

/**
 * Hook para obtener solo los países activos
 */
export function useActivePaises() {
  return usePaises({ is_active: true, limit: 100 });
}
