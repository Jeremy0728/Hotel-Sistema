import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";
import type {
  Sale,
  SalesResponse,
  SaleResponse,
  SaleMutationResponse,
  PaymentStatus,
} from "@/types/sale";

export const ventasApi = {
  // GET /api/ventas/traer-todos
  traerTodos: async (
    page = 1,
    limit = 10,
    payment_status?: PaymentStatus,
    location_id?: number,
    reservation_id?: number,
    guest_id?: number,
    from_date?: string,
    to_date?: string
  ): Promise<SalesResponse> => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    if (payment_status) params.append('payment_status', payment_status);
    if (location_id) params.append('location_id', location_id.toString());
    if (reservation_id) params.append('reservation_id', reservation_id.toString());
    if (guest_id) params.append('guest_id', guest_id.toString());
    if (from_date) params.append('from_date', from_date);
    if (to_date) params.append('to_date', to_date);
    return await apiGet<SalesResponse>(`/ventas/traer-todos?${params}`);
  },

  // GET /api/ventas/traer-por-id/:id
  traerPorId: async (id: number): Promise<SaleResponse> => {
    return await apiGet(`/ventas/traer-por-id/${id}`);
  },

  // POST /api/ventas/crear
  crear: async (data: Omit<Sale, "id" | "sale_number" | "created_at">): Promise<SaleMutationResponse> => {
    return await apiPost("/ventas/crear", data);
  },

  // PUT /api/ventas/actualizar/:id
  actualizar: async (id: number, data: Partial<Sale>): Promise<SaleMutationResponse> => {
    return await apiPut(`/ventas/actualizar/${id}`, data);
  },

  // PATCH /api/ventas/cancelar/:id
  cancelar: async (id: number, reason?: string): Promise<SaleMutationResponse> => {
    return await apiPatch(`/ventas/cancelar/${id}`, { reason });
  },

  // GET /api/ventas/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; sales: Sale[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet(`/ventas/por-fecha?${params}`);
  },

  // GET /api/ventas/por-reserva/:reservationId
  obtenerPorReserva: async (reservationId: number): Promise<{ ok: boolean; sales: Sale[] }> => {
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
