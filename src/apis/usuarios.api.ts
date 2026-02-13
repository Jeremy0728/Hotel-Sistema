import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiWrapper";
import { User } from "@/types/auth";

interface ResponseUsuarios {
  ok: boolean;
  usuarios: User[];
  total: number;
  page: number;
  totalPages: number;
}

export const usuariosApi = {
  // GET /api/users/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: Record<string, string>): Promise<ResponseUsuarios> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiGet<ResponseUsuarios>(`/users/traer-todos?${params}`);
  },

  // GET /api/users/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; usuario: User }> => {
    return await apiGet(`/users/traer-por-id/${id}`);
  },

  // POST /api/users/crear
  crear: async (data: Partial<User> & { password: string }): Promise<{ ok: boolean; usuario: User }> => {
    return await apiPost("/users/crear", data);
  },

  // PUT /api/users/actualizar/:id
  actualizar: async (id: number, data: Partial<User>): Promise<{ ok: boolean; usuario: User }> => {
    return await apiPut(`/users/actualizar/${id}`, data);
  },

  // PATCH /api/users/activar/:id
  activar: async (id: number): Promise<{ ok: boolean; usuario: User }> => {
    return await apiPatch(`/users/activar/${id}`, {});
  },

  // PATCH /api/users/desactivar/:id
  desactivar: async (id: number): Promise<{ ok: boolean; usuario: User }> => {
    return await apiPatch(`/users/desactivar/${id}`, {});
  },

  // POST /api/users/cambiar-password/:id
  cambiarPassword: async (id: number, passwordNuevo: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost(`/users/cambiar-password/${id}`, { passwordNuevo });
  },

  // PUT /api/users/preferencias/:id
  actualizarPreferencias: async (id: number, preferencias: Record<string, unknown>): Promise<{ ok: boolean; usuario: User }> => {
    return await apiPut(`/users/preferencias/${id}`, { preferencias });
  },

  // DELETE /api/users/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/users/eliminar/${id}`);
  },
};
