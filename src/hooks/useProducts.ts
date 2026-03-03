import useSWR from 'swr';
import { productosApi } from '@/apis/productos.api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  price: string;
  cost?: string;
  sku?: string;
  barcode?: string;
  unit: string;
  is_active: boolean;
}

interface UseProductsOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 100, filters } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['products', page, limit, filters],
    async () => {
      const response = await productosApi.traerTodos(page, limit, filters);
      return {
        products: response.productos || [],
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

  const refreshProducts = () => mutate();

  return {
    products: data?.products || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshProducts,
  };
}

export function useProduct(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['product', id] : null,
    async () => {
      const response = await productosApi.traerPorId(id);
      return response.producto;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshProduct = () => mutate();

  return {
    product: data,
    isLoading,
    isError: !!error,
    error,
    refreshProduct,
  };
}

export function useActiveProducts() {
  const { data, error, isLoading, mutate } = useSWR(
    'active-products',
    async () => {
      const response = await productosApi.obtenerActivos();
      return response.productos || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshActiveProducts = () => mutate();

  return {
    products: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshActiveProducts,
  };
}
