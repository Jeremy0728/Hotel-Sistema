import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiWrapper";

interface Reserva {
  id: number;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_price: string;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  special_requests?: string;
  corporate_client_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface ResponseReservas {
  ok: boolean;
  reservas: Reserva[];
  total: number;
  page: number;
  totalPages: number;
}

export const reservasApi = {
  // GET /api/reservas/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: Record<string, string>): Promise<ResponseReservas> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiGet<ResponseReservas>(`/reservas/traer-todos?${params}`);
  },

  // GET /api/reservas/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; reserva: Reserva }> => {
    return await apiGet(`/reservas/traer-por-id/${id}`);
  },

  // POST /api/reservas/crear
  crear: async (data: Omit<Reserva, "id">): Promise<{ ok: boolean; reserva: Reserva }> => {
    return await apiPost("/reservas/crear", data);
  },

  // PUT /api/reservas/actualizar/:id
  actualizar: async (id: number, data: Partial<Reserva>): Promise<{ ok: boolean; reserva: Reserva }> => {
    return await apiPut(`/reservas/actualizar/${id}`, data);
  },

  // PATCH /api/reservas/cambiar-estado/:id
  cambiarEstado: async (id: number, status: Reserva["status"]): Promise<{ ok: boolean; reserva: Reserva }> => {
    return await apiPatch(`/reservas/cambiar-estado/${id}`, { status });
  },

  // DELETE /api/reservas/cancelar/:id
  cancelar: async (id: number): Promise<{ ok: boolean; reserva: Reserva }> => {
    return await apiDelete(`/reservas/cancelar/${id}`);
  },

  // GET /api/reservas/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; reservas: Reserva[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet(`/reservas/por-fecha?${params}`);
  },

  // GET /api/reservas/disponibilidad
  verificarDisponibilidad: async (roomId: number, checkIn: string, checkOut: string): Promise<{ ok: boolean; disponible: boolean }> => {
    const params = new URLSearchParams({ room_id: roomId.toString(), check_in: checkIn, check_out: checkOut });
    return await apiGet(`/reservas/disponibilidad?${params}`);
  },
};
