import { useCallback } from 'react';
import useSWR from 'swr';
import { ApiError } from '@/types/api';

// TODO: Crear API de facturas cuando esté disponible
// import { facturasApi } from '@/apis/facturas.api';

interface Invoice {
  id: string;
  number: string;
  date: string;
  clientName: string;
  clientType: "guest" | "corporate";
  reservationCode?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  balance: number;
  payments: Array<{
    id: string;
    amount: number;
    methodId: string;
    methodName: string;
    reference?: string;
    date: string;
    notes?: string;
  }>;
  notes?: string;
}

interface UseInvoicesOptions {
  page?: number;
  limit?: number;
  status?: string;
  clientName?: string;
  refreshInterval?: number;
}

interface UseInvoicesReturn {
  invoices: Invoice[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | undefined;
  mutate: () => void;
  refreshInvoices: () => void;
}

/**
 * Custom hook para obtener y gestionar facturas
 * NOTA: Por ahora retorna datos mock hasta que la API esté disponible
 */
export function useInvoices(options: UseInvoicesOptions = {}): UseInvoicesReturn {
  const {
    page = 1,
    limit = 100,
    status,
    clientName,
    refreshInterval,
  } = options;

  const swrKey = ['invoices', page, limit, status, clientName]
    .filter(Boolean)
    .join('-');

  // Fetcher temporal con datos mock
  const fetcher = async () => {
    // TODO: Reemplazar con llamada real a la API
    // const response = await facturasApi.traerTodos(page, limit, { status, clientName });
    
    // Datos mock temporales
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const today = new Date().toISOString().split('T')[0];
    const mockInvoices: Invoice[] = [
      {
        id: "inv-1",
        number: "F-1001",
        date: today,
        clientName: "Carla Mendoza",
        clientType: "guest",
        reservationCode: "RSV-240101",
        status: "paid",
        items: [
          {
            id: "item-1",
            description: "Hospedaje 2 noches",
            quantity: 2,
            unitPrice: 260,
            total: 520,
          },
          {
            id: "item-2",
            description: "Consumo minibar",
            quantity: 1,
            unitPrice: 60,
            total: 60,
          },
        ],
        subtotal: 580,
        tax: 104.4,
        total: 684.4,
        balance: 0,
        payments: [
          {
            id: "pay-1",
            amount: 684.4,
            methodId: "pm-2",
            methodName: "Tarjeta",
            date: today,
          },
        ],
      },
      {
        id: "inv-2",
        number: "F-1002",
        date: today,
        clientName: "Luis Garcia",
        clientType: "guest",
        reservationCode: "RSV-240102",
        status: "sent",
        items: [
          {
            id: "item-3",
            description: "Hospedaje 1 noche",
            quantity: 1,
            unitPrice: 320,
            total: 320,
          },
        ],
        subtotal: 320,
        tax: 57.6,
        total: 377.6,
        balance: 377.6,
        payments: [],
      },
    ];

    return {
      ok: true,
      facturas: mockInvoices,
      total: mockInvoices.length,
      page: 1,
      totalPages: 1,
    };
  };

  const { data, error, isLoading, mutate } = useSWR<
    {
      ok: boolean;
      facturas: Invoice[];
      total: number;
      page: number;
      totalPages: number;
    },
    ApiError
  >(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: refreshInterval,
      shouldRetryOnError: false,
      dedupingInterval: 2000,
    }
  );

  const refreshInvoices = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    invoices: data?.facturas || [],
    total: data?.total || 0,
    page: data?.page || 1,
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
