import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";
import type {
  PaymentMethod,
  PaymentMethodsResponse,
  PaymentMethodResponse,
  PaymentMethodMutationResponse,
  PaymentMethodDeleteResponse,
} from "@/types/payment-method";

export const metodosPagoApi = {
  // GET /api/metodos-pago/traer-todos
  traerTodos: async (page = 1, limit = 100, is_active?: boolean): Promise<PaymentMethodsResponse> => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    if (is_active !== undefined) {
      params.append('is_active', is_active.toString());
    }
    return await apiGet<PaymentMethodsResponse>(`/metodos-pago/traer-todos?${params}`);
  },

  // GET /api/metodos-pago/traer-por-id/:id
  traerPorId: async (id: number): Promise<PaymentMethodResponse> => {
    return await apiGet(`/metodos-pago/traer-por-id/${id}`);
  },

  // POST /api/metodos-pago/crear
  crear: async (data: Omit<PaymentMethod, "id" | "created_at">): Promise<PaymentMethodMutationResponse> => {
    return await apiPost("/metodos-pago/crear", data);
  },

  // PUT /api/metodos-pago/actualizar/:id
  actualizar: async (id: number, data: Partial<PaymentMethod>): Promise<PaymentMethodMutationResponse> => {
    return await apiPut(`/metodos-pago/actualizar/${id}`, data);
  },

  // DELETE /api/metodos-pago/eliminar/:id
  eliminar: async (id: number): Promise<PaymentMethodDeleteResponse> => {
    return await apiDelete(`/metodos-pago/eliminar/${id}`);
  },

  // GET /api/metodos-pago/traer-todos con filtro de activos
  obtenerActivos: async (): Promise<PaymentMethodsResponse> => {
    return await metodosPagoApi.traerTodos(1, 100, true);
  },
};
