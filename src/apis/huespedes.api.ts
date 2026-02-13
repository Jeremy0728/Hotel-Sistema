import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Huesped {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  document_type: "dni" | "passport" | "ce";
  document_number: string;
  nationality?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  preferences?: Record<string, unknown>;
  is_active: boolean;
}

interface ResponseHuespedes {
  ok: boolean;
  huespedes: Huesped[];
  total: number;
  page: number;
  totalPages: number;
}

export const huespedesApi = {
  // GET /api/huespedes/traer-todos
  traerTodos: async (page = 1, limit = 10, search?: string): Promise<ResponseHuespedes> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append("search", search);
    return await apiGet<ResponseHuespedes>(`/huespedes/traer-todos?${params}`);
  },

  // GET /api/huespedes/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; huesped: Huesped }> => {
    return await apiGet(`/huespedes/traer-por-id/${id}`);
  },

  // GET /api/huespedes/buscar-por-documento/:documentNumber
  buscarPorDocumento: async (documentNumber: string): Promise<{ ok: boolean; huesped: Huesped | null }> => {
    return await apiGet(`/huespedes/buscar-por-documento/${documentNumber}`);
  },

  // POST /api/huespedes/crear
  crear: async (data: Omit<Huesped, "id">): Promise<{ ok: boolean; huesped: Huesped }> => {
    return await apiPost("/huespedes/crear", data);
  },

  // PUT /api/huespedes/actualizar/:id
  actualizar: async (id: number, data: Partial<Huesped>): Promise<{ ok: boolean; huesped: Huesped }> => {
    return await apiPut(`/huespedes/actualizar/${id}`, data);
  },

  // DELETE /api/huespedes/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/huespedes/eliminar/${id}`);
  },

  // GET /api/huespedes/historial/:id
  obtenerHistorial: async (id: number): Promise<{ ok: boolean; historial: unknown[] }> => {
    return await apiGet(`/huespedes/historial/${id}`);
  },
};
