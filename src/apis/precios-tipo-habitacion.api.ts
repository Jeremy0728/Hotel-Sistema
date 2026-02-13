import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface PrecioTipoHabitacion {
  id: number;
  room_type_id: number;
  season_name?: string;
  start_date?: string;
  end_date?: string;
  price: string;
  is_active: boolean;
}

interface ResponsePrecios {
  ok: boolean;
  precios: PrecioTipoHabitacion[];
  total: number;
  page: number;
  totalPages: number;
}

export const preciosTipoHabitacionApi = {
  // GET /api/precios-tipo-habitacion/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponsePrecios> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponsePrecios>(`/precios-tipo-habitacion/traer-todos?${params}`);
  },

  // GET /api/precios-tipo-habitacion/traer-por-tipo/:roomTypeId
  traerPorTipo: async (roomTypeId: number): Promise<{ ok: boolean; precios: PrecioTipoHabitacion[] }> => {
    return await apiGet(`/precios-tipo-habitacion/traer-por-tipo/${roomTypeId}`);
  },

  // GET /api/precios-tipo-habitacion/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; precio: PrecioTipoHabitacion }> => {
    return await apiGet(`/precios-tipo-habitacion/traer-por-id/${id}`);
  },

  // POST /api/precios-tipo-habitacion/crear
  crear: async (data: Omit<PrecioTipoHabitacion, "id">): Promise<{ ok: boolean; precio: PrecioTipoHabitacion }> => {
    return await apiPost("/precios-tipo-habitacion/crear", data);
  },

  // PUT /api/precios-tipo-habitacion/actualizar/:id
  actualizar: async (id: number, data: Partial<PrecioTipoHabitacion>): Promise<{ ok: boolean; precio: PrecioTipoHabitacion }> => {
    return await apiPut(`/precios-tipo-habitacion/actualizar/${id}`, data);
  },

  // DELETE /api/precios-tipo-habitacion/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/precios-tipo-habitacion/eliminar/${id}`);
  },
};
