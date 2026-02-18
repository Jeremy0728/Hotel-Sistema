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
  // GET /api/servicios-reserva/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseReservasServicios> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseReservasServicios>(`/servicios-reserva/traer-todos?${params}`);
  },

  // GET /api/servicios-reserva/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiGet(`/servicios-reserva/traer-por-id/${id}`);
  },

  // GET /api/servicios-reserva/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; reservas: ReservaServicio[] }> => {
    return await apiGet(`/servicios-reserva/traer-por-reserva/${reservationId}`);
  },

  // POST /api/servicios-reserva/crear
  crear: async (data: Omit<ReservaServicio, "id">): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiPost("/servicios-reserva/crear", data);
  },

  // PUT /api/servicios-reserva/actualizar/:id
  actualizar: async (id: number, data: Partial<ReservaServicio>): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiPut(`/servicios-reserva/actualizar/${id}`, data);
  },

  // PATCH /api/servicios-reserva/cambiar-estado/:id
  cambiarEstado: async (id: number, status: ReservaServicio["status"]): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiPatch(`/servicios-reserva/cambiar-estado/${id}`, { status });
  },

  // DELETE /api/servicios-reserva/cancelar/:id
  cancelar: async (id: number): Promise<{ ok: boolean; reserva: ReservaServicio }> => {
    return await apiDelete(`/servicios-reserva/cancelar/${id}`);
  },

  // GET /api/servicios-reserva/por-fecha
  obtenerPorFecha: async (date: string): Promise<{ ok: boolean; reservas: ReservaServicio[] }> => {
    const params = new URLSearchParams({ date });
    return await apiGet(`/servicios-reserva/por-fecha?${params}`);
  },
};
