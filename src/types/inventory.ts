// Tipos centralizados para el módulo de inventario

/**
 * Tipos de ubicación de inventario según la API
 * Valores permitidos: 'reception', 'minibar', 'storage', 'restaurant'
 */
export type InventoryLocationType = 'reception' | 'minibar' | 'storage' | 'restaurant' | 'warehouse';

/**
 * Ubicación de inventario
 * Basado en la respuesta de la API /api/ubicaciones-inventario
 */
export interface InventoryLocation {
  id: number;
  name: string;
  location_type: InventoryLocationType;
  room_id?: number | null;
  is_active: boolean;
  created_at?: string;
  room?: {
    id: number;
    number: string;
    room_type: string;
  } | null;
}

/**
 * Producto de inventario
 * Basado en la respuesta de la API /api/productos
 */
export interface InventoryProduct {
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
  category?: ProductCategory;
}

/**
 * Categoría de producto
 * Basado en la respuesta de la API /api/categorias-productos
 */
export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
}

/**
 * Item de inventario (stock)
 * Basado en la respuesta de la API /api/inventario
 */
export interface InventoryItem {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  min_stock?: number;
  max_stock?: number;
  last_updated: string;
}

/**
 * Respuesta de la API para ubicaciones de inventario
 */
export interface InventoryLocationsResponse {
  ok: boolean;
  locations: InventoryLocation[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Respuesta de la API para una ubicación de inventario
 */
export interface InventoryLocationResponse {
  ok: boolean;
  location: InventoryLocation;
}

/**
 * Respuesta de la API para productos
 */
export interface InventoryProductsResponse {
  ok: boolean;
  productos: InventoryProduct[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Respuesta de la API para categorías de productos
 */
export interface ProductCategoriesResponse {
  ok: boolean;
  categorias: ProductCategory[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Respuesta de la API para items de inventario
 */
export interface InventoryItemsResponse {
  ok: boolean;
  inventario: InventoryItem[];
  total: number;
  page: number;
  totalPages: number;
}
