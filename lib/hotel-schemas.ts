import { z } from "zod";

export const roomSchema = z.object({
  number: z.string().min(1, "El número de habitación es requerido"),
  type: z.string().min(1, "El tipo de habitación es requerido"),
  floor: z.coerce
    .number()
    .int("El piso debe ser un número entero")
    .min(1, "El piso debe ser mayor a 0"),
  status: z.enum([
    "available",
    "occupied",
    "cleaning",
    "maintenance",
    "out_of_service",
  ]),
  notes: z.string().optional(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;

export const roomTypeSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  maxGuests: z.coerce
    .number()
    .int("Capacidad invalida")
    .min(1, "Capacidad requerida"),
  rateHour: z.coerce.number().min(0, "Precio invalido"),
  rateDay: z.coerce.number().min(0, "Precio invalido"),
  rateWeek: z.coerce.number().min(0, "Precio invalido"),
  rateMonth: z.coerce.number().min(0, "Precio invalido"),
  amenities: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;

export const guestSchema = z.object({
  firstName: z.string().min(1, "Nombres requeridos"),
  lastName: z.string().min(1, "Apellido paterno requerido"),
  secondLastName: z.string().optional(),
  birthDate: z.string().optional(),
  documentType: z.string().min(1, "Tipo de documento requerido"),
  documentNumber: z.string().min(5, "Número de documento inválido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{9}$/, "Teléfono debe tener 9 dígitos"),
  nationality: z.string().min(1, "Nacionalidad requerida"),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
});

export type GuestFormValues = z.infer<typeof guestSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  sku: z.string().min(1, "SKU requerido"),
  categoryId: z.string().min(1, "Categoria requerida"),
  price: z.coerce.number().min(0, "Precio debe ser mayor o igual a 0"),
  cost: z.coerce.number().min(0, "Costo debe ser mayor o igual a 0"),
  status: z.enum(["active", "inactive"]),
  trackStock: z.boolean(),
  description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const locationSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  type: z.enum(["reception", "minibar", "storage", "restaurant"]),
  roomId: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

export const stockAdjustSchema = z.object({
  stock: z.coerce.number().min(0, "Stock debe ser mayor o igual a 0"),
  minStock: z.coerce.number().min(0, "Stock minimo debe ser mayor o igual a 0"),
});

export type StockAdjustValues = z.infer<typeof stockAdjustSchema>;

export const serviceSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Precio invalido"),
  durationMinutes: z.coerce
    .number()
    .int("Duracion invalida")
    .min(15, "Minimo 15 minutos"),
  status: z.enum(["active", "inactive"]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const serviceBookingSchema = z.object({
  serviceId: z.string().min(1, "Servicio requerido"),
  guestId: z.string().min(1, "Huesped requerido"),
  date: z.string().min(1, "Fecha requerida"),
  time: z.string().min(1, "Hora requerida"),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  notes: z.string().optional(),
});

export type ServiceBookingFormValues = z.infer<typeof serviceBookingSchema>;

export const hotelSettingsSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  address: z.string().min(1, "Direccion requerida"),
  phone: z.string().min(6, "Telefono requerido"),
  email: z.string().email("Correo invalido"),
  taxId: z.string().min(1, "RUC requerido"),
  currency: z.string().min(1, "Moneda requerida"),
  timezone: z.string().min(1, "Zona horaria requerida"),
  dateFormat: z.string().min(1, "Formato de fecha requerido"),
  language: z.string().min(1, "Idioma requerido"),
  checkInTime: z.string().min(1, "Hora de check-in requerida"),
  checkOutTime: z.string().min(1, "Hora de check-out requerida"),
  cancellationPolicy: z.string().optional(),
  taxRate: z.coerce.number().min(0, "Impuesto invalido"),
  taxInclusive: z.boolean(),
});

export type HotelSettingsValues = z.infer<typeof hotelSettingsSchema>;

export const paymentMethodSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  type: z.string().min(1, "Tipo requerido"),
  status: z.enum(["active", "inactive"]),
});

export type PaymentMethodValues = z.infer<typeof paymentMethodSchema>;

export const invoicePaymentSchema = z.object({
  amount: z.coerce.number().min(1, "Monto requerido"),
  methodId: z.string().min(1, "Metodo requerido"),
  reference: z.string().optional(),
  date: z.string().min(1, "Fecha requerida"),
  notes: z.string().optional(),
});

export type InvoicePaymentValues = z.infer<typeof invoicePaymentSchema>;

export const corporateClientSchema = z.object({
  companyName: z.string().min(1, "Nombre de empresa requerido"),
  contactName: z.string().min(1, "Contacto requerido"),
  contactEmail: z.string().email("Correo invalido"),
  contactPhone: z.string().min(6, "Telefono requerido"),
  taxId: z.string().min(1, "RUC requerido"),
  discount: z.coerce.number().min(0, "Descuento invalido").max(100, "Max 100%"),
  paymentTerms: z.coerce.number().min(0, "Terminos invalidos"),
  country: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type CorporateClientValues = z.infer<typeof corporateClientSchema>;
