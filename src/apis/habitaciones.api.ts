import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiWrapper";

interface Habitacion {
  id: number;
  number: string;
  room_type_id: number;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  notes?: string;
  is_active: boolean;
}

interface ResponseHabitaciones {
  ok: boolean;
  habitaciones: Habitacion[];
  total: number;
  page: number;
  totalPages: number;
}

export const habitacionesApi = {
  // GET /api/habitaciones/traer-todos
  traerTodos: async (page = 1, limit = 10, status?: string): Promise<ResponseHabitaciones> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    return await apiGet<ResponseHabitaciones>(`/habitaciones/traer-todos?${params}`);
  },

  // GET /api/habitaciones/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; habitacion: Habitacion }> => {
    return await apiGet(`/habitaciones/traer-por-id/${id}`);
  },

  // POST /api/habitaciones/crear
  crear: async (data: Omit<Habitacion, "id">): Promise<{ ok: boolean; habitacion: Habitacion }> => {
    return await apiPost("/habitaciones/crear", data);
  },

  // PUT /api/habitaciones/actualizar/:id
  actualizar: async (id: number, data: Partial<Habitacion>): Promise<{ ok: boolean; habitacion: Habitacion }> => {
    return await apiPut(`/habitaciones/actualizar/${id}`, data);
  },

  // PATCH /api/habitaciones/cambiar-estado/:id
  cambiarEstado: async (id: number, status: string): Promise<{ ok: boolean; habitacion: Habitacion }> => {
    return await apiPatch(`/habitaciones/cambiar-estado/${id}`, { status });
  },

  // GET /api/habitaciones/disponibles
  obtenerDisponibles: async (): Promise<{ ok: boolean; habitaciones: Habitacion[] }> => {
    return await apiGet("/habitaciones/disponibles");
  },

  // GET /api/habitaciones/por-piso/:floor
  obtenerPorPiso: async (floor: number): Promise<{ ok: boolean; habitaciones: Habitacion[] }> => {
    return await apiGet(`/habitaciones/por-piso/${floor}`);
  },

  // DELETE /api/habitaciones/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/habitaciones/eliminar/${id}`);
  },
};
