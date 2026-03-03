import { useCallback } from 'react';
import useSWR from 'swr';
import { tiposDocumentoApi, type TipoDocumento, type ResponseTiposDocumento } from '@/apis/tipos-documento.api';
import { ApiError } from '@/types/api';

interface UseTiposDocumentoOptions {
  page?: number;
  limit?: number;
  is_active?: boolean;
  refreshInterval?: number;
}

interface UseTiposDocumentoReturn {
  documentTypes: TipoDocumento[];
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
 * Custom hook para obtener y gestionar tipos de documento usando SWR
 */
export function useTiposDocumento(options: UseTiposDocumentoOptions = {}): UseTiposDocumentoReturn {
  const {
    page = 1,
    limit = 100,
    is_active,
    refreshInterval,
  } = options;

  // Construir la key para SWR con los parámetros
  const swrKey = ['document-types', page, limit, is_active]
    .filter((val) => val !== undefined)
    .join('-');

  // Fetcher function que llama a la API
  const fetcher = async () => {
    const response = await tiposDocumentoApi.traerTodos(page, limit, is_active);
    return response;
  };

  // Usar SWR para obtener los datos
  const { data, error, isLoading, mutate } = useSWR<
    ResponseTiposDocumento,
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
    documentTypes: data?.documentTypes || [],
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
 * Hook para obtener solo los tipos de documento activos
 */
export function useActiveTiposDocumento() {
  return useTiposDocumento({ is_active: true, limit: 100 });
}
