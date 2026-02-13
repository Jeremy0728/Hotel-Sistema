import { Role } from "./role";

export interface User {
  id?: number;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  is_active: boolean;
  nro_documento: string;
  tipo_documento_id: number;
  created_at?: string;
  password?: string;
  roles?: Role[];
  rolesIds?: number[];
  nombre_completo?: string;
}

export interface ResponseUser {
  data: User[];
  count?: number;
  message: string;
}

export interface ResponseUserById {
  data: User;
  count?: number;
  message: string;
}

