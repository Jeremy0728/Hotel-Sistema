import { useCallback } from 'react';
import useSWR from 'swr';
import { metodosPagoApi, type MetodoPago, type ResponseMetodosPago } from '@/apis/metodos-pago.api';
import { ApiError } from '@/types/api';

interface UseMetodosPagoOptions {
  page?: number;
  limit?: number;
  is_active?: boolean;
  refreshInterval?: number;
}

interface UseMetodosPagoReturn {
  paymentMethods: MetodoPago[];
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
 * Custom hook para obtener y gestionar métodos de pago usando SWR
 */
export function useMetodosPago(options: UseMetodosPagoOptions = {}): UseMetodosPagoReturn {
  const {
    page = 1,
    limit = 100,
    is_active,
    refreshInterval,
  } = options;

  // Construir la key para SWR con los parámetros
  const swrKey = ['payment-methods', page, limit, is_active]
    .filter((val) => val !== undefined)
    .join('-');

  // Fetcher function que llama a la API
  const fetcher = async () => {
    const response = await metodosPagoApi.traerTodos(page, limit, is_active);
    return response;
  };

  // Usar SWR para obtener los datos
  const { data, error, isLoading, mutate } = useSWR<
    ResponseMetodosPago,
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
    paymentMethods: data?.paymentMethods || [],
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
 * Hook para obtener solo los métodos de pago activos
 */
export function useActiveMetodosPago() {
  return useMetodosPago({ is_active: true, limit: 100 });
}
