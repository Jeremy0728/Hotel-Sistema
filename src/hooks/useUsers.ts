import useSWR from 'swr';
import { usuariosApi } from '@/apis/usuarios.api';
import { User } from '@/types/auth';

interface UseUsersOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { page = 1, limit = 100, filters } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['users', page, limit, filters],
    async () => {
      const response = await usuariosApi.traerTodos(page, limit, filters);
      return {
        users: response.usuarios || [],
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

  const refreshUsers = () => mutate();

  return {
    users: data?.users || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshUsers,
  };
}

export function useUser(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['user', id] : null,
    async () => {
      const response = await usuariosApi.traerPorId(id);
      return response.usuario;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshUser = () => mutate();

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
    refreshUser,
  };
}
