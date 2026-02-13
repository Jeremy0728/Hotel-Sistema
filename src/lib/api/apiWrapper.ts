import { AxiosError, AxiosRequestConfig } from 'axios';
import apiClient from '@/lib/axios/interceptors';
import { ApiCallOptions, ApiError } from '@/types/api';

/**
 * Construye una URL con query parameters
 */
export const buildUrl = (baseUrl: string, params: Record<string, any> = {}): string => {
  const url = new URL(baseUrl, apiClient.defaults.baseURL);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.pathname + url.search;
};

/**
 * Maneja errores de las llamadas a API
 */
const handleApiError = (error: unknown, options?: ApiCallOptions): ApiError => {
  if (error instanceof AxiosError) {
    const apiError: ApiError = {
      ok: false,
      msg: error.response?.data?.msg || error.message || 'Error desconocido',
      errors: error.response?.data?.errors || [],
      statusCode: error.response?.status,
    };

    // Log del error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: apiError.msg,
        errors: apiError.errors,
      });
    }

    return apiError;
  }

  // Error genérico
  return {
    ok: false,
    msg: options?.customErrorMessage || 'Error al procesar la solicitud',
    errors: [],
  };
};

/**
 * Wrapper para peticiones GET
 */
export const apiGet = async <T = any>(
  url: string,
  options?: ApiCallOptions
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
      params: options?.params,
    };

    const response = await apiClient.get(url, config);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, options);
    throw apiError;
  }
};

/**
 * Wrapper para peticiones POST
 */
export const apiPost = async <T = any>(
  url: string,
  data?: any,
  options?: ApiCallOptions
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    };

    const response = await apiClient.post(url, data, config);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, options);
    throw apiError;
  }
};

/**
 * Wrapper para peticiones PUT
 */
export const apiPut = async <T = any>(
  url: string,
  data?: any,
  options?: ApiCallOptions
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    };

    const response = await apiClient.put(url, data, config);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, options);
    throw apiError;
  }
};

/**
 * Wrapper para peticiones PATCH
 */
export const apiPatch = async <T = any>(
  url: string,
  data?: any,
  options?: ApiCallOptions
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    };

    const response = await apiClient.patch(url, data, config);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, options);
    throw apiError;
  }
};

/**
 * Wrapper para peticiones DELETE
 */
export const apiDelete = async <T = any>(
  url: string,
  options?: ApiCallOptions
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    };

    const response = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error, options);
    throw apiError;
  }
};
