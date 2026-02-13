export interface Role {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseRoles {
  data: Role[];
  count?: number;
  message: string;
}

export interface ResponseRole {
  data: Role;
  count?: number;
  message: string;
}

  
