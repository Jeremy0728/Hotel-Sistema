import { apiGet } from "@/lib/api/apiWrapper";

export interface TipoDocumento {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface ResponseTiposDocumento {
  ok: boolean;
  documentTypes: TipoDocumento[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const tiposDocumentoApi = {
  // GET /api/tipos-documento/traer-todos
  traerTodos: async (page = 1, limit = 100, is_active?: boolean): Promise<ResponseTiposDocumento> => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    if (is_active !== undefined) {
      params.append('is_active', is_active.toString());
    }
    return await apiGet<ResponseTiposDocumento>(`/tipos-documento/traer-todos?${params}`);
  },
};
