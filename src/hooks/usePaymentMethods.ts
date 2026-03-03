import useSWR from 'swr';
import { metodosPagoApi } from '@/apis/metodos-pago.api';

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface UsePaymentMethodsOptions {
  page?: number;
  limit?: number;
}

export function usePaymentMethods(options: UsePaymentMethodsOptions = {}) {
  const { page = 1, limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['payment-methods', page, limit],
    async () => {
      const response = await metodosPagoApi.traerTodos(page, limit);
      return {
        paymentMethods: response.metodos || [],
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

  const refreshPaymentMethods = () => mutate();

  return {
    paymentMethods: data?.paymentMethods || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshPaymentMethods,
  };
}

export function usePaymentMethod(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['payment-method', id] : null,
    async () => {
      const response = await metodosPagoApi.traerPorId(id);
      return response.metodo;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshPaymentMethod = () => mutate();

  return {
    paymentMethod: data,
    isLoading,
    isError: !!error,
    error,
    refreshPaymentMethod,
  };
}
