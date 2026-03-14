import useSWR from 'swr';
import { inventarioApi } from '@/apis/inventario.api';

export interface InventoryItem {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  min_stock?: number;
  max_stock?: number;
  last_updated: string;
}

interface UseInventoryOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
}

export function useInventory(options: UseInventoryOptions = {}) {
  const { page = 1, limit = 100, filters } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['inventory', page, limit, filters],
    async () => {
      const response = await inventarioApi.traerTodos(page, limit, filters);
      return {
        inventory: response.inventories || [],
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

  const refreshInventory = () => mutate();

  return {
    inventory: data?.inventory || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshInventory,
  };
}

export function useInventoryByLocation(locationId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    locationId ? ['inventory-by-location', locationId] : null,
    async () => {
      const response = await inventarioApi.traerPorUbicacion(locationId);
      return response.inventario || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshInventoryByLocation = () => mutate();

  return {
    inventory: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshInventoryByLocation,
  };
}

export function useInventoryByProduct(productId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    productId ? ['inventory-by-product', productId] : null,
    async () => {
      const response = await inventarioApi.traerPorProducto(productId);
      return response.inventario || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshInventoryByProduct = () => mutate();

  return {
    inventory: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshInventoryByProduct,
  };
}

export function useLowStockInventory() {
  const { data, error, isLoading, mutate } = useSWR(
    'low-stock-inventory',
    async () => {
      const response = await inventarioApi.obtenerBajoStock();
      return response.inventario || [];
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  const refreshLowStock = () => mutate();

  return {
    inventory: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshLowStock,
  };
}
