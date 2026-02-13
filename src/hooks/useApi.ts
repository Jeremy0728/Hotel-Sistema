import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { apiGet } from '@/lib/api/apiWrapper';
import { ApiError } from '@/types/api';

/**
 * Hook personalizado para consumir APIs con SWR
 * Proporciona caching automático, revalidación y manejo de estados
 */
export function useApi<T = any>(
  url: string | null,
  options?: SWRConfiguration
): SWRResponse<T, ApiError> {
  return useSWR<T, ApiError>(
    url,
    async (url: string) => {
      const response = await apiGet<T>(url);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      ...options,
    }
  );
}

/**
 * Hook para consumir APIs con paginación
 */
export function usePaginatedApi<T = any>(
  baseUrl: string | null,
  page: number = 1,
  limit: number = 10,
  filters?: Record<string, any>,
  options?: SWRConfiguration
) {
  // Construir URL con parámetros de paginación y filtros
  const url = baseUrl
    ? (() => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...filters,
        });
        return `${baseUrl}?${params.toString()}`;
      })()
    : null;

  return useApi<{
    ok: boolean;
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  }>(url, options);
}

/**
 * Hook para consumir APIs con polling (actualización periódica)
 */
export function useApiWithPolling<T = any>(
  url: string | null,
  refreshInterval: number = 5000,
  options?: SWRConfiguration
) {
  return useApi<T>(url, {
    refreshInterval,
    ...options,
  });
}
