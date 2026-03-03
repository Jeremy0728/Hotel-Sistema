import type {
  CorporateClient,
  Guest,
  Hotel,
  HotelSettings,
  InventoryItem,
  InventoryLocation,
  Invoice,
  InvoicePayment,
  OccupancyPoint,
  PaymentMethod,
  PlanInfo,
  PlanModule,
  Product,
  ProductCategory,
  Reservation,
  Room,
  RoomType,
  Sale,
  Service,
  ServiceBooking,
} from "@/types/hotel";

export interface HotelDataContextValue {
  hotels: Hotel[];
  currentHotelId: string;
  setCurrentHotelId: (hotelId: string) => void;
  scopeMode: "chain" | "hotel";
  setScopeMode: (mode: "chain" | "hotel") => void;
  rooms: Room[];
  roomTypes: RoomType[];
  guests: Guest[];
  reservations: Reservation[];
  occupancyTrend: OccupancyPoint[];
  corporateClients: CorporateClient[];
  services: Service[];
  serviceBookings: ServiceBooking[];
  sales: Sale[];
  categories: ProductCategory[];
  products: Product[];
  locations: InventoryLocation[];
  inventory: InventoryItem[];
  hotelSettings: HotelSettings;
  planInfo: PlanInfo;
  planModules: PlanModule[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  addRoomType: (roomType: RoomType) => void;
  updateRoomType: (roomTypeId: string, updates: Partial<RoomType>) => void;
  removeRoomType: (roomTypeId: string) => void;
  addGuest: (guest: Guest) => void;
  updateGuest: (guestId: string, updates: Partial<Guest>) => void;
  addService: (service: Service) => void;
  updateService: (serviceId: string, updates: Partial<Service>) => void;
  removeService: (serviceId: string) => void;
  addServiceBooking: (booking: ServiceBooking) => void;
  updateServiceBooking: (
    bookingId: string,
    updates: Partial<ServiceBooking>
  ) => void;
  addSale: (sale: Omit<Sale, "id" | "number" | "date" | "subtotal" | "tax" | "total">) => void;
  addCorporateClient: (client: CorporateClient) => void;
  updateCorporateClient: (
    clientId: string,
    updates: Partial<CorporateClient>
  ) => void;
  addCategory: (category: ProductCategory) => void;
  updateCategory: (categoryId: string, updates: Partial<ProductCategory>) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  addLocation: (location: InventoryLocation) => void;
  updateLocation: (locationId: string, updates: Partial<InventoryLocation>) => void;
  updateInventoryItem: (
    itemId: string,
    updates: Partial<InventoryItem>
  ) => void;
  updateHotelSettings: (updates: Partial<HotelSettings>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (
    methodId: string,
    updates: Partial<PaymentMethod>
  ) => void;
  addInvoicePayment?: (
    invoiceId: string,
    payment: Omit<InvoicePayment, "id">
  ) => void;
  addReservation: (reservation: Omit<Reservation, "id" | "code" | "createdAt">) => void;
  updateReservation: (
    reservationId: string,
    updates: Partial<Reservation>
  ) => void;
  completeCheckIn: (reservationId: string) => void;
  completeCheckOut: (reservationId: string) => void;
}
