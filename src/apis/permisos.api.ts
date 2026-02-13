import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Permiso {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  module: string;
  is_active: boolean;
}

interface ResponsePermisos {
  ok: boolean;
  permisos: Permiso[];
  total: number;
  page: number;
  totalPages: number;
}

export const permisosApi = {
  // GET /api/permisos/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponsePermisos> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponsePermisos>(`/permisos/traer-todos?${params}`);
  },

  // GET /api/permisos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; permiso: Permiso }> => {
    return await apiGet(`/permisos/traer-por-id/${id}`);
  },

  // POST /api/permisos/crear
  crear: async (data: Omit<Permiso, "id">): Promise<{ ok: boolean; permiso: Permiso }> => {
    return await apiPost("/permisos/crear", data);
  },

  // PUT /api/permisos/actualizar/:id
  actualizar: async (id: number, data: Partial<Permiso>): Promise<{ ok: boolean; permiso: Permiso }> => {
    return await apiPut(`/permisos/actualizar/${id}`, data);
  },

  // DELETE /api/permisos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/permisos/eliminar/${id}`);
  },

  // GET /api/permisos/por-modulo/:modulo
  obtenerPorModulo: async (modulo: string): Promise<{ ok: boolean; permisos: Permiso[] }> => {
    return await apiGet(`/permisos/por-modulo/${modulo}`);
  },
};
