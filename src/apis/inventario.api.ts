import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";

interface Inventario {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  min_stock?: number;
  max_stock?: number;
  last_updated: string;
}

interface ResponseInventario {
  ok: boolean;
  inventario: Inventario[];
  total: number;
  page: number;
  totalPages: number;
}

export const inventarioApi = {
  // GET /api/inventario/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: Record<string, string>): Promise<ResponseInventario> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiGet<ResponseInventario>(`/inventario/traer-todos?${params}`);
  },

  // GET /api/inventario/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; inventario: Inventario }> => {
    return await apiGet(`/inventario/traer-por-id/${id}`);
  },

  // GET /api/inventario/por-producto/:productId
  traerPorProducto: async (productId: number): Promise<{ ok: boolean; inventario: Inventario[] }> => {
    return await apiGet(`/inventario/por-producto/${productId}`);
  },

  // GET /api/inventario/por-ubicacion/:locationId
  traerPorUbicacion: async (locationId: number): Promise<{ ok: boolean; inventario: Inventario[] }> => {
    return await apiGet(`/inventario/por-ubicacion/${locationId}`);
  },

  // POST /api/inventario/crear
  crear: async (data: Omit<Inventario, "id" | "last_updated">): Promise<{ ok: boolean; inventario: Inventario }> => {
    return await apiPost("/inventario/crear", data);
  },

  // PUT /api/inventario/actualizar/:id
  actualizar: async (id: number, data: Partial<Inventario>): Promise<{ ok: boolean; inventario: Inventario }> => {
    return await apiPut(`/inventario/actualizar/${id}`, data);
  },

  // PATCH /api/inventario/ajustar-stock/:id
  ajustarStock: async (id: number, quantity: number, reason?: string): Promise<{ ok: boolean; inventario: Inventario }> => {
    return await apiPatch(`/inventario/ajustar-stock/${id}`, { quantity, reason });
  },

  // GET /api/inventario/bajo-stock
  obtenerBajoStock: async (): Promise<{ ok: boolean; inventario: Inventario[] }> => {
    return await apiGet("/inventario/bajo-stock");
  },

  // POST /api/inventario/transferir
  transferir: async (productId: number, fromLocationId: number, toLocationId: number, quantity: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/inventario/transferir", { product_id: productId, from_location_id: fromLocationId, to_location_id: toLocationId, quantity });
  },
};
