import useSWR from 'swr';
import { ventasApi } from '@/apis/ventas.api';
import type {
  Sale,
  UseSalesOptions,
  UseSalesReturn,
  UseSaleReturn,
} from '@/types/sale';

// Re-exportar Sale para compatibilidad con código existente
export type { Sale };

export function useSales(options: UseSalesOptions = {}): UseSalesReturn {
  const {
    page = 1,
    limit = 100,
    payment_status,
    location_id,
    reservation_id,
    guest_id,
    from_date,
    to_date,
  } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['sales', page, limit, payment_status, location_id, reservation_id, guest_id, from_date, to_date],
    async () => {
      const response = await ventasApi.traerTodos(
        page,
        limit,
        payment_status,
        location_id,
        reservation_id,
        guest_id,
        from_date,
        to_date
      );
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshSales = () => mutate();

  return {
    sales: data?.sales || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshSales,
  };
}

export function useSale(id: number): UseSaleReturn {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['sale', id] : null,
    async () => {
      const response = await ventasApi.traerPorId(id);
      return response.sale;
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
