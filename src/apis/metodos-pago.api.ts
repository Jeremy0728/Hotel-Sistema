import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

export interface MetodoPago {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface ResponseMetodosPago {
  ok: boolean;
  paymentMethods: MetodoPago[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const metodosPagoApi = {
  // GET /api/metodos-pago/traer-todos
  traerTodos: async (page = 1, limit = 100, is_active?: boolean): Promise<ResponseMetodosPago> => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    if (is_active !== undefined) {
      params.append('is_active', is_active.toString());
    }
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

  // GET /api/metodos-pago/traer-todos con filtro de activos
  obtenerActivos: async (): Promise<ResponseMetodosPago> => {
    return await metodosPagoApi.traerTodos(1, 100, true);
  },
};
