import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface UbicacionInventario {
  id: number;
  name: string;
  description?: string;
  location_type: "almacen" | "minibar" | "cocina" | "bar" | "otro";
  is_active: boolean;
}

interface ResponseUbicaciones {
  ok: boolean;
  ubicaciones: UbicacionInventario[];
  total: number;
  page: number;
  totalPages: number;
}

export const ubicacionesInventarioApi = {
  // GET /api/ubicaciones-inventario/traer-todos
  traerTodos: async (page = 1, limit = 10): Promise<ResponseUbicaciones> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseUbicaciones>(`/ubicaciones-inventario/traer-todos?${params}`);
  },

  // GET /api/ubicaciones-inventario/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; ubicacion: UbicacionInventario }> => {
    return await apiGet(`/ubicaciones-inventario/traer-por-id/${id}`);
  },

  // POST /api/ubicaciones-inventario/crear
  crear: async (data: Omit<UbicacionInventario, "id">): Promise<{ ok: boolean; ubicacion: UbicacionInventario }> => {
    return await apiPost("/ubicaciones-inventario/crear", data);
  },

  // PUT /api/ubicaciones-inventario/actualizar/:id
  actualizar: async (id: number, data: Partial<UbicacionInventario>): Promise<{ ok: boolean; ubicacion: UbicacionInventario }> => {
    return await apiPut(`/ubicaciones-inventario/actualizar/${id}`, data);
  },

  // DELETE /api/ubicaciones-inventario/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/ubicaciones-inventario/eliminar/${id}`);
  },

  // GET /api/ubicaciones-inventario/activas
  obtenerActivas: async (): Promise<{ ok: boolean; ubicaciones: UbicacionInventario[] }> => {
    return await apiGet("/ubicaciones-inventario/activas");
  },

  // GET /api/ubicaciones-inventario/por-tipo/:tipo
  obtenerPorTipo: async (tipo: string): Promise<{ ok: boolean; ubicaciones: UbicacionInventario[] }> => {
    return await apiGet(`/ubicaciones-inventario/por-tipo/${tipo}`);
  },
};
