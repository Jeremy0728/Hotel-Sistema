import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface MetodoPago {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface ResponseMetodosPago {
  ok: boolean;
  metodos: MetodoPago[];
  total: number;
  page: number;
  totalPages: number;
}

export const metodosPagoApi = {
  // GET /api/metodos-pago/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseMetodosPago> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseMetodosPago>(`/metodos-pago/traer-todos?${params}`);
  },

  // GET /api/metodos-pago/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; metodo: MetodoPago }> => {
    return await apiGet(`/metodos-pago/traer-por-id/${id}`);
  },

  // POST /api/metodos-pago/crear
  crear: async (data: Omit<MetodoPago, "id">): Promise<{ ok: boolean; metodo: MetodoPago }> => {
    return await apiPost("/metodos-pago/crear", data);
  },

  // PUT /api/metodos-pago/actualizar/:id
  actualizar: async (id: number, data: Partial<MetodoPago>): Promise<{ ok: boolean; metodo: MetodoPago }> => {
    return await apiPut(`/metodos-pago/actualizar/${id}`, data);
  },

  // DELETE /api/metodos-pago/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/metodos-pago/eliminar/${id}`);
  },

  // GET /api/metodos-pago/activos
  obtenerActivos: async (): Promise<{ ok: boolean; metodos: MetodoPago[] }> => {
    return await apiGet("/metodos-pago/activos");
  },
};
