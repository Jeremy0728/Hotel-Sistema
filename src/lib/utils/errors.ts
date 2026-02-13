import { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';
import { ApiError, ErrorHandlingOptions } from '@/types/api';

/**
 * Verifica si un error es de tipo JWT expirado
 */
export const isJWTExpiredError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
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
export const isNotFoundError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return false;
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
    return error.response?.data?.msg || error.message || 'Error desconocido';
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
    return error.response?.data?.errors || [];
  }
  return [];
};

/**
 * Maneja errores de API de forma centralizada
 */
export const handleApiError = (error: unknown, options: ErrorHandlingOptions = {}): ApiError => {
  const {
    showToast = false,
    customMessage,
    redirectOnError = false,
    redirectUrl = '/dashboard',
  } = options;

  // Verificar si es un error de JWT expirado
  if (isJWTExpiredError(error)) {
    handleJWTExpiredLogout({ showToast: true });
    return {
      ok: false,
      msg: 'Sesión expirada',
      statusCode: 401,
    };
  }

  // Obtener mensaje de error
  const errorMessage = customMessage || getErrorMessage(error);
  const validationErrors = getValidationErrors(error);

  // Mostrar toast si está habilitado
  if (showToast) {
    console.error(errorMessage);
    // Aquí puedes agregar un toast notification
  }

  // Redirigir si está habilitado
  if (redirectOnError && typeof window !== 'undefined') {
    window.location.href = redirectUrl;
  }

  // Retornar error formateado
  const apiError: ApiError = {
    ok: false,
    msg: errorMessage,
    errors: validationErrors,
  };

  if (error instanceof AxiosError) {
    apiError.statusCode = error.response?.status;
  }

  return apiError;
};
