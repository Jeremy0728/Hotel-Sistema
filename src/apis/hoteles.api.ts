import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/apiWrapper";

interface Hotel {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  ruc: string;
  plan_id: string;
  estado: "activo" | "suspendido" | "cancelado";
  fecha_inicio_suscripcion: string;
  fecha_fin_suscripcion: string;
  configuracion?: Record<string, unknown>;
}

interface ResponseHoteles {
  ok: boolean;
  hoteles: Hotel[];
  total: number;
  page: number;
  totalPages: number;
}

interface CreateHotelData {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  ruc: string;
  database_name: string;
  database_host: string;
  database_port?: number;
  database_user: string;
  database_password: string;
  plan_id: string;
  fecha_fin_suscripcion: string;
  estado?: "activo" | "suspendido" | "cancelado";
  configuracion?: Record<string, unknown>;
}

export const hotelesApi = {
  // GET /api/hoteles/obtener-hoteles
  obtenerHoteles: async (page = 1, limit = 10, estado?: string): Promise<ResponseHoteles> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (estado) params.append("estado", estado);
    return await apiGet<ResponseHoteles>(`/hoteles/obtener-hoteles?${params}`);
  },

  // GET /api/hoteles/:id
  obtenerPorId: async (id: string): Promise<{ ok: boolean; hotel: Hotel }> => {
    return await apiGet(`/hoteles/${id}`);
  },

  // POST /api/hoteles/crear
  crear: async (data: CreateHotelData): Promise<{ ok: boolean; hotel: Hotel }> => {
    return await apiPost("/hoteles/crear", data);
  },

  // PUT /api/hoteles/:id
  actualizar: async (id: string, data: Partial<Hotel>): Promise<{ ok: boolean; hotel: Hotel }> => {
    return await apiPut(`/hoteles/${id}`, data);
  },

  // PATCH /api/hoteles/:id/estado
  cambiarEstado: async (id: string, estado: "activo" | "suspendido" | "cancelado"): Promise<{ ok: boolean; hotel: Hotel }> => {
    return await apiPatch(`/hoteles/${id}/estado`, { estado });
  },

  // GET /api/hoteles/estadisticas
  obtenerEstadisticas: async (): Promise<{ ok: boolean; estadisticas: { total: number; activos: number; suspendidos: number; cancelados: number } }> => {
    return await apiGet("/hoteles/estadisticas");
  },

  // GET /api/hoteles/proximos-vencer
  obtenerProximosVencer: async (): Promise<{ ok: boolean; hoteles: Hotel[] }> => {
    return await apiGet("/hoteles/proximos-vencer");
  },

  // GET /api/hoteles/estado/:estado
  obtenerPorEstado: async (estado: "activo" | "suspendido" | "cancelado"): Promise<{ ok: boolean; hoteles: Hotel[] }> => {
    return await apiGet(`/hoteles/estado/${estado}`);
  },

  // DELETE /api/hoteles/:id
  eliminar: async (id: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/hoteles/${id}`);
  },
};
