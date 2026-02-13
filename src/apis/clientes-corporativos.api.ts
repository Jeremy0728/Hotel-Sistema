import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface ClienteCorporativo {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  ruc?: string;
  address?: string;
  city?: string;
  country?: string;
  discount_percentage?: number;
  payment_terms?: string;
  is_active: boolean;
}

interface ResponseClientesCorporativos {
  ok: boolean;
  clientes: ClienteCorporativo[];
  total: number;
  page: number;
  totalPages: number;
}

export const clientesCorporativosApi = {
  // GET /api/clientes-corporativos/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseClientesCorporativos> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseClientesCorporativos>(`/clientes-corporativos/traer-todos?${params}`);
  },

  // GET /api/clientes-corporativos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; cliente: ClienteCorporativo }> => {
    return await apiGet(`/clientes-corporativos/traer-por-id/${id}`);
  },

  // POST /api/clientes-corporativos/crear
  crear: async (data: Omit<ClienteCorporativo, "id">): Promise<{ ok: boolean; cliente: ClienteCorporativo }> => {
    return await apiPost("/clientes-corporativos/crear", data);
  },

  // PUT /api/clientes-corporativos/actualizar/:id
  actualizar: async (id: number, data: Partial<ClienteCorporativo>): Promise<{ ok: boolean; cliente: ClienteCorporativo }> => {
    return await apiPut(`/clientes-corporativos/actualizar/${id}`, data);
  },

  // DELETE /api/clientes-corporativos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/clientes-corporativos/eliminar/${id}`);
  },

  // GET /api/clientes-corporativos/activos
  obtenerActivos: async (): Promise<{ ok: boolean; clientes: ClienteCorporativo[] }> => {
    return await apiGet("/clientes-corporativos/activos");
  },
};
