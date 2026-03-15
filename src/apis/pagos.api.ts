import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiWrapper";
import type {
  Payment,
  CreatePaymentData,
  PaymentsResponse,
  PaymentMutationResponse,
} from "@/types/invoice";

export const pagosApi = {
  // GET /api/pagos/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: { status?: string; from_date?: string; to_date?: string }): Promise<PaymentsResponse> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters?.status) params.append("status", filters.status);
    if (filters?.from_date) params.append("from_date", filters.from_date);
    if (filters?.to_date) params.append("to_date", filters.to_date);
    return await apiGet<PaymentsResponse>(`/pagos/traer-todos?${params}`);
  },

  // GET /api/pagos/traer-por-id/:id
  traerPorId: async (id: number): Promise<{ ok: boolean; payment: Payment }> => {
    return await apiGet<{ ok: boolean; payment: Payment }>(`/pagos/traer-por-id/${id}`);
  },

  // GET /api/pagos/traer-por-factura/:invoiceId
  traerPorFactura: async (invoiceId: number): Promise<{ ok: boolean; payments: Payment[] }> => {
    return await apiGet<{ ok: boolean; payments: Payment[] }>(`/pagos/traer-por-factura/${invoiceId}`);
  },

  // POST /api/pagos/crear
  crear: async (data: CreatePaymentData): Promise<PaymentMutationResponse> => {
    return await apiPost<PaymentMutationResponse>("/pagos/crear", data);
  },

  // PUT /api/pagos/actualizar/:id
  actualizar: async (id: number, data: Partial<CreatePaymentData>): Promise<PaymentMutationResponse> => {
    return await apiPut<PaymentMutationResponse>(`/pagos/actualizar/${id}`, data);
  },

  // DELETE /api/pagos/eliminar/:id
  eliminar: async (id: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete<{ ok: boolean; msg: string }>(`/pagos/eliminar/${id}`);
  },

  // GET /api/pagos/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; payments: Payment[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet<{ ok: boolean; payments: Payment[] }>(`/pagos/por-fecha?${params}`);
  },
};
