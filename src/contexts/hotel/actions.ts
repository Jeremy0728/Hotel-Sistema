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
import { habitacionesApi } from "@/apis/habitaciones.api";
import { tiposHabitacionApi } from "@/apis/tipos-habitacion.api";
import { huespedesApi } from "@/apis/huespedes.api";
import { reservasApi } from "@/apis/reservas.api";
import { checkinApi } from "@/apis/checkin.api";
import { checkoutApi } from "@/apis/checkout.api";
import { clientesCorporativosApi } from "@/apis/clientes-corporativos.api";
import { serviciosAdicionalesApi } from "@/apis/servicios-adicionales.api";
import { reservasServiciosApi } from "@/apis/reservas-servicios.api";
import { productosApi } from "@/apis/productos.api";
import { categoriasProductosApi } from "@/apis/categorias-productos.api";
import { inventarioApi } from "@/apis/inventario.api";
import { ubicacionesInventarioApi } from "@/apis/ubicaciones-inventario.api";
import { ventasApi } from "@/apis/ventas.api";
import { facturasApi } from "@/apis/facturas.api";
import { pagosApi } from "@/apis/pagos.api";

export function createRoomActions(
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) {
  const addRoom = async (room: Room) => {
    try {
      const response = await habitacionesApi.crear({
        number: room.number,
        room_type_id: parseInt(room.id),
        floor: room.floor,
        status: room.status === 'out_of_service' ? 'maintenance' : room.status,
        notes: room.notes,
        is_active: true,
      });
      
      if (response.ok) {
        setRooms((prev) => [...prev, room]);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  const updateRoom = async (roomId: string, updates: Partial<Room>) => {
    console.log("🚀 ~ updateRoom ~ roomId:", roomId)
    try {
      const response = await habitacionesApi.actualizar(parseInt(roomId), {
        number: updates.number,
        floor: updates.floor,
        status: updates.status === 'out_of_service' ? 'maintenance' : updates.status as any,
        notes: updates.notes,
      });
      console.log("🚀 ~ updateRoom ~ response:", response)
      
      if (response.ok) {
        setRooms((prev) => {
          console.log("🚀 ~ Rooms before update:", prev.map(r => ({ id: r.id, status: r.status })));
          console.log("🚀 ~ Looking for roomId:", roomId, "type:", typeof roomId);
          const updated = prev.map((room) => {
            const match = room.id === roomId || room.id === String(roomId) || String(room.id) === String(roomId);
            if (match) {
              console.log("🚀 ~ Found match! Updating room:", room.id, "with:", updates);
            }
            return match ? { ...room, ...updates } : room;
          });
          console.log("🚀 ~ Rooms after update:", updated.map(r => ({ id: r.id, status: r.status })));
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  return { addRoom, updateRoom };
}

export function createRoomTypeActions(
  setRoomTypes: React.Dispatch<React.SetStateAction<RoomType[]>>,
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) {
  const addRoomType = async (roomType: RoomType) => {
    try {
      const response = await tiposHabitacionApi.crear({
        name: roomType.name,
        description: roomType.description,
        base_price: String(roomType.price || 0),
        max_occupancy: roomType.capacity || 2,
        amenities: roomType.amenities ? JSON.parse(JSON.stringify(roomType.amenities)) : {},
        is_active: true,
      });
      
      if (response.ok) {
        setRoomTypes((prev) => [...prev, roomType]);
      }
    } catch (error) {
      console.error('Error creating room type:', error);
      throw error;
    }
  };

  const updateRoomType = async (roomTypeId: string, updates: Partial<RoomType>) => {
    try {
      const response = await tiposHabitacionApi.actualizar(parseInt(roomTypeId), {
        name: updates.name,
        description: updates.description,
        base_price: updates.price ? String(updates.price) : undefined,
        max_occupancy: updates.capacity,
        amenities: updates.amenities ? JSON.parse(JSON.stringify(updates.amenities)) : undefined,
      });
      
      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Error updating room type:', error);
      throw error;
    }
  };

  const removeRoomType = async (roomTypeId: string) => {
    try {
      const response = await tiposHabitacionApi.eliminar(parseInt(roomTypeId));
      
      if (response.ok) {
        setRoomTypes((prev) => prev.filter((type) => type.id !== roomTypeId));
      }
    } catch (error) {
      console.error('Error deleting room type:', error);
      throw error;
    }
  };

  return { addRoomType, updateRoomType, removeRoomType };
}

export function createGuestActions(
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>
) {
  const addGuest = async (guest: Guest) => {
    try {
      const response = await huespedesApi.crear({
        first_name: guest.firstName,
        last_name: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        document_type: (guest.documentType?.toLowerCase() || 'dni') as 'dni' | 'passport' | 'ce',
        document_number: guest.documentNumber,
        date_of_birth: guest.birthDate,
        nationality: guest.nationality,
        address: guest.address,
        is_active: true,
      });
      
      if (response.ok) {
        setGuests((prev) => [...prev, guest]);
      }
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  };

  const updateGuest = async (guestId: string, updates: Partial<Guest>) => {
    try {
      const response = await huespedesApi.actualizar(parseInt(guestId), {
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        phone: updates.phone,
        document_type: updates.documentType?.toLowerCase() as 'dni' | 'passport' | 'ce' | undefined,
        document_number: updates.documentNumber,
        date_of_birth: updates.birthDate,
        nationality: updates.nationality,
        address: updates.address,
      });
      
      if (response.ok) {
        setGuests((prev) =>
          prev.map((guest) =>
            guest.id === guestId ? { ...guest, ...updates } : guest
          )
        );
      }
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
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
  const addCorporateClient = async (client: CorporateClient) => {
    try {
      const response = await clientesCorporativosApi.crear({
        company_name: client.companyName,
        contact_name: client.contactName,
        email: client.contactEmail,
        phone: client.contactPhone,
        ruc: client.taxId,
        address: client.address,
        payment_terms: client.paymentTerms,
        is_active: true,
      });
      
      if (response.ok) {
        setCorporateClients((prev) => [...prev, client]);
      }
    } catch (error) {
      console.error('Error creating corporate client:', error);
      throw error;
    }
  };

  const updateCorporateClient = async (
    clientId: string,
    updates: Partial<CorporateClient>
  ) => {
    try {
      const response = await clientesCorporativosApi.actualizar(parseInt(clientId), {
        company_name: updates.companyName,
        contact_name: updates.contactName,
        email: updates.contactEmail,
        phone: updates.contactPhone,
        ruc: updates.taxId,
        address: updates.address,
        payment_terms: updates.paymentTerms,
      });
      
      if (response.ok) {
        setCorporateClients((prev) =>
          prev.map((client) =>
            client.id === clientId ? { ...client, ...updates } : client
          )
        );
      }
    } catch (error) {
      console.error('Error updating corporate client:', error);
      throw error;
    }
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
  const addInvoicePayment = async (
    invoiceId: string,
    payment: Omit<InvoicePayment, "id">
  ) => {
    try {
      const response = await pagosApi.registrar({
        invoice_id: parseInt(invoiceId),
        amount: String(payment.amount),
        payment_method_id: parseInt(payment.methodId),
        payment_date: payment.date,
        reference_number: payment.reference,
        notes: payment.notes,
      });
      
      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Error adding invoice payment:', error);
      throw error;
    }
  };

  return { addInvoicePayment };
}

export function createReservationActions(
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>,
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
  todayStr: string
) {
  const addReservation = async (
    reservation: Omit<Reservation, "id" | "code" | "createdAt">
  ) => {
    try {
      const nights = calculateNights(reservation.checkIn, reservation.checkOut);
      const total = reservation.total || nights * 150;
      
      const response = await reservasApi.crear({
        guest_id: parseInt(reservation.guestId),
        room_id: parseInt(reservation.roomId),
        check_in_date: reservation.checkIn,
        check_out_date: reservation.checkOut,
        num_guests: reservation.adults + reservation.children,
        adults: reservation.adults,
        children: reservation.children,
        total_price: String(total),
        status: reservation.status === 'checkin' ? 'checked_in' : reservation.status === 'checkout' ? 'checked_out' : reservation.status,
        special_requests: reservation.notes,
        corporate_client_id: undefined,
        guest: undefined as any,
        confirmation_code: generateCode(),
      });
      
      if (response.ok) {
        setReservations((prev) => [
          ...prev,
          {
            ...reservation,
            id: `res-${Date.now()}`,
            code: generateCode(),
            confirmation_code: generateCode(),
            nights,
            total,
            createdAt: todayStr,
          },
        ]);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  };

  const updateReservation = async (
    reservationId: string,
    updates: Partial<Reservation>
  ) => {
    try {
      const response = await reservasApi.actualizar(parseInt(reservationId), {
        guest_id: updates.guestId ? parseInt(updates.guestId) : undefined,
        room_id: updates.roomId ? parseInt(updates.roomId) : undefined,
        check_in_date: updates.checkIn,
        check_out_date: updates.checkOut,
        num_guests: updates.adults && updates.children ? updates.adults + updates.children : undefined,
        adults: updates.adults,
        children: updates.children,
        total_price: updates.total ? String(updates.total) : undefined,
        status: updates.status === 'checkin' ? 'checked_in' : updates.status === 'checkout' ? 'checked_out' : updates.status as any,
        special_requests: updates.notes,
      });
      
      if (response.ok) {
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.id === reservationId
              ? { ...reservation, ...updates }
              : reservation
          )
        );
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  };

  const completeCheckIn = async (reservationId: string) => {
    try {
      const response = await checkinApi.realizar({
        reservation_id: parseInt(reservationId),
        check_in_date: toDateString(new Date()),
        check_in_time: new Date().toTimeString().slice(0, 5),
        actual_guests: 1,
        checked_in_by: 1,
      });
      
      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Error completing check-in:', error);
      throw error;
    }
  };

  const completeCheckOut = async (reservationId: string) => {
    try {
      const response = await checkoutApi.realizar({
        reservation_id: parseInt(reservationId),
        check_out_date: toDateString(new Date()),
        check_out_time: new Date().toTimeString().slice(0, 5),
        checked_out_by: 1,
      });
      
      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Error completing check-out:', error);
      throw error;
    }
  };

  return { addReservation, updateReservation, completeCheckIn, completeCheckOut };
}
