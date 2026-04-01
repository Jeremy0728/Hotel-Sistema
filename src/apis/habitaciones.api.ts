import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiWrapper";
import type {
  RoomStatus,
  CreateRoomData,
  UpdateRoomData,
  RoomsResponse,
  RoomResponse,
  RoomMutationResponse,
  RoomDeleteResponse,
  AvailableRoomsResponse,
  RoomsByFloorResponse,
} from "@/types/room";

export const habitacionesApi = {
  // GET /api/habitaciones/traer-todos
  traerTodos: async (
    page = 1, 
    limit = 10, 
    status?: RoomStatus, 
    floor?: number, 
    room_type_id?: number
  ): Promise<RoomsResponse> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    if (floor !== undefined) params.append("floor", floor.toString());
    if (room_type_id) params.append("room_type_id", room_type_id.toString());
    return await apiGet<RoomsResponse>(`/habitaciones/traer-todos?${params}`);
  },

  // GET /api/habitaciones/traer-por-id/:id
  traerPorId: async (id: number): Promise<RoomResponse> => {
    return await apiGet<RoomResponse>(`/habitaciones/traer-por-id/${id}`);
  },

  // POST /api/habitaciones/crear
  crear: async (data: CreateRoomData): Promise<RoomMutationResponse> => {
    return await apiPost<RoomMutationResponse>("/habitaciones/crear", data);
  },

  // PUT /api/habitaciones/actualizar/:id
  actualizar: async (id: number, data: UpdateRoomData): Promise<RoomMutationResponse> => {
    return await apiPut<RoomMutationResponse>(`/habitaciones/actualizar/${id}`, data);
  },

  // PATCH /api/habitaciones/cambiar-estado/:id
  cambiarEstado: async (id: number, status: RoomStatus, notes?: string): Promise<RoomMutationResponse> => {
    return await apiPatch<RoomMutationResponse>(`/habitaciones/cambiar-estado/${id}`, { status, notes });
  },

  // GET /api/habitaciones/disponibles
  obtenerDisponibles: async (): Promise<AvailableRoomsResponse> => {
    return await apiGet<AvailableRoomsResponse>("/habitaciones/disponibles");
  },

  // GET /api/habitaciones/por-piso/:floor
  obtenerPorPiso: async (floor: number): Promise<RoomsByFloorResponse> => {
    return await apiGet<RoomsByFloorResponse>(`/habitaciones/por-piso/${floor}`);
  },

  // DELETE /api/habitaciones/eliminar/:id
  eliminar: async (id: number): Promise<RoomDeleteResponse> => {
    return await apiDelete<RoomDeleteResponse>(`/habitaciones/eliminar/${id}`);
  },
};
