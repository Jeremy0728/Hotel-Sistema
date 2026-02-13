import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Plan {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_mensual: string;
  precio_anual: string;
  max_usuarios?: number;
  max_habitaciones?: number;
  caracteristicas?: Record<string, unknown>;
  is_active: boolean;
}

interface ResponsePlanes {
  ok: boolean;
  planes: Plan[];
  total: number;
  page: number;
  totalPages: number;
}

export const planesApi = {
  // GET /api/planes/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponsePlanes> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponsePlanes>(`/planes/traer-todos?${params}`);
  },

  // GET /api/planes/traer-por-id/:id
  traerPorId: async (id: string): Promise<{ ok: boolean; plan: Plan }> => {
    return await apiGet(`/planes/traer-por-id/${id}`);
  },

  // POST /api/planes/crear
  crear: async (data: Omit<Plan, "id">): Promise<{ ok: boolean; plan: Plan }> => {
    return await apiPost("/planes/crear", data);
  },

  // PUT /api/planes/actualizar/:id
  actualizar: async (id: string, data: Partial<Plan>): Promise<{ ok: boolean; plan: Plan }> => {
    return await apiPut(`/planes/actualizar/${id}`, data);
  },

  // DELETE /api/planes/eliminar/:id
  eliminar: async (id: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/planes/eliminar/${id}`);
  },

  // GET /api/planes/activos
  obtenerActivos: async (): Promise<{ ok: boolean; planes: Plan[] }> => {
    return await apiGet("/planes/activos");
  },
};
