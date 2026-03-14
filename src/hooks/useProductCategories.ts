import useSWR from 'swr';
import { categoriasProductosApi } from '@/apis/categorias-productos.api';

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
}

interface UseProductCategoriesOptions {
  page?: number;
  limit?: number;
}

export function useProductCategories(options: UseProductCategoriesOptions = {}) {
  const { page = 1, limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['product-categories', page, limit],
    async () => {
      const response = await categoriasProductosApi.traerTodos(page, limit);
      return {
        categories: response.productCategories || [],
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

  const refreshCategories = () => mutate();

  return {
    categories: data?.categories || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshCategories,
  };
}

export function useProductCategory(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['product-category', id] : null,
    async () => {
      const response = await categoriasProductosApi.traerPorId(id);
      return response.categoria;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshCategory = () => mutate();

  return {
    category: data,
    isLoading,
    isError: !!error,
    error,
    refreshCategory,
  };
}

export function useActiveProductCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    'active-product-categories',
    async () => {
      const response = await categoriasProductosApi.obtenerActivas();
      return response.categorias || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshActiveCategories = () => mutate();

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshActiveCategories,
  };
}
