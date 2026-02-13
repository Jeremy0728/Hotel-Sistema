import { apiGet, apiPost, apiDelete } from "@/lib/api/apiWrapper";

interface HuespedReserva {
  reservation_id: number;
  guest_id: number;
  is_primary: boolean;
}

export const huespedesReservaApi = {
  // GET /api/huespedes-reserva/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; huespedes: number[] }> => {
    return await apiGet(`/huespedes-reserva/traer-por-reserva/${reservationId}`);
  },

  // POST /api/huespedes-reserva/asignar
  asignar: async (reservationId: number, guestId: number, isPrimary = false): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/huespedes-reserva/asignar", { reservation_id: reservationId, guest_id: guestId, is_primary: isPrimary });
  },

  // POST /api/huespedes-reserva/asignar-multiple
  asignarMultiple: async (reservationId: number, guestIds: number[]): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/huespedes-reserva/asignar-multiple", { reservation_id: reservationId, guest_ids: guestIds });
  },

  // DELETE /api/huespedes-reserva/remover
  remover: async (reservationId: number, guestId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete("/huespedes-reserva/remover", { data: { reservation_id: reservationId, guest_id: guestId } });
  },
};
