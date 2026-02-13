import { apiGet, apiPost, apiPut } from "@/lib/api/apiWrapper";

interface CheckIn {
  id: number;
  reservation_id: number;
  check_in_date: string;
  check_in_time: string;
  actual_guests: number;
  notes?: string;
  checked_in_by: number;
}

interface ResponseCheckIns {
  ok: boolean;
  checkins: CheckIn[];
  total: number;
  page: number;
  totalPages: number;
}

export const checkinApi = {
  // GET /api/checkin/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseCheckIns> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseCheckIns>(`/checkin/traer-todos?${params}`);
  },

  // GET /api/checkin/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; checkin: CheckIn }> => {
    return await apiGet(`/checkin/traer-por-id/${id}`);
  },

  // GET /api/checkin/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; checkin: CheckIn | null }> => {
    return await apiGet(`/checkin/traer-por-reserva/${reservationId}`);
  },

  // POST /api/checkin/realizar
  realizar: async (data: Omit<CheckIn, "id">): Promise<{ ok: boolean; checkin: CheckIn }> => {
    return await apiPost("/checkin/realizar", data);
  },

  // PUT /api/checkin/actualizar/:id
  actualizar: async (id: number, data: Partial<CheckIn>): Promise<{ ok: boolean; checkin: CheckIn }> => {
    return await apiPut(`/checkin/actualizar/${id}`, data);
  },

  // GET /api/checkin/pendientes
  obtenerPendientes: async (): Promise<{ ok: boolean; reservas: unknown[] }> => {
    return await apiGet("/checkin/pendientes");
  },
};
