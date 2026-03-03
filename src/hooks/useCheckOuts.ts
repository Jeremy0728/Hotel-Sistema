import useSWR from 'swr';
import { checkoutApi } from '@/apis/checkout.api';

export interface CheckOut {
  id: number;
  reservation_id: number;
  check_out_date: string;
  check_out_time: string;
  additional_charges?: string;
  damages?: string;
  notes?: string;
  checked_out_by: number;
}

interface UseCheckOutsOptions {
  limit?: number;
}

export function useCheckOuts(options: UseCheckOutsOptions = {}) {
  const { limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['checkouts', limit],
    async () => {
      const response = await checkoutApi.traerTodos(1, limit);
      return response.checkouts || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshCheckOuts = () => mutate();

  return {
    checkOuts: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshCheckOuts,
  };
}

export function useCheckOut(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['checkout', id] : null,
    async () => {
      const response = await checkoutApi.traerPorId(id);
      return response.checkout;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshCheckOut = () => mutate();

  return {
    checkOut: data,
    isLoading,
    isError: !!error,
    error,
    refreshCheckOut,
  };
}

export function useCheckOutByReservation(reservationId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    reservationId ? ['checkout-reservation', reservationId] : null,
    async () => {
      const response = await checkoutApi.traerPorReserva(reservationId);
      return response.checkout;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshCheckOut = () => mutate();

  return {
    checkOut: data,
    isLoading,
    isError: !!error,
    error,
    refreshCheckOut,
  };
}

export function usePendingCheckOuts() {
  const { data, error, isLoading, mutate } = useSWR(
    'checkouts-pending',
    async () => {
      const response = await checkoutApi.obtenerPendientes();
      return response.reservas || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshPendingCheckOuts = () => mutate();

  return {
    pendingReservations: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshPendingCheckOuts,
  };
}
