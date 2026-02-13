import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";

interface Venta {
  id: number;
  sale_number: string;
  sale_date: string;
  customer_id?: number;
  reservation_id?: number;
  location_id: number;
  subtotal: string;
  tax: string;
  discount?: string;
  total: string;
  payment_method_id: number;
  status: "completed" | "cancelled" | "pending";
  notes?: string;
  sold_by: number;
}

interface ResponseVentas {
  ok: boolean;
  ventas: Venta[];
  total: number;
  page: number;
  totalPages: number;
}

export const ventasApi = {
  // GET /api/ventas/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: Record<string, string>): Promise<ResponseVentas> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiGet<ResponseVentas>(`/ventas/traer-todos?${params}`);
  },

  // GET /api/ventas/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; venta: Venta }> => {
    return await apiGet(`/ventas/traer-por-id/${id}`);
  },

  // POST /api/ventas/crear
  crear: async (data: Omit<Venta, "id" | "sale_number">): Promise<{ ok: boolean; venta: Venta }> => {
    return await apiPost("/ventas/crear", data);
  },

  // PUT /api/ventas/actualizar/:id
  actualizar: async (id: number, data: Partial<Venta>): Promise<{ ok: boolean; venta: Venta }> => {
    return await apiPut(`/ventas/actualizar/${id}`, data);
  },

  // PATCH /api/ventas/cancelar/:id
  cancelar: async (id: number, reason?: string): Promise<{ ok: boolean; venta: Venta }> => {
    return await apiPatch(`/ventas/cancelar/${id}`, { reason });
  },

  // GET /api/ventas/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; ventas: Venta[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet(`/ventas/por-fecha?${params}`);
  },

  // GET /api/ventas/por-reserva/:reservationId
  obtenerPorReserva: async (reservationId: number): Promise<{ ok: boolean; ventas: Venta[] }> => {
    return await apiGet(`/ventas/por-reserva/${reservationId}`);
  },

  // GET /api/ventas/estadisticas
  obtenerEstadisticas: async (startDate?: string, endDate?: string): Promise<{ ok: boolean; estadisticas: unknown }> => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    return await apiGet(`/ventas/estadisticas?${params}`);
  },
};
