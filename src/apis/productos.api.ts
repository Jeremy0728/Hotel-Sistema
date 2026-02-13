import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface Producto {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  price: string;
  cost?: string;
  sku?: string;
  barcode?: string;
  unit: string;
  is_active: boolean;
}

interface ResponseProductos {
  ok: boolean;
  productos: Producto[];
  total: number;
  page: number;
  totalPages: number;
}

export const productosApi = {
  // GET /api/productos/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: Record<string, string>): Promise<ResponseProductos> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiGet<ResponseProductos>(`/productos/traer-todos?${params}`);
  },

  // GET /api/productos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; producto: Producto }> => {
    return await apiGet(`/productos/traer-por-id/${id}`);
  },

  // GET /api/productos/buscar-por-codigo/:code
  buscarPorCodigo: async (code: string): Promise<{ ok: boolean; producto: Producto | null }> => {
    return await apiGet(`/productos/buscar-por-codigo/${code}`);
  },

  // POST /api/productos/crear
  crear: async (data: Omit<Producto, "id">): Promise<{ ok: boolean; producto: Producto }> => {
    return await apiPost("/productos/crear", data);
  },

  // PUT /api/productos/actualizar/:id
  actualizar: async (id: number, data: Partial<Producto>): Promise<{ ok: boolean; producto: Producto }> => {
    return await apiPut(`/productos/actualizar/${id}`, data);
  },

  // DELETE /api/productos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/productos/eliminar/${id}`);
  },

  // GET /api/productos/por-categoria/:categoryId
  obtenerPorCategoria: async (categoryId: number): Promise<{ ok: boolean; productos: Producto[] }> => {
    return await apiGet(`/productos/por-categoria/${categoryId}`);
  },

  // GET /api/productos/activos
  obtenerActivos: async (): Promise<{ ok: boolean; productos: Producto[] }> => {
    return await apiGet("/productos/activos");
  },
};
