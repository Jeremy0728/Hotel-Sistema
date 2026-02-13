import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Crear instancia de Axios con configuración base
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Agregar JWT y Hotel ID automáticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      
      // Agregar token JWT si existe
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
      
      // Agregar Hotel ID para multi-tenant (si existe en la sesión)
      if (session?.user?.hotelId) {
        config.headers['X-Hotel-Id'] = session.user.hotelId;
      }
      
      return config;
    } catch (error) {
      console.error('Error en interceptor de request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Retornar la respuesta exitosa
    return response;
  },
  async (error: AxiosError) => {
    // Manejar error 401 (No autorizado / Token expirado)
    if (error.response?.status === 401) {
      console.warn('Token expirado o no autorizado. Cerrando sesión...');
      
      // Cerrar sesión automáticamente
      await signOut({ 
        redirect: true, 
        callbackUrl: '/auth/login' 
      });
    }
    
    // Manejar error 403 (Prohibido / Sin permisos)
    if (error.response?.status === 403) {
      console.error('Acceso prohibido. No tienes permisos para esta acción.');
    }
    
    // Manejar error 404 (No encontrado)
    if (error.response?.status === 404) {
      console.error('Recurso no encontrado.');
    }
    
    // Manejar error 500 (Error del servidor)
    if (error.response?.status === 500) {
      console.error('Error interno del servidor.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
