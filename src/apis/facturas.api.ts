import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";

interface Factura {
  id: number;
  reservation_id: number;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  subtotal: string;
  tax: string;
  discount?: string;
  total: string;
  status: "pending" | "paid" | "partially_paid" | "cancelled";
  notes?: string;
}

interface ResponseFacturas {
  ok: boolean;
  facturas: Factura[];
  total: number;
  page: number;
  totalPages: number;
}

export const facturasApi = {
  // GET /api/facturas/traer-todos
  traerTodos: async (page = 1, limit = 10, status?: string): Promise<ResponseFacturas> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    return await apiGet<ResponseFacturas>(`/facturas/traer-todos?${params}`);
  },

  // GET /api/facturas/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; factura: Factura }> => {
    return await apiGet(`/facturas/traer-por-id/${id}`);
  },

  // GET /api/facturas/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; factura: Factura | null }> => {
    return await apiGet(`/facturas/traer-por-reserva/${reservationId}`);
  },

  // POST /api/facturas/crear
  crear: async (data: Omit<Factura, "id" | "invoice_number">): Promise<{ ok: boolean; factura: Factura }> => {
    return await apiPost("/facturas/crear", data);
  },

  // PUT /api/facturas/actualizar/:id
  actualizar: async (id: number, data: Partial<Factura>): Promise<{ ok: boolean; factura: Factura }> => {
    return await apiPut(`/facturas/actualizar/${id}`, data);
  },

  // PATCH /api/facturas/cambiar-estado/:id
  cambiarEstado: async (id: number, status: Factura["status"]): Promise<{ ok: boolean; factura: Factura }> => {
    return await apiPatch(`/facturas/cambiar-estado/${id}`, { status });
  },

  // GET /api/facturas/pendientes
  obtenerPendientes: async (): Promise<{ ok: boolean; facturas: Factura[] }> => {
    return await apiGet("/facturas/pendientes");
  },

  // GET /api/facturas/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; facturas: Factura[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet(`/facturas/por-fecha?${params}`);
  },
};
