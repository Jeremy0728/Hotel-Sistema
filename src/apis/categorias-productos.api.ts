import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface CategoriaProducto {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
}

interface ResponseCategorias {
  ok: boolean;
  categorias: CategoriaProducto[];
  total: number;
  page: number;
  totalPages: number;
}

export const categoriasProductosApi = {
  // GET /api/categorias-productos/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseCategorias> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseCategorias>(`/categorias-productos/traer-todos?${params}`);
  },

  // GET /api/categorias-productos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; categoria: CategoriaProducto }> => {
    return await apiGet(`/categorias-productos/traer-por-id/${id}`);
  },

  // POST /api/categorias-productos/crear
  crear: async (data: Omit<CategoriaProducto, "id">): Promise<{ ok: boolean; categoria: CategoriaProducto }> => {
    return await apiPost("/categorias-productos/crear", data);
  },

  // PUT /api/categorias-productos/actualizar/:id
  actualizar: async (id: number, data: Partial<CategoriaProducto>): Promise<{ ok: boolean; categoria: CategoriaProducto }> => {
    return await apiPut(`/categorias-productos/actualizar/${id}`, data);
  },

  // DELETE /api/categorias-productos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/categorias-productos/eliminar/${id}`);
  },

  // GET /api/categorias-productos/activas
  obtenerActivas: async (): Promise<{ ok: boolean; categorias: CategoriaProducto[] }> => {
    return await apiGet("/categorias-productos/activas");
  },

  // GET /api/categorias-productos/jerarquia
  obtenerJerarquia: async (): Promise<{ ok: boolean; categorias: CategoriaProducto[] }> => {
    return await apiGet("/categorias-productos/jerarquia");
  },
};
