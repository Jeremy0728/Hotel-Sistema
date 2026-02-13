import { apiGet, apiPost, apiDelete } from "@/lib/api/apiWrapper";

export const usuariosRolesApi = {
  // GET /api/usuarios-roles/traer-por-usuario/:userId
  traerPorUsuario: async (userId: number): Promise<{ ok: boolean; roles: number[] }> => {
    return await apiGet(`/usuarios-roles/traer-por-usuario/${userId}`);
  },

  // POST /api/usuarios-roles/asignar
  asignar: async (userId: number, roleId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/usuarios-roles/asignar", { user_id: userId, role_id: roleId });
  },

  // POST /api/usuarios-roles/asignar-multiple
  asignarMultiple: async (userId: number, roleIds: number[]): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/usuarios-roles/asignar-multiple", { user_id: userId, role_ids: roleIds });
  },

  // DELETE /api/usuarios-roles/remover
  remover: async (userId: number, roleId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete("/usuarios-roles/remover", { data: { user_id: userId, role_id: roleId } });
  },

  // DELETE /api/usuarios-roles/remover-todos/:userId
  removerTodos: async (userId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/usuarios-roles/remover-todos/${userId}`);
  },
};
