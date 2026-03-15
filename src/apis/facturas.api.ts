import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api/apiWrapper";
import type {
  Invoice,
  InvoiceStatus,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoicesResponse,
  InvoiceResponse,
  InvoiceMutationResponse,
} from "@/types/invoice";

export const facturasApi = {
  // GET /api/facturas/traer-todos
  traerTodos: async (page = 1, limit = 10, filters?: { status?: InvoiceStatus; from_date?: string; to_date?: string; client_name?: string }): Promise<InvoicesResponse> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters?.status) params.append("status", filters.status);
    if (filters?.from_date) params.append("from_date", filters.from_date);
    if (filters?.to_date) params.append("to_date", filters.to_date);
    if (filters?.client_name) params.append("client_name", filters.client_name);
    return await apiGet<InvoicesResponse>(`/facturas/traer-todos?${params}`);
  },

  // GET /api/facturas/traer-por-id/:id
  traerPorId: async (id: number): Promise<InvoiceResponse> => {
    return await apiGet<InvoiceResponse>(`/facturas/traer-por-id/${id}`);
  },

  // GET /api/facturas/traer-por-reserva/:reservationId
  traerPorReserva: async (reservationId: number): Promise<{ ok: boolean; invoice: Invoice | null }> => {
    return await apiGet<{ ok: boolean; invoice: Invoice | null }>(`/facturas/traer-por-reserva/${reservationId}`);
  },

  // POST /api/facturas/crear
  crear: async (data: CreateInvoiceData): Promise<InvoiceMutationResponse> => {
    return await apiPost<InvoiceMutationResponse>("/facturas/crear", data);
  },

  // PUT /api/facturas/actualizar/:id
  actualizar: async (id: number, data: UpdateInvoiceData): Promise<InvoiceMutationResponse> => {
    return await apiPut<InvoiceMutationResponse>(`/facturas/actualizar/${id}`, data);
  },

  // PATCH /api/facturas/cambiar-estado/:id
  cambiarEstado: async (id: number, status: InvoiceStatus): Promise<InvoiceMutationResponse> => {
    return await apiPatch<InvoiceMutationResponse>(`/facturas/cambiar-estado/${id}`, { status });
  },

  // GET /api/facturas/pendientes
  obtenerPendientes: async (): Promise<{ ok: boolean; invoices: Invoice[] }> => {
    return await apiGet<{ ok: boolean; invoices: Invoice[] }>("/facturas/pendientes");
  },

  // GET /api/facturas/por-fecha
  obtenerPorFecha: async (startDate: string, endDate: string): Promise<{ ok: boolean; invoices: Invoice[] }> => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await apiGet<{ ok: boolean; invoices: Invoice[] }>(`/facturas/por-fecha?${params}`);
  },
};
