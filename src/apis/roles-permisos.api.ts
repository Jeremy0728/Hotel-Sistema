import { apiGet, apiPost, apiDelete } from "@/lib/api/apiWrapper";

interface RolPermiso {
  role_id: number;
  permission_id: number;
}

export const rolesPermisosApi = {
  // GET /api/roles-permisos/traer-por-rol/:roleId
  traerPorRol: async (roleId: number): Promise<{ ok: boolean; permisos: number[] }> => {
    return await apiGet(`/roles-permisos/traer-por-rol/${roleId}`);
  },

  // POST /api/roles-permisos/asignar
  asignar: async (roleId: number, permissionId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/roles-permisos/asignar", { role_id: roleId, permission_id: permissionId });
  },

  // POST /api/roles-permisos/asignar-multiple
  asignarMultiple: async (roleId: number, permissionIds: number[]): Promise<{ ok: boolean; msg: string }> => {
    return await apiPost("/roles-permisos/asignar-multiple", { role_id: roleId, permission_ids: permissionIds });
  },

  // DELETE /api/roles-permisos/remover
  remover: async (roleId: number, permissionId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete("/roles-permisos/remover", { data: { role_id: roleId, permission_id: permissionId } });
  },

  // DELETE /api/roles-permisos/remover-todos/:roleId
  removerTodos: async (roleId: number): Promise<{ ok: boolean; msg: string }> => {
    return await apiDelete(`/roles-permisos/remover-todos/${roleId}`);
  },
};
