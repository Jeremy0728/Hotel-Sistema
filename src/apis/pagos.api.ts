import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Pago {
  id: number;
  invoice_id: number;
  payment_method_id: number;
  amount: string;
  payment_date: string;
  reference_number?: string;
  notes?: string;
}

interface ResponsePagos {
  ok: boolean;
  pagos: Pago[];
  total: number;
  page: number;
  totalPages: number;
}

export const pagosApi = {
  // GET /api/pagos/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponsePagos> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponsePagos>(`/pagos/traer-todos?${params}`);
  },

  // GET /api/pagos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; pago: Pago }> => {
    return await apiGet(`/pagos/traer-por-id/${id}`);
  },

  // GET /api/pagos/traer-por-factura/:invoiceId
  traerPorFactura: async (invoiceId: number): Promise<{ ok: boolean; pagos: Pago[] }> => {
    return await apiGet(`/pagos/traer-por-factura/${invoiceId}`);
  },

  // POST /api/pagos/registrar
  registrar: async (data: Omit<Pago, "id">): Promise<{ ok: boolean; pago: Pago }> => {
    return await apiPost("/pagos/registrar", data);
  },

  // PUT /api/pagos/actualizar/:id
  actualizar: async (id: number, data: Partial<Pago>): Promise<{ ok: boolean; pago: Pago }> => {
    return await apiPut(`/pagos/actualizar/${id}`, data);
  },

  // DELETE /api/pagos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/pagos/eliminar/${id}`);
  },

  // GET /api/pagos/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; pagos: Pago[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet(`/pagos/por-fecha?${params}`);
  },
};
