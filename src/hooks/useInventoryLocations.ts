import useSWR from 'swr';
import { ubicacionesInventarioApi } from '@/apis/ubicaciones-inventario.api';
import type { InventoryLocation } from '@/types/inventory';

interface UseInventoryLocationsOptions {
  page?: number;
  limit?: number;
}

export function useInventoryLocations(options: UseInventoryLocationsOptions = {}) {
  const { page = 1, limit = 100 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['inventory-locations', page, limit],
    async () => {
      const response = await ubicacionesInventarioApi.traerTodos(page, limit);
      
      // Mapear la respuesta de la API al tipo InventoryLocation
      const locations: InventoryLocation[] = (response.locations || []).map(ubicacion => ({
        id: ubicacion.id,
        name: ubicacion.name,
        location_type: mapApiTypeToLocationType(ubicacion.location_type),
        room_id: ubicacion.room_id,
        is_active: ubicacion.is_active,
        created_at: ubicacion.created_at,
        roomNumber: ubicacion.room?.number || '',
      }));
      
      return {
        locations,
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

  const refreshLocations = () => mutate();

  return {
    locations: data?.locations || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: !!error,
    error,
    refreshLocations,
  };
}

// Función helper para mapear tipos de la API a tipos de la aplicación
function mapApiTypeToLocationType(apiType: string): InventoryLocation['location_type'] {
  const typeMap: Record<string, InventoryLocation['location_type']> = {
    'almacen': 'storage',
    'minibar': 'minibar',
    'cocina': 'restaurant',
    'bar': 'reception',
    'otro': 'warehouse',
  };
  return typeMap[apiType] || 'warehouse';
}

export function useInventoryLocation(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['inventory-location', id] : null,
    async () => {
      const response = await ubicacionesInventarioApi.traerPorId(id);
      const ubicacion = response.ubicacion;
      
      // Mapear al tipo InventoryLocation
      const location: InventoryLocation = {
        id: ubicacion.id,
        name: ubicacion.name,
        location_type: mapApiTypeToLocationType(ubicacion.location_type),
        room_id: ubicacion.room_id,
        is_active: ubicacion.is_active,
        created_at: ubicacion.created_at,
      };
      
      return location;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshLocation = () => mutate();

  return {
    location: data,
    isLoading,
    isError: !!error,
    error,
    refreshLocation,
  };
}

export function useActiveInventoryLocations() {
  const { data, error, isLoading, mutate } = useSWR(
    'active-inventory-locations',
    async () => {
      const response = await ubicacionesInventarioApi.obtenerActivas();
      return response.ubicaciones || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  const refreshActiveLocations = () => mutate();

  return {
    locations: data || [],
    isLoading,
    isError: !!error,
    error,
    refreshActiveLocations,
  };
}
