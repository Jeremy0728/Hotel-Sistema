import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { facturasApi } from '@/apis/facturas.api';
import type { 
  UseInvoicesOptions,
  UseInvoicesReturn,
  UseInvoiceByIdOptions,
  UseInvoiceByIdReturn
} from '@/types/invoice';

/**
 * Custom hook para obtener y gestionar facturas
 */
export function useInvoices(options: UseInvoicesOptions = {}): UseInvoicesReturn {
  const {
    page = 1,
    limit = 100,
    status,
    clientName,
    fromDate,
    toDate,
    refreshInterval,
  } = options;

  // Construir la key para SWR con los parámetros usando useMemo
  const key = useMemo(() => {
    return [
      'invoices',
      page,
      limit,
      status,
      clientName,
      fromDate,
      toDate,
    ];
  }, [page, limit, status, clientName, fromDate, toDate]);

  // Fetcher function que llama a la API
  const fetcher = async () => {
    const response = await facturasApi.traerTodos(page, limit, {
      status,
      client_name: clientName,
      from_date: fromDate,
      to_date: toDate,
    });
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
      shouldRetryOnError: true,
      dedupingInterval: 2000,
    }
  );

  const refreshInvoices = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    invoices: data?.invoices || [],
    total: data?.totalCount || 0,
    page: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    mutate,
    refreshInvoices,
  };
}

/**
 * Hook para obtener facturas pendientes
 */
export function usePendingInvoices() {
  return useInvoices({ status: 'sent', limit: 100 });
}

/**
 * Hook para obtener una factura específica por ID
 */
export function useInvoiceById(options: UseInvoiceByIdOptions): UseInvoiceByIdReturn {
  const { invoiceId, refreshInterval } = options;

  // Fetcher function que llama a la API
  const fetcher = async () => {
    const response = await facturasApi.traerPorId(invoiceId);
    return response.invoice;
  };

  const { data, error, isLoading, mutate } = useSWR(
    invoiceId ? ['invoice', invoiceId] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
      shouldRetryOnError: true,
      dedupingInterval: 2000,
    }
  );

  const refreshInvoice = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    invoice: data || null,
    isLoading,
    isError: !!error,
    error,
    mutate,
    refreshInvoice,
  };
}
