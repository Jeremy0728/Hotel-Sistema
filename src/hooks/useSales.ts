import useSWR from 'swr';
import { ventasApi } from '@/apis/ventas.api';

export interface Sale {
  id: number;
  sale_number: string;
  sale_date: string;
  customer_id?: number;
  reservation_id?: number;
  location_id: number;
  subtotal: string;
  tax: string;
  discount?: string;
  total: string;
  payment_method_id: number;
  status: 'completed' | 'cancelled' | 'pending';
  notes?: string;
  sold_by: number;
}

interface UseSalesOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
}

export function useSales(options: UseSalesOptions = {}) {
  const { page = 1, limit = 100, filters } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['sales', page, limit, filters],
    async () => {
      const response = await ventasApi.traerTodos(page, limit, filters);
      return {
        sales: response.ventas || [],
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

  const refreshSales = () => mutate();

  return {
    sales: data?.sales || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshSales,
  };
}

export function useSale(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['sale', id] : null,
    async () => {
      const response = await ventasApi.traerPorId(id);
      return response.venta;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshSale = () => mutate();

  return {
    sale: data,
    isLoading,
    isError: !!error,
    error,
    refreshSale,
  };
}
