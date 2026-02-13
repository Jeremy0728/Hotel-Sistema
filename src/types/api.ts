// Tipos genéricos para respuestas de API

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  msg?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  ok: false;
  msg: string;
  errors?: string[];
  statusCode?: number;
}

// Opciones para llamadas a API
export interface ApiCallOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

// Opciones para manejo de errores
export interface ErrorHandlingOptions {
  showToast?: boolean;
  customMessage?: string;
  redirectOnError?: boolean;
  redirectUrl?: string;
}
