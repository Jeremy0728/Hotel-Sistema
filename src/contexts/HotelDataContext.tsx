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

import { HotelDataContextValue } from "./hotel/types";
import { addDays, toDateString, formatWeekday, createInitialRooms } from "./hotel/utils";
import { loadAllData } from "./hotel/dataLoaders";
import {
  createRoomActions,
  createRoomTypeActions,
  createGuestActions,
  createServiceActions,
  createServiceBookingActions,
  createSaleActions,
  createCorporateClientActions,
  createCategoryActions,
  createProductActions,
  createLocationActions,
  createInventoryActions,
  createSettingsActions,
  createPaymentMethodActions,
  createInvoiceActions,
  createReservationActions,
} from "./hotel/actions";

const HotelDataContext = createContext<HotelDataContextValue | undefined>(
  undefined
);

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

  // Estados principales
  const [rooms, setRooms] = useState<Room[]>(() => createInitialRooms());
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Estados de carga
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(false);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [isLoadingCorporateClients, setIsLoadingCorporateClients] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingServiceBookings, setIsLoadingServiceBookings] = useState(false);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

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

  // Load persisted hotel context
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

  // Cargar datos de las APIs
  useEffect(() => {
    loadAllData({
      setRoomTypes,
      setIsLoadingRoomTypes,
      setGuests,
      setIsLoadingGuests,
      setReservations,
      setIsLoadingReservations,
      setCorporateClients,
      setIsLoadingCorporateClients,
      setCategories,
      setIsLoadingCategories,
      setProducts,
      setIsLoadingProducts,
      setLocations,
      setIsLoadingLocations,
      setInventory,
      setIsLoadingInventory,
      setServices,
      setIsLoadingServices,
      setServiceBookings,
      setIsLoadingServiceBookings,
      setSales,
      setIsLoadingSales,
    });
  }, []);

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

  // Crear acciones usando las funciones helper
  const { addRoom, updateRoom } = createRoomActions(setRooms);
  const { addRoomType, updateRoomType, removeRoomType } = createRoomTypeActions(setRoomTypes, setRooms);
  const { addGuest, updateGuest } = createGuestActions(setGuests);
  const { addService, updateService, removeService } = createServiceActions(setServices, setServiceBookings);
  const { addServiceBooking, updateServiceBooking } = createServiceBookingActions(setServiceBookings);
  const { addSale } = createSaleActions(setSales, setInventory, hotelSettings, products);
  const { addCorporateClient, updateCorporateClient } = createCorporateClientActions(setCorporateClients);
  const { addCategory, updateCategory } = createCategoryActions(setCategories, setProducts);
  const { addProduct, updateProduct } = createProductActions(setProducts, setInventory);
  const { addLocation, updateLocation } = createLocationActions(setLocations, setInventory);
  const { updateInventoryItem } = createInventoryActions(setInventory);
  const { updateHotelSettings } = createSettingsActions(setHotelSettings);
  const { addPaymentMethod, updatePaymentMethod } = createPaymentMethodActions(setPaymentMethods);
  const { addInvoicePayment } = createInvoiceActions(setInvoices);
  const { addReservation, updateReservation, completeCheckIn, completeCheckOut } = createReservationActions(
    setReservations,
    setRooms,
    todayStr
  );

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
