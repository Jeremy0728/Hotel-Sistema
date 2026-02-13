export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  phone: string;
}

export interface LoginResponse {
  user: User;
  message: string;
  token: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  nombre_completo: string;
  roles: Role[];
}

// NextAuth types
export interface NextAuthUser {
  id: string;
  email: string;
  nombre_completo: string;
  roles: Role[];
  accessToken: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  accessToken: string;
  expires: string;
}
