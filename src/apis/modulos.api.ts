import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Modulo {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  icono?: string;
  is_active: boolean;
}

interface ResponseModulos {
  ok: boolean;
  modulos: Modulo[];
  total: number;
  page: number;
  totalPages: number;
}

export const modulosApi = {
  // GET /api/modulos/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseModulos> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseModulos>(`/modulos/traer-todos?${params}`);
  },

  // GET /api/modulos/traer-por-id/:id
  traerPorId: async (id: string): Promise<{ ok: boolean; modulo: Modulo }> => {
    return await apiGet(`/modulos/traer-por-id/${id}`);
  },

  // POST /api/modulos/crear
  crear: async (data: Omit<Modulo, "id">): Promise<{ ok: boolean; modulo: Modulo }> => {
    return await apiPost("/modulos/crear", data);
  },

  // PUT /api/modulos/actualizar/:id
  actualizar: async (id: string, data: Partial<Modulo>): Promise<{ ok: boolean; modulo: Modulo }> => {
    return await apiPut(`/modulos/actualizar/${id}`, data);
  },

  // DELETE /api/modulos/eliminar/:id
  eliminar: async (id: string): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/modulos/eliminar/${id}`);
  },

  // GET /api/modulos/activos
  obtenerActivos: async (): Promise<{ ok: boolean; modulos: Modulo[] }> => {
    return await apiGet("/modulos/activos");
  },
};
