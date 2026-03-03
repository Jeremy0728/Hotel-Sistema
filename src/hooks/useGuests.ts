import useSWR from 'swr';
import { huespedesApi } from '@/apis/huespedes.api';

export interface Guest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  fecha_nacimiento: string;
  nacionalidad: string;
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
