import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Rol {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
}

interface ResponseRoles {
  ok: boolean;
  roles: Rol[];
  total: number;
  page: number;
  totalPages: number;
}

export const rolesApi = {
  // GET /api/roles/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseRoles> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseRoles>(`/roles/traer-todos?${params}`);
  },

  // GET /api/roles/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; rol: Rol }> => {
    return await apiGet(`/roles/traer-por-id/${id}`);
  },

  // POST /api/roles/crear
  crear: async (data: Omit<Rol, "id">): Promise<{ ok: boolean; rol: Rol }> => {
    return await apiPost("/roles/crear", data);
  },

  // PUT /api/roles/actualizar/:id
  actualizar: async (id: number, data: Partial<Rol>): Promise<{ ok: boolean; rol: Rol }> => {
    return await apiPut(`/roles/actualizar/${id}`, data);
  },

  // DELETE /api/roles/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/roles/eliminar/${id}`);
  },

  // GET /api/roles/activos
  obtenerActivos: async (): Promise<{ ok: boolean; roles: Rol[] }> => {
    return await apiGet("/roles/activos");
  },
};
