import useSWR from 'swr';
import { huespedesApi } from '@/apis/huespedes.api';

interface DocumentType {
  id: number;
  code: string;
  name: string;
  description?: string;
}

interface Country {
  id: number;
  code: string;
  name: string;
  nationality: string;
  phone_code?: string;
}

export interface Guest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  document_type_id?: number;
  document_number?: string;
  document_type?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country_id?: number;
  preferences?: Record<string, unknown>;
  created_at?: string;
  documentType?: DocumentType;
  country?: Country;
}

interface UseGuestsOptions {
  limit?: number;
  search?: string;
}

export function useGuests(options: UseGuestsOptions = {}) {
  const { limit = 100, search } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['guests', limit, search],
    async () => {
      const response = await huespedesApi.traerTodos(1, limit, search);
      return response.huespedes || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const refreshGuests = () => mutate();

  return {
    guests: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshGuests,
  };
}

export function useGuest(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['guest', id] : null,
    async () => {
      const response = await huespedesApi.traerPorId(id);
      return response.huesped;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshGuest = () => mutate();

  return {
    guest: data,
    isLoading,
    isError: !!error,
    error,
    refreshGuest,
  };
}
