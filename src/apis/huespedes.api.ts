import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface DocumentType {
  id: number;
  code: string;
  name: string;
  description?: string;
}

interface Country {
  id: number;
  code: string;
  name: string;
  nationality: string;
  phone_code?: string;
}

interface Huesped {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  document_type_id?: number;
  document_number?: string;
  document_type?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country_id?: number;
  preferences?: Record<string, unknown>;
  created_at?: string;
  documentType?: DocumentType;
  country?: Country;
}

interface ResponseHuespedes {
  ok: boolean;
  huespedes: Huesped[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface BuscarHuespedesParams {
  q?: string;
  document_type_id?: number;
  document_number?: string;
  email?: string;
  phone?: string;
  country_id?: number;
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

  // GET /api/huespedes/buscar
  buscar: async (params: BuscarHuespedesParams): Promise<{ ok: boolean; huespedes: Huesped[]; totalCount: number }> => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.document_type_id) searchParams.append('document_type_id', params.document_type_id.toString());
    if (params.document_number) searchParams.append('document_number', params.document_number);
    if (params.email) searchParams.append('email', params.email);
    if (params.phone) searchParams.append('phone', params.phone);
    if (params.country_id) searchParams.append('country_id', params.country_id.toString());
    return await apiGet(`/huespedes/buscar?${searchParams}`);
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

  // GET /api/huespedes/traer-historial-reservas/:id
  traerHistorialReservas: async (id: number): Promise<{ ok: boolean; huesped: Huesped; reservas: unknown[] }> => {
    return await apiGet(`/huespedes/traer-historial-reservas/${id}`);
  },
};
