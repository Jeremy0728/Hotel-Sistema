import { apiGet } from "@/lib/api/apiWrapper";

export interface Pais {
  id: number;
  code: string;
  name: string;
  nationality: string;
  phone_code: string;
  is_active: boolean;
}

export interface ResponsePaises {
  ok: boolean;
  countries: Pais[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const paisesApi = {
  // GET /api/paises/traer-todos
  traerTodos: async (page = 1, limit = 100, is_active?: boolean): Promise<ResponsePaises> => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    if (is_active !== undefined) {
      params.append('is_active', is_active.toString());
    }
    return await apiGet<ResponsePaises>(`/paises/traer-todos?${params}`);
  },
};
