import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface ServicioAdicional {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes?: number;
  category: string;
  is_active: boolean;
}

interface ResponseServiciosAdicionales {
  ok: boolean;
  servicios: ServicioAdicional[];
  total: number;
  page: number;
  totalPages: number;
}

export const serviciosAdicionalesApi = {
  // GET /api/servicios-adicionales/traer-todos
  traerTodos: async (page = 1, limit = 10, category?: string): Promise<ResponseServiciosAdicionales> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (category) params.append("category", category);
    return await apiGet<ResponseServiciosAdicionales>(`/servicios-adicionales/traer-todos?${params}`);
  },

  // GET /api/servicios-adicionales/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; servicio: ServicioAdicional }> => {
    return await apiGet(`/servicios-adicionales/traer-por-id/${id}`);
  },

  // POST /api/servicios-adicionales/crear
  crear: async (data: Omit<ServicioAdicional, "id">): Promise<{ ok: boolean; servicio: ServicioAdicional }> => {
    return await apiPost("/servicios-adicionales/crear", data);
  },

  // PUT /api/servicios-adicionales/actualizar/:id
  actualizar: async (id: number, data: Partial<ServicioAdicional>): Promise<{ ok: boolean; servicio: ServicioAdicional }> => {
    return await apiPut(`/servicios-adicionales/actualizar/${id}`, data);
  },

  // DELETE /api/servicios-adicionales/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/servicios-adicionales/eliminar/${id}`);
  },

  // GET /api/servicios-adicionales/activos
  obtenerActivos: async (): Promise<{ ok: boolean; servicios: ServicioAdicional[] }> => {
    return await apiGet("/servicios-adicionales/activos");
  },

  // GET /api/servicios-adicionales/por-categoria/:category
  obtenerPorCategoria: async (category: string): Promise<{ ok: boolean; servicios: ServicioAdicional[] }> => {
    return await apiGet(`/servicios-adicionales/por-categoria/${category}`);
  },
};
