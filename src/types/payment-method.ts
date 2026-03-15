// Tipos centralizados para métodos de pago

export type PaymentMethodType = 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'check' | 'other';

export interface PaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  is_active: boolean;
  description?: string;
  created_at?: string;
}

export interface PaymentMethodsResponse {
  ok: boolean;
  paymentMethods: PaymentMethod[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PaymentMethodResponse {
  ok: boolean;
  paymentMethod: PaymentMethod;
}

export interface PaymentMethodMutationResponse {
  ok: boolean;
  paymentMethod: PaymentMethod;
}

export interface PaymentMethodDeleteResponse {
  ok: boolean;
  msg: string;
}

export interface UsePaymentMethodsOptions {
  page?: number;
  limit?: number;
  is_active?: boolean;
}

export interface UsePaymentMethodsReturn {
  paymentMethods: PaymentMethod[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refreshPaymentMethods: () => void;
}

export interface UsePaymentMethodReturn {
  paymentMethod: PaymentMethod | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refreshPaymentMethod: () => void;
}
