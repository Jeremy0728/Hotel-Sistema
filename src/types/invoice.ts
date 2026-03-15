// Tipos centralizados para el módulo de facturas

import type { PaymentMethod } from './payment-method';

// Re-exportar PaymentMethod para compatibilidad con código existente
export type { PaymentMethod };

/**
 * Estados posibles de una factura
 */
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

/**
 * Estados posibles de un pago
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Información de reserva asociada a una factura
 */
export interface InvoiceReservation {
  id: number;
  confirmation_code: string;
  check_in_date: string;
  check_out_date: string;
}

/**
 * Información de huésped asociado a una factura
 */
export interface InvoiceGuest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  email?: string;
  phone?: string;
}

/**
 * Información de cliente corporativo asociado a una factura
 */
export interface InvoiceCorporateClient {
  id: number;
  company_name: string;
  tax_id: string;
  email?: string;
  phone?: string;
}

/**
 * Información del creador de la factura
 */
export interface InvoiceCreator {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  email: string;
}

/**
 * Producto en un item de venta
 */
export interface SaleItemProduct {
  id: number;
  name: string;
  sku?: string;
}

/**
 * Item de venta
 */
export interface SaleItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  product?: SaleItemProduct;
}

/**
 * Venta asociada a una factura
 */
export interface InvoiceSale {
  id: number;
  sale_number: string;
  total_amount: string;
  payment_status: string;
  created_at?: string;
  items?: SaleItem[];
}

/**
 * Tipos de relación de un pago
 */
export type PaymentRelationType = 'direct_invoice' | 'reservation' | 'sale';

/**
 * Información de venta asociada a un pago
 */
export interface PaymentSale {
  id: number;
  sale_number: string;
}

/**
 * Pago asociado a una factura o reserva
 */
export interface Payment {
  id: number;
  payment_number: string;
  reservation_id?: number | null;
  sale_id?: number | null;
  invoice_id?: number | null;
  amount: string;
  payment_method_id?: number | null;
  payment_date: string;
  status: PaymentStatus;
  card_last_four?: string | null;
  transaction_id?: string | null;
  authorization_code?: string | null;
  notes?: string | null;
  processed_by?: number;
  created_at?: string;
  paymentMethod?: PaymentMethod;
  relation_type?: PaymentRelationType;
  sale?: PaymentSale;
}

/**
 * Factura completa
 * Basado en la respuesta de la API /api/facturas
 */
export interface Invoice {
  id: number;
  invoice_number: string;
  reservation_id?: number | null;
  guest_id?: number | null;
  corporate_client_id?: number | null;
  issue_date: string;
  due_date?: string | null;
  subtotal: string | number;
  tax_amount: string | number;
  discount_amount: string | number;
  total_amount: string | number;
  status: InvoiceStatus;
  notes?: string | null;
  created_by?: number;
  created_at?: string;
  reservation?: InvoiceReservation | null;
  guest?: InvoiceGuest | null;
  corporateClient?: InvoiceCorporateClient | null;
  creator?: InvoiceCreator;
  sales?: InvoiceSale[];
  payments?: Payment[];
  all_related_payments?: Payment[];
}

/**
 * Datos para crear una factura
 */
export interface CreateInvoiceData {
  invoice_number?: string;
  reservation_id?: number | null;
  guest_id?: number | null;
  corporate_client_id?: number | null;
  issue_date?: string;
  due_date?: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount?: number;
  total_amount: number;
  status?: InvoiceStatus;
  notes?: string | null;
}

/**
 * Datos para actualizar una factura
 */
export interface UpdateInvoiceData {
  invoice_number?: string;
  reservation_id?: number | null;
  guest_id?: number | null;
  corporate_client_id?: number | null;
  issue_date?: string;
  due_date?: string | null;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  status?: InvoiceStatus;
  notes?: string | null;
}

/**
 * Datos para crear un pago
 */
export interface CreatePaymentData {
  payment_number?: string;
  reservation_id?: number | null;
  sale_id?: number | null;
  invoice_id?: number | null;
  amount: number;
  payment_method_id?: number | null;
  payment_date?: string;
  status?: PaymentStatus;
  card_last_four?: string | null;
  transaction_id?: string | null;
  authorization_code?: string | null;
  notes?: string | null;
}

/**
 * Respuesta de la API para obtener todas las facturas
 */
export interface InvoicesResponse {
  ok: boolean;
  invoices: Invoice[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Respuesta de la API para obtener una factura por ID
 */
export interface InvoiceResponse {
  ok: boolean;
  invoice: Invoice;
}

/**
 * Respuesta de la API para crear/actualizar una factura
 */
export interface InvoiceMutationResponse {
  ok: boolean;
  invoice: Invoice;
  msg?: string;
}

/**
 * Respuesta de la API para obtener pagos
 */
export interface PaymentsResponse {
  ok: boolean;
  payments: Payment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Respuesta de la API para crear un pago
 */
export interface PaymentMutationResponse {
  ok: boolean;
  payment: Payment;
  msg?: string;
}

/**
 * Respuesta de la API para obtener métodos de pago
 */
export interface PaymentMethodsResponse {
  ok: boolean;
  payment_methods: PaymentMethod[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

// ============================================
// Tipos para Hooks de Facturas
// ============================================

/**
 * Opciones para el hook useInvoices
 */
export interface UseInvoicesOptions {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  clientName?: string;
  fromDate?: string;
  toDate?: string;
  refreshInterval?: number;
}

/**
 * Retorno del hook useInvoices
 */
export interface UseInvoicesReturn {
  invoices: Invoice[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  mutate: () => void;
  refreshInvoices: () => void;
}

/**
 * Opciones para el hook useInvoiceById
 */
export interface UseInvoiceByIdOptions {
  invoiceId: number;
  refreshInterval?: number;
}

/**
 * Retorno del hook useInvoiceById
 */
export interface UseInvoiceByIdReturn {
  invoice: Invoice | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  mutate: () => void;
  refreshInvoice: () => void;
}
