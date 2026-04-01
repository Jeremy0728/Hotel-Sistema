// Tipos centralizados para el módulo de habitaciones

/**
 * Estados posibles de una habitación
 */
export type RoomStatus = 
  | 'available' 
  | 'occupied' 
  | 'cleaning' 
  | 'maintenance' 
  | 'out_of_order'
  | 'out_of_service';

/**
 * Precio de tipo de habitación
 */
export interface RoomTypePrice {
  id: number;
  price_type: 'daily' | 'hourly' | 'weekly' | 'monthly';
  price: string;
  is_active: boolean;
}

/**
 * Tipo de habitación (información básica)
 */
export interface RoomType {
  id: number;
  name: string;
  description?: string;
  max_occupancy: number;
  prices?: RoomTypePrice[];
}

/**
 * Reserva activa (información resumida)
 */
export interface ActiveReservation {
  id: number;
  confirmation_code: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  adults: number;
  children: number;
  total_amount: string;
  guestName: string;
}

/**
 * Habitación
 * Basado en la respuesta de la API /api/habitaciones
 */
export interface Room {
  id: number;
  number: string;
  room_type_id: number;
  floor: number;
  status: RoomStatus;
  type?: string;
  notes?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  activeReservation?: ActiveReservation | null;
  roomType?: RoomType;
}

/**
 * Datos para crear una habitación
 */
export interface CreateRoomData {
  number: string;
  room_type_id: number;
  floor?: number;
  status?: RoomStatus;
  notes?: string;
}

/**
 * Datos para actualizar una habitación
 */
export interface UpdateRoomData {
  number?: string;
  room_type_id?: number;
  floor?: number;
  status?: RoomStatus;
  notes?: string;
}

/**
 * Respuesta de la API para obtener todas las habitaciones
 */
export interface RoomsResponse {
  ok: boolean;
  habitaciones: Room[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Respuesta de la API para obtener una habitación por ID
 */
export interface RoomResponse {
  ok: boolean;
  habitacion: Room;
}

/**
 * Respuesta de la API para crear/actualizar una habitación
 */
export interface RoomMutationResponse {
  ok: boolean;
  habitacion: Room;
}

/**
 * Respuesta de la API para eliminar una habitación
 */
export interface RoomDeleteResponse {
  ok: boolean;
  msg: string;
}

/**
 * Respuesta de la API para obtener habitaciones disponibles
 */
export interface AvailableRoomsResponse {
  ok: boolean;
  habitaciones: Room[];
}

/**
 * Respuesta de la API para obtener habitaciones por piso
 */
export interface RoomsByFloorResponse {
  ok: boolean;
  habitaciones: Room[];
}
