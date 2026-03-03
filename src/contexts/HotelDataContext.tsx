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

// Importar los nuevos hooks
import { useRooms } from "@/hooks/useRooms";
import { useReservations } from "@/hooks/useReservations";
import { useInvoices } from "@/hooks/useInvoices";
import { useHotelSettings } from "@/hooks/useHotelSettings";

import { HotelDataContextValue } from "./hotel/types";
import { addDays, toDateString, formatWeekday } from "./hotel/utils";
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
  
  // Usar los nuevos hooks para obtener datos reales
  const {
    rooms: apiRooms,
    updateRoomStatus,
  } = useRooms({ limit: 100 });

  const { reservations: apiReservations, refreshReservations } =
    useReservations({ limit: 100 });

  const { invoices: apiInvoices } = useInvoices({ limit: 100 });

  const { settings: hotelSettings, updateSettings } = useHotelSettings();

  // Transformar datos de API a formato local
  const rooms: Room[] = useMemo(
    () =>
      apiRooms.map((room) => ({
        id: String(room.id),
        number: room.number,
        type: room.roomType?.name || "Standard",
        floor: room.floor,
        status: room.status,
        notes: room.notes,
      })),
    [apiRooms]
  );

  const reservations: Reservation[] = useMemo(
    () =>
      apiReservations.map((res) => ({
        id: String(res.id),
        code: res.confirmation_code,
        confirmation_code: res.confirmation_code,
        guestId: String(res.guest_id),
        guestName: res.huesped
          ? `${res.huesped.nombres} ${res.huesped.apellido_paterno}`
          : "Huésped",
        roomId: String(res.room_id),
        roomNumber: res.habitacion?.number || "",
        status:
          res.status === "checked_in"
            ? ("checkin" as const)
            : res.status === "checked_out"
            ? ("checkout" as const)
            : (res.status as "pending" | "confirmed" | "cancelled"),
        checkIn: res.check_in_date,
        checkOut: res.check_out_date,
        nights: Math.ceil(
          (new Date(res.check_out_date).getTime() -
            new Date(res.check_in_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        total: parseFloat(res.total_price),
        adults: res.adults,
        children: res.children,
        notes: res.special_requests,
        createdAt: res.check_in_date,
      })),
    [apiReservations]
  );

  const invoices: Invoice[] = useMemo(() => apiInvoices, [apiInvoices]);

  const today = useMemo(() => new Date(), []);
  const todayStr = toDateString(today);

  // Mock setters for data that comes from external hooks (useRooms, useReservations, useHotelSettings)
  const setRooms = () => {
    console.warn('setRooms called but rooms come from useRooms hook - changes will not persist');
  };
  
  const setReservations = () => {
    console.warn('setReservations called but reservations come from useReservations hook - changes will not persist');
  };
  
  const setHotelSettings = () => {
    console.warn('setHotelSettings called but hotelSettings come from useHotelSettings hook - use updateSettings instead');
  };

  // Estados locales para entidades que aún no tienen API
  const useRoomTypes = () => {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(false);

    useEffect(() => {
      // Load room types from API or local storage
    }, []);

    return { roomTypes, setRoomTypes, isLoadingRoomTypes };
  };

  const useGuests = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isLoadingGuests, setIsLoadingGuests] = useState(false);

    useEffect(() => {
      // Load guests from API or local storage
    }, []);

    return { guests, setGuests, isLoadingGuests };
  };

  const useCorporateClients = () => {
    const [corporateClients, setCorporateClients] = useState<CorporateClient[]>([]);
    const [isLoadingCorporateClients, setIsLoadingCorporateClients] = useState(false);

    useEffect(() => {
      // Load corporate clients from API or local storage
    }, []);

    return { corporateClients, setCorporateClients, isLoadingCorporateClients };
  };

  const useCategories = () => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    useEffect(() => {
      // Load categories from API or local storage
    }, []);

    return { categories, setCategories, isLoadingCategories };
  };

  const useSales = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoadingSales, setIsLoadingSales] = useState(false);

    useEffect(() => {
      // Load sales from API or local storage
    }, []);

    return { sales, setSales, isLoadingSales };
  };

  const usePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);

    useEffect(() => {
      // Load payment methods from API or local storage
    }, []);

    return { paymentMethods, setPaymentMethods, isLoadingPaymentMethods };
  };

  const { roomTypes, setRoomTypes, isLoadingRoomTypes } = useRoomTypes();
  const { guests, setGuests, isLoadingGuests } = useGuests();
  const { corporateClients, setCorporateClients, isLoadingCorporateClients } = useCorporateClients();
  const { categories, setCategories, isLoadingCategories } = useCategories();
  const { sales, setSales, isLoadingSales } = useSales();
  const { paymentMethods, setPaymentMethods, isLoadingPaymentMethods } = usePaymentMethods();
  
  // Service bookings state
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);

  // Estados locales adicionales que se cargan desde loadAllData
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

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

  // Cargar datos de las APIs - DISABLED: datos ahora vienen de hooks
  // useEffect(() => {
  //   loadAllData({
  //     setRoomTypes,
  //     setIsLoadingRoomTypes,
  //     setGuests,
  //     setIsLoadingGuests,
  //     setReservations,
  //     setIsLoadingReservations,
  //     setCorporateClients,
  //     setIsLoadingCorporateClients,
  //     setCategories,
  //     setIsLoadingCategories,
  //     setProducts,
  //     setIsLoadingProducts,
  //     setLocations,
  //     setIsLoadingLocations,
  //     setInventory,
  //     setIsLoadingInventory,
  //     setServices,
  //     setIsLoadingServices,
  //     setServiceBookings,
  //     setIsLoadingServiceBookings,
  //     setSales,
  //     setIsLoadingSales,
  //   });
  // }, []);

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
  // Invoice actions removed - invoices come from useInvoices hook
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
