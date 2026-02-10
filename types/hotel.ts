export type RoomStatus =
  | "available"
  | "occupied"
  | "cleaning"
  | "maintenance"
  | "out_of_service";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checkin"
  | "checkout"
  | "cancelled";

export type ProductStatus = "active" | "inactive";

export type LocationStatus = "active" | "inactive";

export type LocationType = "reception" | "minibar" | "storage" | "restaurant";

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: RoomStatus;
  notes?: string;
}

export type RoomTypeStatus = "active" | "inactive";

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  maxGuests: number;
  rateHour: number;
  rateDay: number;
  rateWeek: number;
  rateMonth: number;
  amenities: string[];
  status: RoomTypeStatus;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  nationality: string;
  city?: string;
  country?: string;
  address?: string;
  birthDate?: string;
  preferences?: Record<string, unknown>;
}

export interface Reservation {
  id: string;
  code: string;
  guestId: string;
  guestName: string;
  additionalGuestIds?: string[];
  roomId: string;
  roomNumber: string;
  status: ReservationStatus;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  adults: number;
  children: number;
  notes?: string;
  createdAt: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
}

export type CorporateClientStatus = "active" | "inactive";

export interface CorporateClient {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  taxId: string;
  discount: number;
  paymentTerms: number;
  country?: string;
  status: CorporateClientStatus;
}

export interface OccupancyPoint {
  label: string;
  value: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  status: ProductStatus;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price: number;
  cost: number;
  status: ProductStatus;
  trackStock: boolean;
  description?: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  type: LocationType;
  roomId?: string;
  roomNumber?: string;
  status: LocationStatus;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  locationId: string;
  locationName: string;
  stock: number;
  minStock: number;
  unit?: string;
}

export type SaleStatus = "paid" | "pending" | "cancelled";

export interface SaleItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  number: string;
  date: string;
  guestId?: string;
  guestName?: string;
  status: SaleStatus;
  paymentMethod?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

export type ServiceStatus = "active" | "inactive";

export interface Service {
  id: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  durationMinutes: number;
  status: ServiceStatus;
}

export type ServiceBookingStatus = "scheduled" | "completed" | "cancelled";

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  guestId: string;
  guestName: string;
  date: string;
  time: string;
  status: ServiceBookingStatus;
  price: number;
  notes?: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  methodId: string;
  methodName: string;
  reference?: string;
  date: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  clientName: string;
  clientType: "guest" | "corporate";
  reservationCode?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  balance: number;
  payments: InvoicePayment[];
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
}

export interface HotelSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  taxRate: number;
  taxInclusive: boolean;
}

export interface PlanInfo {
  name: string;
  price: number;
  renewalDate: string;
  status: "active" | "inactive";
}

export interface PlanModule {
  id: string;
  name: string;
  description: string;
  status: "active" | "available" | "unavailable";
  requiredPlan?: string;
}
