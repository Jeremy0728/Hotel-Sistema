import useSWR from 'swr';
import { rolesApi } from '@/apis/roles.api';

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
}

interface UseRolesOptions {
  page?: number;
  limit?: number;
}

export function useRoles(options: UseRolesOptions = {}) {
  const { page = 1, limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['roles', page, limit],
    async () => {
      const response = await rolesApi.traerTodos(page, limit);
      return {
        roles: response.roles || [],
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

  const refreshRoles = () => mutate();

  return {
    roles: data?.roles || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshRoles,
  };
}

export function useRole(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['role', id] : null,
    async () => {
      const response = await rolesApi.traerPorId(id);
      return response.rol;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshRole = () => mutate();

  return {
    role: data,
    isLoading,
    isError: !!error,
    error,
    refreshRole,
  };
}
