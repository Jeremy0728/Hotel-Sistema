export type RoleName = 
  | 'Administrador'
  | 'Entrenador'
  | 'Asistente'
  | 'Padre'
  | 'Estudiante';

export interface RoleCondition {
  roles: RoleName[];
}

export interface RoleGuardProps {
  allowedRoles: RoleName[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ConditionalRenderProps {
  condition: RoleCondition;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface NavigationItem {
  path: string;
  roles: RoleName[];
  label: string;
  icon?: string;
}

export interface RoleBasedNavigationProps {
  items: NavigationItem[];
  className?: string;
}

// Constantes de roles
export const ROLES = {
  ADMINISTRADOR: 'Administrador' as const,
  ENTRENADOR: 'Entrenador' as const,
  ASISTENTE: 'Asistente' as const,
  PADRE: 'Padre' as const,
  ESTUDIANTE: 'Estudiante' as const,
} as const;

// Mapeo de IDs a nombres de roles
export const ROLE_ID_MAP: Record<number, RoleName> = {
  1: ROLES.ADMINISTRADOR,
  2: ROLES.ENTRENADOR,
  9: ROLES.ASISTENTE,
  4: ROLES.PADRE,
  3: ROLES.ESTUDIANTE,
};
