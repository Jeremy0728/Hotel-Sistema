import { apiGet, apiPost, apiPut } from "@/lib/api/apiWrapper";

interface CheckOut {
  id: number;
  check_in_id: number;
  actual_check_out?: string;
  final_amount: number;
  payment_status?: 'pending' | 'partial' | 'paid';
  notes?: string;
  processed_by?: number;
  created_at?: string;
}

interface CheckOutCreatePayload {
  reservation_id: number;
  check_in_id: number;
  actual_check_out?: string;
  final_amount: number;
  payment_status?: 'pending' | 'partial' | 'paid';
  notes?: string;
  additional_charges?: { service_id: number; quantity: number; unit_price: number }[];
  guest_id: number;
}

interface ResponseCheckOuts {
  ok: boolean;
  checkouts: CheckOut[];
  total: number;
  page: number;
  totalPages: number;
}

export const checkoutApi = {
  // GET /api/checkout/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseCheckOuts> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseCheckOuts>(`/checkout/traer-todos?${params}`);
  },

  // GET /api/checkout/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; checkout: CheckOut }> => {
    return await apiGet(`/checkout/traer-por-id/${id}`);
  },

  // GET /api/checkout/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; checkout: CheckOut | null }> => {
    return await apiGet(`/checkout/traer-por-reserva/${reservationId}`);
  },

  // POST /api/checkout/crear
  realizar: async (data: CheckOutCreatePayload): Promise<{ ok: boolean; checkOut: CheckOut; msg: string }> => {
    return await apiPost("/checkout/crear", data);
  },

  // PUT /api/checkout/actualizar/:id
  actualizar: async (id: number, data: Partial<CheckOut>): Promise<{ ok: boolean; checkout: CheckOut }> => {
    return await apiPut(`/checkout/actualizar/${id}`, data);
  },

  // GET /api/checkout/pendientes
  obtenerPendientes: async (): Promise<{ ok: boolean; reservas: unknown[] }> => {
    return await apiGet("/checkout/pendientes");
  },
};
