import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface ReservationGuest {
  id: number;
  reservation_id: number;
  guest_id: number;
  is_primary: boolean;
  created_at: string;
  reservation?: {
    id: number;
    confirmation_code: string;
    check_in_date: string;
    check_out_date: string;
    status: string;
  };
  guest?: {
    id: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    phone: string;
    document_type_id: number;
    document_number: string;
    documentType?: {
      id: number;
      code: string;
      name: string;
    };
  };
}

interface ResponseReservationGuests {
  ok: boolean;
  reservationGuests: ReservationGuest[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const reservasHuespedesApi = {
  // GET /api/reservas-huespedes/traer-todos
  traerTodos: async (
    page = 1,
    limit = 10,
    filters?: {
      reservation_id?: number;
      guest_id?: number;
      is_primary?: boolean;
    }
  ): Promise<ResponseReservationGuests> => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    
    if (filters?.reservation_id) params.append("reservation_id", filters.reservation_id.toString());
    if (filters?.guest_id) params.append("guest_id", filters.guest_id.toString());
    if (filters?.is_primary !== undefined) params.append("is_primary", filters.is_primary.toString());
    
    return await apiGet<ResponseReservationGuests>(`/reservas-huespedes/traer-todos?${params}`);
  },

  // GET /api/reservas-huespedes/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; reservationGuest: ReservationGuest }> => {
    return await apiGet(`/reservas-huespedes/traer-por-id/${id}`);
  },

  // GET /api/reservas-huespedes/traer-por-reserva/:reservation_id
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; guests: ReservationGuest[] }> => {
    return await apiGet(`/reservas-huespedes/traer-por-reserva/${reservationId}`);
  },

  // POST /api/reservas-huespedes/crear
  crear: async (data: {
    reservation_id: number;
    guest_id: number;
    is_primary?: boolean;
  }): Promise<{ ok: boolean; reservationGuest: ReservationGuest; msg: string }> => {
    return await apiPost("/reservas-huespedes/crear", data);
  },

  // PUT /api/reservas-huespedes/actualizar/:id
  actualizar: async (
    id: number,
    data: { is_primary?: boolean }
  ): Promise<{ ok: boolean; reservationGuest: ReservationGuest; msg: string }> => {
    return await apiPut(`/reservas-huespedes/actualizar/${id}`, data);
  },

  // DELETE /api/reservas-huespedes/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/reservas-huespedes/eliminar/${id}`);
  },
};
