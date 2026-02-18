import { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';
import { ApiError, ErrorHandlingOptions } from '@/types/api';
import { showErrorToast } from '@/components/toastUtils';

// Interfaz para errores de validación de la API
interface ValidationError {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: unknown;
}

// Interfaz para la respuesta de error de la API
interface ApiErrorResponse {
  ok: boolean;
  msg?: string;
  errors?: ValidationError[] | string[] | string | Record<string, ValidationError>;
  statusCode?: number;
}

// Tipos de errores específicos
export enum ErrorType {
  JWT_EXPIRED = 'JWT_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

// Interfaz para el resultado del manejo de errores
export interface ErrorHandlingResult {
  type: ErrorType;
  message: string;
  handled: boolean;
  shouldLogout: boolean;
  originalError: unknown;
}

/**
 * Verifica si un error es de tipo JWT expirado
 */
export const isJWTExpiredError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    return (
      error.response?.status === 401 &&
      (errorData?.msg === 'Token expired' ||
       errorData?.msg === 'jwt expired' ||
       errorData?.msg === 'Not authorized, token failed')
    );
  }
  return false;
};

/**
 * Verifica si un error es de tipo sin permisos
 */
export const isForbiddenError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
};

/**
 * Verifica si un error es de tipo no encontrado
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return false;
};

/**
 * Procesa errores de validación y muestra toasts individuales
 */
const processValidationErrors = (errors: ValidationError[] | string[] | string | Record<string, ValidationError>): string[] => {
  const errorMessages: string[] = [];
  
  // Si errors es un objeto con propiedades (formato: { limit: { msg, path, ... }, page: { ... } })
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    Object.entries(errors).forEach(([key, error]) => {
      if (typeof error === 'object' && error.msg) {
        const message = `${error.path || key}: ${error.msg}`;
        errorMessages.push(message);
        showErrorToast('Error de validación', message);
      } else if (typeof error === 'string') {
        const message = `${key}: ${error}`;
        errorMessages.push(message);
        showErrorToast('Error de validación', message);
      }
    });
  }
  // Si errors es un array
  else if (Array.isArray(errors)) {
    errors.forEach((error) => {
      if (typeof error === 'string') {
        // Error simple como string
        errorMessages.push(error);
        showErrorToast('Error de validación', error);
      } else if (typeof error === 'object' && error.msg) {
        // Error de validación con formato completo
        const message = `${error.path}: ${error.msg}`;
        errorMessages.push(message);
        showErrorToast('Error de validación', message);
      }
    });
  }
  // Si errors es un string simple
  else if (typeof errors === 'string') {
    errorMessages.push(errors);
    showErrorToast('Error', errors);
  }
  
  return errorMessages;
};

/**
 * Maneja el cierre de sesión cuando el JWT expira
 */
export const handleJWTExpiredLogout = async (options: ErrorHandlingOptions = {}) => {
  const {
    showToast = true,
    customMessage = 'Tu sesión ha expirado. Serás redirigido al login.',
  } = options;

  if (showToast) {
    console.warn(customMessage);
    // Aquí puedes agregar un toast notification si tienes una librería instalada
  }

  // Cerrar sesión y redirigir al login
  await signOut({ 
    redirect: true, 
    callbackUrl: '/auth/login' 
  });
};

/**
 * Extrae el mensaje de error de una respuesta de API
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    return errorData?.msg || error.message || 'Error desconocido';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Error desconocido';
};

/**
 * Extrae los errores de validación de una respuesta de API
 */
export const getValidationErrors = (error: unknown): string[] => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    const errors = errorData?.errors;
    
    if (!errors) return [];
    
    // Si errors es un objeto con propiedades
    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
      return Object.entries(errors).map(([key, err]) => {
        if (typeof err === 'object' && err.msg) {
          return `${err.path || key}: ${err.msg}`;
        }
        if (typeof err === 'string') {
          return `${key}: ${err}`;
        }
        return 'Error de validación';
      });
    }
    
    // Si errors es un array
    if (Array.isArray(errors)) {
      return errors.map(err => {
        if (typeof err === 'string') return err;
        if (typeof err === 'object' && err.msg) return `${err.path}: ${err.msg}`;
        return 'Error de validación';
      });
    }
    
    // Si errors es un string
    if (typeof errors === 'string') return [errors];
  }
  return [];
};

/**
 * Maneja errores de API de forma centralizada
 */
export const handleApiError = (error: unknown, options: ErrorHandlingOptions = {}): ApiError => {
  const {
    showToast = true,
    customMessage,
    redirectOnError = false,
    redirectUrl = '/dashboard',
    skipJWTHandling = false,
  } = options;

  console.log('🚀 ~ handleApiError ~ error:', error);

  // Verificar si es un error de JWT expirado
  if (!skipJWTHandling && isJWTExpiredError(error)) {
    handleJWTExpiredLogout({ showToast: true });
    return {
      ok: false,
      msg: 'Sesión expirada',
      statusCode: 401,
    };
  }

  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    const statusCode = error.response?.status;
    let errorMessage = customMessage || errorData?.msg || error.message;

    // Determinar mensaje de error según el código de estado
    if (statusCode === 401) {
      errorMessage = errorMessage || 'No autorizado';
    } else if (statusCode === 403) {
      errorMessage = errorMessage || 'Acceso prohibido';
    } else if (statusCode === 404) {
      errorMessage = errorMessage || 'Recurso no encontrado';
    } else if (statusCode && statusCode >= 500) {
      errorMessage = errorMessage || 'Error interno del servidor';
    } else if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      errorMessage = errorMessage || 'Error de conexión';
    }

    // Procesar errores de validación
    let validationErrors: string[] = [];
    if (errorData?.errors && showToast) {
      validationErrors = processValidationErrors(errorData.errors);
    }

    // Mostrar mensaje general si no hay errores de validación
    if (showToast && (!errorData?.errors || validationErrors.length === 0)) {
      if (errorMessage) {
        showErrorToast('Error', errorMessage);
      }
    }

    // Redirigir si está habilitado
    if (redirectOnError && typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }

    return {
      ok: false,
      msg: errorMessage || 'Error desconocido',
      errors: validationErrors,
      statusCode,
    };
  }

  // Manejar errores que no son de Axios
  if (error instanceof Error) {
    const errorMessage = customMessage || error.message;
    if (showToast) {
      showErrorToast('Error', errorMessage);
    }
    return {
      ok: false,
      msg: errorMessage,
    };
  }

  // Error desconocido
  const errorMessage = customMessage || 'Error desconocido';
  if (showToast) {
    showErrorToast('Error', errorMessage);
  }

  return {
    ok: false,
    msg: errorMessage,
  };
};

/**
 * Alias de handleApiError para compatibilidad
 */
export function handleErrors(error: unknown, options?: ErrorHandlingOptions): ApiError {
  return handleApiError(error, options);
}

/**
 * Función de conveniencia para manejar errores en hooks con SWR
 */
export const handleSWRError = (error: unknown): void => {
  handleApiError(error, { showToast: true });
};
