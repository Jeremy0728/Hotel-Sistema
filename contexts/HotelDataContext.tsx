"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CorporateClient,
  Guest,
  Hotel,
  HotelSettings,
  InventoryItem,
  InventoryLocation,
  Invoice,
  InvoicePayment,
  LocationStatus,
  LocationType,
  OccupancyPoint,
  PaymentMethod,
  PlanInfo,
  PlanModule,
  Product,
  ProductCategory,
  Reservation,
  ReservationStatus,
  Room,
  RoomStatus,
  RoomType,
  Sale,
  Service,
  ServiceBooking,
} from "@/types/hotel";

interface HotelDataContextValue {
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
  addInvoicePayment: (
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

const HotelDataContext = createContext<HotelDataContextValue | undefined>(
  undefined
);

const DAY_MS = 24 * 60 * 60 * 1000;

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

function toDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("es-PE", { weekday: "short" }).format(date);
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_MS));
  return diff;
}

function generateCode() {
  const stamp = Date.now().toString().slice(-6);
  return `RSV-${stamp}`;
}

export const HotelDataProvider = ({ children }: { children: ReactNode }) => {
  const [scopeMode, setScopeMode] = useState<"chain" | "hotel">("hotel");
  const [hotels] = useState<Hotel[]>(() => [
    {
      id: "hotel-aurora",
      name: "Hotel Aurora",
      chain: "Grupo Aurora",
      city: "Lima",
      country: "Perú",
      status: "active",
    },
    {
      id: "hotel-mar",
      name: "Hotel Mar Azul",
      chain: "Grupo Aurora",
      city: "Trujillo",
      country: "Perú",
      status: "active",
    },
    {
      id: "hotel-norte",
      name: "Hotel Norte",
      chain: "Grupo Aurora",
      city: "Piura",
      country: "Perú",
      status: "inactive",
    },
  ]);
  const [currentHotelId, setCurrentHotelId] = useState<string>(
    hotels[0]?.id ?? "hotel-aurora"
  );
  const today = new Date();
  const todayStr = toDateString(today);
  const tomorrowStr = toDateString(addDays(today, 1));
  const yesterdayStr = toDateString(addDays(today, -1));

  const [rooms, setRooms] = useState<Room[]>(() => [
    {
      id: "room-101",
      number: "101",
      type: "Individual",
      floor: 1,
      status: "available",
    },
    {
      id: "room-102",
      number: "102",
      type: "Doble",
      floor: 1,
      status: "occupied",
    },
    {
      id: "room-201",
      number: "201",
      type: "Suite",
      floor: 2,
      status: "cleaning",
    },
    {
      id: "room-202",
      number: "202",
      type: "Doble",
      floor: 2,
      status: "maintenance",
    },
    {
      id: "room-301",
      number: "301",
      type: "Suite",
      floor: 3,
      status: "out_of_service",
    },
  ]);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(() => [
    {
      id: "type-1",
      name: "Individual",
      description: "Habitacion individual con cama simple.",
      maxGuests: 1,
      rateHour: 30,
      rateDay: 160,
      rateWeek: 900,
      rateMonth: 3200,
      amenities: ["WiFi", "TV", "Aire acondicionado"],
      status: "active",
    },
    {
      id: "type-2",
      name: "Doble",
      description: "Habitacion doble para parejas o amigos.",
      maxGuests: 2,
      rateHour: 40,
      rateDay: 220,
      rateWeek: 1200,
      rateMonth: 4100,
      amenities: ["WiFi", "TV", "Minibar"],
      status: "active",
    },
    {
      id: "type-3",
      name: "Suite",
      description: "Suite con sala y vista panoramica.",
      maxGuests: 4,
      rateHour: 60,
      rateDay: 380,
      rateWeek: 2100,
      rateMonth: 7500,
      amenities: ["WiFi", "TV", "Jacuzzi", "Vista"],
      status: "active",
    },
  ]);

  const [guests, setGuests] = useState<Guest[]>(() => [
    {
      id: "guest-1",
      firstName: "Carla",
      lastName: "Mendoza",
      documentType: "DNI",
      documentNumber: "74851236",
      email: "carla.mendoza@mail.com",
      phone: "987654321",
      nationality: "Peruana",
      city: "Lima",
      country: "Perú",
      preferences: {
        alergias: ["nueces"],
      },
      preferences: {
        almohada: "suave",
        minibar: true,
      },
    },
    {
      id: "guest-2",
      firstName: "Luis",
      lastName: "García",
      documentType: "Pasaporte",
      documentNumber: "XK392012",
      email: "luis.garcia@mail.com",
      phone: "991234567",
      nationality: "Chilena",
      city: "Santiago",
      country: "Chile",
      preferences: {
        piso_preferido: 2,
        desayuno: "vegetariano",
      },
    },
    {
      id: "guest-3",
      firstName: "Mariana",
      lastName: "Ríos",
      documentType: "DNI",
      documentNumber: "61234598",
      email: "mariana.rios@mail.com",
      phone: "912345678",
      nationality: "Peruana",
      city: "Cusco",
      country: "Perú",
    },
  ]);

  const [reservations, setReservations] = useState<Reservation[]>(() => [
    {
      id: "res-1",
      code: "RSV-240101",
      guestId: "guest-1",
      guestName: "Carla Mendoza",
      channel: "direct",
      additionalGuestIds: [],
      roomId: "room-102",
      roomNumber: "102",
      status: "checkin",
      checkIn: yesterdayStr,
      checkOut: todayStr,
      nights: calculateNights(yesterdayStr, todayStr),
      total: 580,
      adults: 2,
      children: 0,
      createdAt: yesterdayStr,
      actualCheckIn: yesterdayStr,
    },
    {
      id: "res-2",
      code: "RSV-240102",
      guestId: "guest-2",
      guestName: "Luis GarcÃ­a",
      channel: "ota",
      additionalGuestIds: [],
      roomId: "room-101",
      roomNumber: "101",
      status: "confirmed",
      checkIn: todayStr,
      checkOut: tomorrowStr,
      nights: calculateNights(todayStr, tomorrowStr),
      total: 320,
      adults: 1,
      children: 0,
      createdAt: todayStr,
    },
    {
      id: "res-3",
      code: "RSV-240103",
      guestId: "guest-3",
      guestName: "Mariana RÃ­os",
      channel: "corporate",
      additionalGuestIds: [],
      roomId: "room-201",
      roomNumber: "201",
      status: "pending",
      checkIn: tomorrowStr,
      checkOut: toDateString(addDays(today, 3)),
      nights: calculateNights(tomorrowStr, toDateString(addDays(today, 3))),
      total: 980,
      adults: 2,
      children: 1,
      createdAt: todayStr,
    },
  ]);

  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>(
    () => [
      {
        id: "corp-1",
        companyName: "Grupo Andino SAC",
        contactName: "Paula Rojas",
        contactEmail: "paula.rojas@andino.pe",
        contactPhone: "989000111",
        taxId: "20456789012",
        discount: 12,
        paymentTerms: 30,
        country: "Peru",
        status: "active",
      },
      {
        id: "corp-2",
        companyName: "Viajes Pacifico",
        contactName: "Mario Silva",
        contactEmail: "mario.silva@pacifico.com",
        contactPhone: "988111222",
        taxId: "20567890123",
        discount: 8,
        paymentTerms: 15,
        country: "Chile",
        status: "inactive",
      },
    ]
  );

  const [categories, setCategories] = useState<ProductCategory[]>(() => [
    {
      id: "cat-amenities",
      name: "Amenidades",
      description: "Productos de bienvenida",
      status: "active",
    },
    {
      id: "cat-minibar",
      name: "Minibar",
      description: "Snacks y bebidas",
      status: "active",
    },
    {
      id: "cat-cleaning",
      name: "Limpieza",
      description: "Insumos de housekeeping",
      status: "active",
    },
  ]);

  const [products, setProducts] = useState<Product[]>(() => [
    {
      id: "prod-1",
      name: "Agua 500ml",
      sku: "AG-500",
      categoryId: "cat-minibar",
      categoryName: "Minibar",
      price: 6,
      cost: 2,
      status: "active",
      trackStock: true,
    },
    {
      id: "prod-2",
      name: "Snacks mixtos",
      sku: "SN-150",
      categoryId: "cat-minibar",
      categoryName: "Minibar",
      price: 12,
      cost: 4,
      status: "active",
      trackStock: true,
    },
    {
      id: "prod-3",
      name: "Kit de baño",
      sku: "KB-001",
      categoryId: "cat-amenities",
      categoryName: "Amenidades",
      price: 18,
      cost: 8,
      status: "active",
      trackStock: true,
    },
    {
      id: "prod-4",
      name: "Jabón líquido 1L",
      sku: "JL-100",
      categoryId: "cat-cleaning",
      categoryName: "Limpieza",
      price: 25,
      cost: 14,
      status: "active",
      trackStock: true,
    },
  ]);

  const [locations, setLocations] = useState<InventoryLocation[]>(() => [
    {
      id: "loc-1",
      name: "Recepción",
      type: "reception" as LocationType,
      status: "active" as LocationStatus,
    },
    {
      id: "loc-2",
      name: "Almacén central",
      type: "storage" as LocationType,
      status: "active" as LocationStatus,
    },
    {
      id: "loc-3",
      name: "Minibar Hab 101",
      type: "minibar" as LocationType,
      roomId: "room-101",
      roomNumber: "101",
      status: "active" as LocationStatus,
    },
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => [
    {
      id: "inv-1",
      productId: "prod-1",
      productName: "Agua 500ml",
      sku: "AG-500",
      locationId: "loc-2",
      locationName: "Almacén central",
      stock: 120,
      minStock: 40,
    },
    {
      id: "inv-2",
      productId: "prod-2",
      productName: "Snacks mixtos",
      sku: "SN-150",
      locationId: "loc-2",
      locationName: "Almacén central",
      stock: 90,
      minStock: 30,
    },
    {
      id: "inv-3",
      productId: "prod-3",
      productName: "Kit de baño",
      sku: "KB-001",
      locationId: "loc-2",
      locationName: "Almacén central",
      stock: 60,
      minStock: 20,
    },
    {
      id: "inv-4",
      productId: "prod-1",
      productName: "Agua 500ml",
      sku: "AG-500",
      locationId: "loc-3",
      locationName: "Minibar Hab 101",
      stock: 6,
      minStock: 4,
    },
  ]);

  const [services, setServices] = useState<Service[]>(() => [
    {
      id: "srv-1",
      name: "Masaje relajante",
      category: "Spa",
      description: "Masaje de 60 minutos con aromaterapia.",
      price: 180,
      durationMinutes: 60,
      status: "active",
    },
    {
      id: "srv-2",
      name: "Lavanderia express",
      category: "Housekeeping",
      description: "Servicio de lavado y planchado en 24h.",
      price: 45,
      durationMinutes: 30,
      status: "active",
    },
    {
      id: "srv-3",
      name: "Traslado aeropuerto",
      category: "Transporte",
      description: "Servicio de traslado al aeropuerto.",
      price: 120,
      durationMinutes: 45,
      status: "inactive",
    },
  ]);

  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(() => [
    {
      id: "sb-1",
      serviceId: "srv-1",
      serviceName: "Masaje relajante",
      guestId: "guest-1",
      guestName: "Carla Mendoza",
      date: todayStr,
      time: "17:00",
      status: "scheduled",
      price: 180,
      notes: "Preferir musica suave",
    },
    {
      id: "sb-2",
      serviceId: "srv-2",
      serviceName: "Lavanderia express",
      guestId: "guest-2",
      guestName: "Luis Garcia",
      date: tomorrowStr,
      time: "10:30",
      status: "scheduled",
      price: 45,
    },
  ]);

  const [sales, setSales] = useState<Sale[]>(() => [
    {
      id: "sale-1",
      number: "POS-120401",
      date: todayStr,
      guestId: "guest-1",
      guestName: "Carla Mendoza",
      status: "paid",
      paymentMethod: "Tarjeta",
      items: [
        {
          id: "sale-item-1",
          productId: "prod-1",
          description: "Agua 500ml",
          quantity: 2,
          unitPrice: 6,
          total: 12,
        },
        {
          id: "sale-item-2",
          productId: "prod-2",
          description: "Snacks mixtos",
          quantity: 1,
          unitPrice: 12,
          total: 12,
        },
      ],
      subtotal: 24,
      tax: 4.32,
      total: 28.32,
      notes: "Consumo minibar",
    },
  ]);

  const [hotelSettings, setHotelSettings] = useState<HotelSettings>(() => ({
    name: "Hotel Aurora",
    address: "Av. Larco 123, Miraflores",
    phone: "+51 987 654 321",
    email: "contacto@hotelaurora.pe",
    taxId: "20123456789",
    currency: "PEN",
    timezone: "America/Lima",
    dateFormat: "DD/MM/YYYY",
    language: "es",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    cancellationPolicy:
      "Cancelacion gratuita hasta 24 horas antes del ingreso.",
    taxRate: 18,
    taxInclusive: true,
  }));

  // Load persisted hotel context (per device)
  useEffect(() => {
    const storedHotel = localStorage.getItem("hotel_current_id");
    const storedMode = localStorage.getItem("hotel_scope_mode");
    if (storedHotel && hotels.some((hotel) => hotel.id === storedHotel)) {
      setCurrentHotelId(storedHotel);
    }
    if (storedMode === "chain" || storedMode === "hotel") {
      setScopeMode(storedMode);
    }
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem("hotel_current_id", currentHotelId);
  }, [currentHotelId]);

  useEffect(() => {
    localStorage.setItem("hotel_scope_mode", scopeMode);
  }, [scopeMode]);

  const [planInfo] = useState<PlanInfo>(() => ({
    name: "Plan Pro",
    price: 129,
    renewalDate: toDateString(addDays(today, 30)),
    status: "active",
  }));

  const [planModules] = useState<PlanModule[]>(() => [
    {
      id: "mod-rooms",
      name: "Habitaciones",
      description: "Gestion de habitaciones y estados",
      status: "active",
    },
    {
      id: "mod-reservations",
      name: "Reservas",
      description: "Reservas y check-in/out",
      status: "active",
    },
    {
      id: "mod-inventory",
      name: "Inventario",
      description: "Stock y productos",
      status: "active",
    },
    {
      id: "mod-reports",
      name: "Reportes avanzados",
      description: "Reportes y exportaciones",
      status: "available",
      requiredPlan: "Enterprise",
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => [
    { id: "pm-1", name: "Efectivo", type: "cash", status: "active" },
    { id: "pm-2", name: "Tarjeta", type: "card", status: "active" },
    { id: "pm-3", name: "Transferencia", type: "transfer", status: "active" },
    { id: "pm-4", name: "Cortesia", type: "other", status: "inactive" },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>(() => [
    {
      id: "inv-1",
      number: "F-1001",
      date: todayStr,
      clientName: "Carla Mendoza",
      clientType: "guest",
      reservationCode: "RSV-240101",
      status: "paid",
      items: [
        {
          id: "item-1",
          description: "Hospedaje 2 noches",
          quantity: 2,
          unitPrice: 260,
          total: 520,
        },
        {
          id: "item-2",
          description: "Consumo minibar",
          quantity: 1,
          unitPrice: 60,
          total: 60,
        },
      ],
      subtotal: 580,
      tax: 104.4,
      total: 684.4,
      balance: 0,
      payments: [
        {
          id: "pay-1",
          amount: 684.4,
          methodId: "pm-2",
          methodName: "Tarjeta",
          date: todayStr,
        },
      ],
    },
    {
      id: "inv-2",
      number: "F-1002",
      date: todayStr,
      clientName: "Luis Garcia",
      clientType: "guest",
      reservationCode: "RSV-240102",
      status: "sent",
      items: [
        {
          id: "item-3",
          description: "Hospedaje 1 noche",
          quantity: 1,
          unitPrice: 320,
          total: 320,
        },
      ],
      subtotal: 320,
      tax: 57.6,
      total: 377.6,
      balance: 377.6,
      payments: [],
    },
  ]);

  const occupancyTrend = useMemo<OccupancyPoint[]>(() => {
    const anchor = new Date(`${todayStr}T00:00:00`);
    const base = [62, 68, 71, 75, 78, 74, 81];
    return base.map((value, index) => {
      const date = addDays(anchor, index - 6);
      return {
        label: formatWeekday(date),
        value,
      };
    });
  }, [todayStr]);

  const addRoom = (room: Room) => {
    setRooms((prev) => [...prev, room]);
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room))
    );
  };

  const addRoomType = (roomType: RoomType) => {
    setRoomTypes((prev) => [...prev, roomType]);
  };

  const updateRoomType = (roomTypeId: string, updates: Partial<RoomType>) => {
    setRoomTypes((prev) => {
      const current = prev.find((type) => type.id === roomTypeId);
      const next = prev.map((type) =>
        type.id === roomTypeId ? { ...type, ...updates } : type
      );
      if (updates.name && current?.name && updates.name !== current.name) {
        setRooms((roomsPrev) =>
          roomsPrev.map((room) =>
            room.type === current.name
              ? { ...room, type: updates.name as string }
              : room
          )
        );
      }
      return next;
    });
  };

  const removeRoomType = (roomTypeId: string) => {
    setRoomTypes((prev) => prev.filter((type) => type.id !== roomTypeId));
  };

  const addGuest = (guest: Guest) => {
    setGuests((prev) => [...prev, guest]);
  };

  const updateGuest = (guestId: string, updates: Partial<Guest>) => {
    setGuests((prev) =>
      prev.map((guest) =>
        guest.id === guestId ? { ...guest, ...updates } : guest
      )
    );
  };

  const addService = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, ...updates } : service
      )
    );
  };

  const removeService = (serviceId: string) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
    setServiceBookings((prev) =>
      prev.filter((booking) => booking.serviceId !== serviceId)
    );
  };

  const addServiceBooking = (booking: ServiceBooking) => {
    setServiceBookings((prev) => [...prev, booking]);
  };

  const updateServiceBooking = (
    bookingId: string,
    updates: Partial<ServiceBooking>
  ) => {
    setServiceBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    );
  };

  const addSale = (
    sale: Omit<Sale, "id" | "number" | "date" | "subtotal" | "tax" | "total">
  ) => {
    const subtotal = sale.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = hotelSettings.taxRate ?? 0;
    const tax = Number(((subtotal * taxRate) / 100).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const stamp = Date.now();
    const newSale: Sale = {
      ...sale,
      id: `sale-${stamp}`,
      number: `POS-${stamp.toString().slice(-6)}`,
      date: toDateString(new Date()),
      subtotal,
      tax,
      total,
    };

    setSales((prev) => [newSale, ...prev]);

    const quantities = sale.items.reduce<Record<string, number>>((acc, item) => {
      if (!item.productId) return acc;
      const product = products.find((entry) => entry.id === item.productId);
      if (!product || !product.trackStock) return acc;
      acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
      return acc;
    }, {});

    setInventory((prev) =>
      prev.map((item) => {
        const remaining = quantities[item.productId];
        if (!remaining) return item;
        const newStock = Math.max(0, item.stock - remaining);
        quantities[item.productId] = Math.max(0, remaining - item.stock);
        return { ...item, stock: newStock };
      })
    );
  };

  const addCorporateClient = (client: CorporateClient) => {
    setCorporateClients((prev) => [...prev, client]);
  };

  const updateCorporateClient = (
    clientId: string,
    updates: Partial<CorporateClient>
  ) => {
    setCorporateClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, ...updates } : client
      )
    );
  };

  const addCategory = (category: ProductCategory) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (
    categoryId: string,
    updates: Partial<ProductCategory>
  ) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId ? { ...category, ...updates } : category
      )
    );

    if (updates.name) {
      setProducts((prev) =>
        prev.map((product) =>
          product.categoryId === categoryId
            ? { ...product, categoryName: updates.name as string }
            : product
        )
      );
    }
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );

    if (updates.name || updates.sku) {
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                productName: updates.name ?? item.productName,
                sku: updates.sku ?? item.sku,
              }
            : item
        )
      );
    }
  };

  const addLocation = (location: InventoryLocation) => {
    setLocations((prev) => [...prev, location]);
  };

  const updateLocation = (
    locationId: string,
    updates: Partial<InventoryLocation>
  ) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === locationId ? { ...location, ...updates } : location
      )
    );

    if (updates.name) {
      setInventory((prev) =>
        prev.map((item) =>
          item.locationId === locationId
            ? { ...item, locationName: updates.name as string }
            : item
        )
      );
    }
  };

  const updateInventoryItem = (
    itemId: string,
    updates: Partial<InventoryItem>
  ) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const updateHotelSettings = (updates: Partial<HotelSettings>) => {
    setHotelSettings((prev) => ({ ...prev, ...updates }));
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, method]);
  };

  const updatePaymentMethod = (
    methodId: string,
    updates: Partial<PaymentMethod>
  ) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === methodId ? { ...method, ...updates } : method
      )
    );
  };

  const addInvoicePayment = (
    invoiceId: string,
    payment: Omit<InvoicePayment, "id">
  ) => {
    setInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id !== invoiceId) return invoice;
        const newPayment: InvoicePayment = {
          id: `pay-${Date.now()}`,
          ...payment,
        };
        const payments = [...invoice.payments, newPayment];
        const paid = payments.reduce((sum, item) => sum + item.amount, 0);
        const balance = Math.max(0, Number((invoice.total - paid).toFixed(2)));
        const status =
          balance === 0 ? "paid" : invoice.status === "draft" ? "sent" : invoice.status;

        return {
          ...invoice,
          payments,
          balance,
          status,
        };
      })
    );
  };

  const addReservation = (
    reservation: Omit<Reservation, "id" | "code" | "createdAt">
  ) => {
    const nights = calculateNights(reservation.checkIn, reservation.checkOut);
    const total = reservation.total || nights * 150;
    setReservations((prev) => [
      ...prev,
      {
        ...reservation,
        id: `res-${Date.now()}`,
        code: generateCode(),
        nights,
        total,
        createdAt: todayStr,
      },
    ]);
  };

  const updateReservation = (
    reservationId: string,
    updates: Partial<Reservation>
  ) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, ...updates }
          : reservation
      )
    );
  };

  const completeCheckIn = (reservationId: string) => {
    setReservations((prev) => {
      const target = prev.find((reservation) => reservation.id === reservationId);
      if (!target) return prev;

      setRooms((roomsPrev) =>
        roomsPrev.map((room) =>
          room.id === target.roomId
            ? { ...room, status: "occupied" as RoomStatus }
            : room
        )
      );

      return prev.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: "checkin" as ReservationStatus,
              actualCheckIn: toDateString(new Date()),
            }
          : reservation
      );
    });
  };

  const completeCheckOut = (reservationId: string) => {
    setReservations((prev) => {
      const target = prev.find((reservation) => reservation.id === reservationId);
      if (!target) return prev;

      setRooms((roomsPrev) =>
        roomsPrev.map((room) =>
          room.id === target.roomId
            ? { ...room, status: "cleaning" as RoomStatus }
            : room
        )
      );

      return prev.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: "checkout" as ReservationStatus,
              actualCheckOut: toDateString(new Date()),
            }
          : reservation
      );
    });
  };

  const value = {
    hotels,
    currentHotelId,
    setCurrentHotelId,
    scopeMode,
    setScopeMode,
    rooms,
    roomTypes,
    guests,
    reservations,
    occupancyTrend,
    corporateClients,
    services,
    serviceBookings,
    sales,
    categories,
    products,
    locations,
    inventory,
    hotelSettings,
    planInfo,
    planModules,
    paymentMethods,
    invoices,
    addRoom,
    updateRoom,
    addRoomType,
    updateRoomType,
    removeRoomType,
    addGuest,
    updateGuest,
    addService,
    updateService,
    removeService,
    addServiceBooking,
    updateServiceBooking,
    addSale,
    addCorporateClient,
    updateCorporateClient,
    addCategory,
    updateCategory,
    addProduct,
    updateProduct,
    addLocation,
    updateLocation,
    updateInventoryItem,
    updateHotelSettings,
    addPaymentMethod,
    updatePaymentMethod,
    addInvoicePayment,
    addReservation,
    updateReservation,
    completeCheckIn,
    completeCheckOut,
  };

  return (
    <HotelDataContext.Provider value={value}>
      {children}
    </HotelDataContext.Provider>
  );
};

export const useHotelData = () => {
  const context = useContext(HotelDataContext);
  if (!context) {
    throw new Error("useHotelData must be used within a HotelDataProvider");
  }
  return context;
};


