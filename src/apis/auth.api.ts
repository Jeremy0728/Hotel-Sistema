import { apiPost, apiGet } from "@/lib/api/apiWrapper";
import { AuthResponse } from "@/types/auth";

export const authApi = {
  // POST /api/auth/login
  login: async (email: string, password: string, hotelId: string): Promise<AuthResponse> => {
    return await apiPost<AuthResponse>("/auth/login", { email, password }, {
      headers: { "X-Hotel-Id": hotelId }
    });
  },

  // GET /api/auth/renovar
  renovarToken: async (): Promise<AuthResponse> => {
    return await apiGet<AuthResponse>("/auth/renovar");
  },

  // POST /api/auth/cambiar-password
  cambiarPassword: async (passwordActual: string, passwordNuevo: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/auth/cambiar-password", { passwordActual, passwordNuevo });
  },

  // POST /api/auth/recuperar-password
  recuperarPassword: async (email: string, hotelId: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/auth/recuperar-password", { email }, {
      headers: { "X-Hotel-Id": hotelId }
    });
  },

  // POST /api/auth/resetear-password
  resetearPassword: async (token: string, passwordNuevo: string, hotelId: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/auth/resetear-password", { token, passwordNuevo }, {
      headers: { "X-Hotel-Id": hotelId }
    });
  },
};
