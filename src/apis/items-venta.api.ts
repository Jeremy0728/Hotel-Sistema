import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";

interface ItemVenta {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  discount?: string;
  total: string;
}

interface ResponseItemsVenta {
  ok: boolean;
  items: ItemVenta[];
  total: number;
  page: number;
  totalPages: number;
}

export const itemsVentaApi = {
  // GET /api/items-venta/traer-por-venta/:saleId
  traerPorVenta: async (saleId: number): Promise<{ ok: boolean; items: ItemVenta[] }> => {
    return await apiGet(`/items-venta/traer-por-venta/${saleId}`);
  },

  // GET /api/items-venta/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; item: ItemVenta }> => {
    return await apiGet(`/items-venta/traer-por-id/${id}`);
  },

  // POST /api/items-venta/crear
  crear: async (data: Omit<ItemVenta, "id">): Promise<{ ok: boolean; item: ItemVenta }> => {
    return await apiPost("/items-venta/crear", data);
  },

  // PUT /api/items-venta/actualizar/:id
  actualizar: async (id: number, data: Partial<ItemVenta>): Promise<{ ok: boolean; item: ItemVenta }> => {
    return await apiPut(`/items-venta/actualizar/${id}`, data);
  },

  // DELETE /api/items-venta/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/items-venta/eliminar/${id}`);
  },
};
