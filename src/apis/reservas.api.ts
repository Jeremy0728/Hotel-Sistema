import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";
import { Huesped } from "@/types/guest";

export interface Guest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  document_type_id: number;
  document_number: string;
  date_of_birth?: string;
  country_id?: number;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  preferences?: {
    late_checkout?: boolean;
    room_preference?: string;
    floor_preference?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: number;
  number: string;
  room_type_id: number;
  floor: number;
  status: string;
  notes?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CheckOut {
  id: number;
  check_in_id: number;
  actual_check_out: string;
  late_checkout: boolean;
  late_checkout_charge: string;
  room_condition: string;
  minibar_charges: string;
  damage_charges: string;
  notes?: string;
  processed_by: number;
  created_at: string;
}

export interface CheckIn {
  id: number;
  reservation_id: number;
  room_id: number;
  actual_check_in: string;
  expected_check_out: string;
  processed_by: number;
  notes?: string;
  created_at: string;
  checkOut?: CheckOut;
}

export interface Reserva {
  id: number;
  confirmation_code: string;
  guest_id: number;
  room_id: number;
  corporate_client_id?: number;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  base_price: string;
  total_nights: number;
  subtotal: string;
  taxes: string;
  discount: string;
  total_amount: string;
  special_requests?: string;
  notes?: string;
  created_by?: number;
  cancelled_by?: number;
  created_at?: string;
  updated_at?: string;
  guest?: Guest;
  room?: Room;
  checkIn?: CheckIn;
  // Campos legacy para compatibilidad
  huesped?: Guest;
  habitacion?: Room;
}

export interface ResponseReservas {
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

  // PATCH /api/reservas/confirmar/:id
  confirmar: async (id: number): Promise<{ ok: boolean; reserva: Reserva; msg: string }> => {
    return await apiPatch(`/reservas/confirmar/${id}`, {});
  },

  // PATCH /api/reservas/cancelar/:id
  cancelar: async (id: number, notes?: string): Promise<{ ok: boolean; reserva: Reserva; msg: string }> => {
    return await apiPatch(`/reservas/cancelar/${id}`, { notes });
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

// API para Check-in y Check-out
export const checkinApi = {
  // POST /api/checkin/realizar/:reserva_id
  realizarCheckIn: async (reservaId: number, data?: { actual_check_in?: string; expected_check_out?: string; notes?: string }): Promise<{ ok: boolean; checkIn: CheckIn; msg: string }> => {
    return await apiPost(`/checkin/realizar/${reservaId}`, data || {});
  },

  // POST /api/checkin/realizar-checkout/:checkInId
  realizarCheckOut: async (checkInId: number, data: { actual_check_out?: string; final_amount: number; payment_status?: string; room_condition?: string; notes?: string }): Promise<{ ok: boolean; checkOut: CheckOut; msg: string }> => {
    return await apiPost(`/checkin/realizar-checkout/${checkInId}`, data);
  },
};
