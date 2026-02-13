import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiWrapper";

interface ReservaServicio {
  id: number;
  reservation_id: number;
  service_id: number;
  scheduled_date: string;
  scheduled_time?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

interface ResponseReservasServicios {
  ok: boolean;
  reservas: ReservaServicio[];
  total: number;
  page: number;
  totalPages: number;
}

export const reservasServiciosApi = {
  // GET /api/reservas-servicios/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseReservasServicios> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseReservasServicios>(`/reservas-servicios/traer-todos?${params}`);
  },

  // GET /api/reservas-servicios/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiGet(`/reservas-servicios/traer-por-id/${id}`);
  },

  // GET /api/reservas-servicios/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; reservas: ReservaServicio[] }> => {
    return await apiGet(`/reservas-servicios/traer-por-reserva/${reservationId}`);
  },

  // POST /api/reservas-servicios/crear
  crear: async (data: Omit<ReservaServicio, "id">): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiPost("/reservas-servicios/crear", data);
  },

  // PUT /api/reservas-servicios/actualizar/:id
  actualizar: async (id: number, data: Partial<ReservaServicio>): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiPut(`/reservas-servicios/actualizar/${id}`, data);
  },

  // PATCH /api/reservas-servicios/cambiar-estado/:id
  cambiarEstado: async (id: number, status: ReservaServicio["status"]): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiPatch(`/reservas-servicios/cambiar-estado/${id}`, { status });
  },

  // DELETE /api/reservas-servicios/cancelar/:id
  cancelar: async (id: number): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiDelete(`/reservas-servicios/cancelar/${id}`);
  },

  // GET /api/reservas-servicios/por-fecha
  obtenerPorFecha: async (date: string): Promise<{ ok: boolean; reservas: ReservaServicio[] }> => {
    const params = new URLSearchParams({ date });
    return await apiGet(`/reservas-servicios/por-fecha?${params}`);
  },
};
