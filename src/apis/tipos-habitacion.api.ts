import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface TipoHabitacion {
  id: number;
  name: string;
  description?: string;
  base_price: string;
  max_occupancy: number;
  amenities?: Record<string, unknown>;
  is_active: boolean;
}

interface ResponseTiposHabitacion {
  ok: boolean;
  tipos: TipoHabitacion[];
  total: number;
  page: number;
  totalPages: number;
}

export const tiposHabitacionApi = {
  // GET /api/tipos-habitacion/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseTiposHabitacion> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseTiposHabitacion>(`/tipos-habitacion/traer-todos?${params}`);
  },

  // GET /api/tipos-habitacion/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; tipo: TipoHabitacion }> => {
    return await apiGet(`/tipos-habitacion/traer-por-id/${id}`);
  },

  // POST /api/tipos-habitacion/crear
  crear: async (data: Omit<TipoHabitacion, "id">): Promise<{ ok: boolean; tipo: TipoHabitacion }> => {
    return await apiPost("/tipos-habitacion/crear", data);
  },

  // PUT /api/tipos-habitacion/actualizar/:id
  actualizar: async (id: number, data: Partial<TipoHabitacion>): Promise<{ ok: boolean; tipo: TipoHabitacion }> => {
    return await apiPut(`/tipos-habitacion/actualizar/${id}`, data);
  },

  // DELETE /api/tipos-habitacion/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/tipos-habitacion/eliminar/${id}`);
  },

  // GET /api/tipos-habitacion/activos
  obtenerActivos: async (): Promise<{ ok: boolean; tipos: TipoHabitacion[] }> => {
    return await apiGet("/tipos-habitacion/activos");
  },
};
