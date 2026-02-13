import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface CatalogoItem {
  id: number;
  catalog_type: string;
  code: string;
  name: string;
  description?: string;
  value?: string;
  parent_id?: number;
  order?: number;
  is_active: boolean;
}

interface ResponseCatalogos {
  ok: boolean;
  items: CatalogoItem[];
  total: number;
  page: number;
  totalPages: number;
}

export const catalogosApi = {
  // GET /api/catalogos/traer-por-tipo/:catalogType
  traerPorTipo: async (catalogType: string, page = 1, limit = 10): Promise<ResponseCatalogos> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiGet<ResponseCatalogos>(`/catalogos/traer-por-tipo/${catalogType}?${params}`);
  },

  // GET /api/catalogos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; item: CatalogoItem }> => {
    return await apiGet(`/catalogos/traer-por-id/${id}`);
  },

  // POST /api/catalogos/crear
  crear: async (data: Omit<CatalogoItem, "id">): Promise<{ ok: boolean; item: CatalogoItem }> => {
    return await apiPost("/catalogos/crear", data);
  },

  // PUT /api/catalogos/actualizar/:id
  actualizar: async (id: number, data: Partial<CatalogoItem>): Promise<{ ok: boolean; item: CatalogoItem }> => {
    return await apiPut(`/catalogos/actualizar/${id}`, data);
  },

  // DELETE /api/catalogos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/catalogos/eliminar/${id}`);
  },

  // GET /api/catalogos/activos/:catalogType
  obtenerActivos: async (catalogType: string): Promise<{ ok: boolean; items: CatalogoItem[] }> => {
    return await apiGet(`/catalogos/activos/${catalogType}`);
  },
};
