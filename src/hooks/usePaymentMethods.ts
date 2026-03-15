import useSWR from 'swr';
import { metodosPagoApi } from '@/apis/metodos-pago.api';
import type {
  UsePaymentMethodsOptions,
  UsePaymentMethodsReturn,
  UsePaymentMethodReturn,
} from '@/types/payment-method';

// Re-exportar PaymentMethod para compatibilidad con código existente
export type { PaymentMethod } from '@/types/payment-method';

export function usePaymentMethods(options: UsePaymentMethodsOptions = {}): UsePaymentMethodsReturn {
  const { page = 1, limit = 100, is_active } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['payment-methods', page, limit, is_active],
    async () => {
      const response = await metodosPagoApi.traerTodos(page, limit, is_active);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshPaymentMethods = () => mutate();

  return {
    paymentMethods: data?.paymentMethods || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshPaymentMethods,
  };
}

export function usePaymentMethod(id: number): UsePaymentMethodReturn {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['payment-method', id] : null,
    async () => {
      const response = await metodosPagoApi.traerPorId(id);
      return response.paymentMethod;
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
