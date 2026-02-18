import type {
  CorporateClient,
  Guest,
  HotelSettings,
  InventoryItem,
  InventoryLocation,
  Invoice,
  InvoicePayment,
  PaymentMethod,
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
import { calculateNights, generateCode, toDateString } from "./utils";

export function createRoomActions(
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) {
  const addRoom = (room: Room) => {
    setRooms((prev) => [...prev, room]);
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room))
    );
  };

  return { addRoom, updateRoom };
}

export function createRoomTypeActions(
  setRoomTypes: React.Dispatch<React.SetStateAction<RoomType[]>>,
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) {
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

  return { addRoomType, updateRoomType, removeRoomType };
}

export function createGuestActions(
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>
) {
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

  return { addGuest, updateGuest };
}

export function createServiceActions(
  setServices: React.Dispatch<React.SetStateAction<Service[]>>,
  setServiceBookings: React.Dispatch<React.SetStateAction<ServiceBooking[]>>
) {
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

  return { addService, updateService, removeService };
}

export function createServiceBookingActions(
  setServiceBookings: React.Dispatch<React.SetStateAction<ServiceBooking[]>>
) {
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

  return { addServiceBooking, updateServiceBooking };
}

export function createSaleActions(
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>,
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  hotelSettings: HotelSettings,
  products: Product[]
) {
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

  return { addSale };
}

export function createCorporateClientActions(
  setCorporateClients: React.Dispatch<React.SetStateAction<CorporateClient[]>>
) {
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

  return { addCorporateClient, updateCorporateClient };
}

export function createCategoryActions(
  setCategories: React.Dispatch<React.SetStateAction<ProductCategory[]>>,
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) {
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

  return { addCategory, updateCategory };
}

export function createProductActions(
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
) {
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

  return { addProduct, updateProduct };
}

export function createLocationActions(
  setLocations: React.Dispatch<React.SetStateAction<InventoryLocation[]>>,
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
) {
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

  return { addLocation, updateLocation };
}

export function createInventoryActions(
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
) {
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

  return { updateInventoryItem };
}

export function createSettingsActions(
  setHotelSettings: React.Dispatch<React.SetStateAction<HotelSettings>>
) {
  const updateHotelSettings = (updates: Partial<HotelSettings>) => {
    setHotelSettings((prev) => ({ ...prev, ...updates }));
  };

  return { updateHotelSettings };
}

export function createPaymentMethodActions(
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>
) {
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

  return { addPaymentMethod, updatePaymentMethod };
}

export function createInvoiceActions(
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>
) {
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

  return { addInvoicePayment };
}

export function createReservationActions(
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>,
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  todayStr: string
) {
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

  return { addReservation, updateReservation, completeCheckIn, completeCheckOut };
}
