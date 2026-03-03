import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";
import { ResponseFacturas, FacturaAPI } from "@/types/hotel";

export const facturasApi = {
  // GET /api/facturas/traer-todos
  traerTodos: async (page = 1, limit = 10, status?: string): Promise<ResponseFacturas> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    return await apiGet<ResponseFacturas>(`/facturas/traer-todos?${params}`);
  },

  // GET /api/facturas/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; factura: FacturaAPI }> => {
    return await apiGet(`/facturas/traer-por-id/${id}`);
  },

  // GET /api/facturas/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; factura: FacturaAPI | null }> => {
    return await apiGet(`/facturas/traer-por-reserva/${reservationId}`);
  },

  // POST /api/facturas/crear
  crear: async (data: Omit<FacturaAPI, "id" | "invoice_number">): Promise<{ ok: boolean; factura: FacturaAPI }> => {
    return await apiPost("/facturas/crear", data);
  },

  // PUT /api/facturas/actualizar/:id
  actualizar: async (id: number, data: Partial<FacturaAPI>): Promise<{ ok: boolean; factura: FacturaAPI }> => {
    return await apiPut(`/facturas/actualizar/${id}`, data);
  },

  // PATCH /api/facturas/cambiar-estado/:id
  cambiarEstado: async (id: number, status: FacturaAPI["status"]): Promise<{ ok: boolean; factura: FacturaAPI }> => {
    return await apiPatch(`/facturas/cambiar-estado/${id}`, { status });
  },

  // GET /api/facturas/pendientes
  obtenerPendientes: async (): Promise<{ ok: boolean; facturas: FacturaAPI[] }> => {
    return await apiGet("/facturas/pendientes");
  },

  // GET /api/facturas/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; facturas: FacturaAPI[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet(`/facturas/por-fecha?${params}`);
  },
};
