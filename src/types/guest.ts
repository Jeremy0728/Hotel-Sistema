export interface Huesped {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  phone: string;
  document_type: "dni" | "passport" | "ce";
  document_number: string;
  nationality?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  preferences?: Record<string, unknown>;
  is_active: boolean;
}