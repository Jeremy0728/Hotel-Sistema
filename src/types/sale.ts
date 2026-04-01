// Tipos centralizados para el módulo de ventas

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

/**
 * Información de ubicación de inventario asociada a una venta
 */
export interface SaleLocation {
  id: number;
  name: string;
  location_type: string;
}

/**
 * Información de reserva asociada a una venta
 */
export interface SaleReservation {
  id: number;
  confirmation_code: string;
  check_in_date: string;
  check_out_date: string;
}

/**
 * Información de huésped asociado a una venta
 */
export interface SaleGuest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email?: string;
  phone?: string;
}

/**
 * Información del procesador de la venta
 */
export interface SaleProcessor {
  id: number;
  name: string;
  email: string;
}

/**
 * Información de factura asociada a una venta
 */
export interface SaleInvoice {
  id: number;
  invoice_number: string;
  issue_date: string;
  total_amount: string;
  status: string;
}

/**
 * Venta completa con todas sus relaciones
 */
export interface Sale {
  id: number;
  sale_number: string;
  location_id: number;
  reservation_id?: number | null;
  guest_id?: number | null;
  subtotal: number | string;
  tax_amount: number | string;
  discount_amount: number | string;
  total_amount: number | string;
  payment_method: string;
  payment_status: PaymentStatus;
  processed_by: number;
  created_at: string;
  location?: SaleLocation;
  reservation?: SaleReservation;
  guest?: SaleGuest;
  processor?: SaleProcessor;
  invoice?: SaleInvoice;
}

/**
 * Respuesta de la API para obtener todas las ventas
 */
export interface SalesResponse {
  ok: boolean;
  sales: Sale[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Respuesta de la API para obtener una venta por ID
 */
export interface SaleResponse {
  ok: boolean;
  sale: Sale;
}

/**
 * Respuesta de mutación de venta (crear/actualizar)
 */
export interface SaleMutationResponse {
  ok: boolean;
  sale: Sale;
}

/**
 * Opciones para el hook useSales
 */
export interface UseSalesOptions {
  page?: number;
  limit?: number;
  payment_status?: PaymentStatus;
  location_id?: number;
  reservation_id?: number;
  guest_id?: number;
  from_date?: string;
  to_date?: string;
}

/**
 * Retorno del hook useSales
 */
export interface UseSalesReturn {
  sales: Sale[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refreshSales: () => void;
}

/**
 * Retorno del hook useSale (individual)
 */
export interface UseSaleReturn {
  sale: Sale | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refreshSale: () => void;
}
