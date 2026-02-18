import type {
  CorporateClient,
  Guest,
  InventoryItem,
  InventoryLocation,
  LocationStatus,
  LocationType,
  Product,
  ProductCategory,
  Reservation,
  ReservationStatus,
  RoomType,
  Sale,
  Service,
  ServiceBooking,
} from "@/types/hotel";

import { tiposHabitacionApi } from "@/apis/tipos-habitacion.api";
import { huespedesApi } from "@/apis/huespedes.api";
import { reservasApi } from "@/apis/reservas.api";
import { clientesCorporativosApi } from "@/apis/clientes-corporativos.api";
import { categoriasProductosApi } from "@/apis/categorias-productos.api";
import { productosApi } from "@/apis/productos.api";
import { ubicacionesInventarioApi } from "@/apis/ubicaciones-inventario.api";
import { inventarioApi } from "@/apis/inventario.api";
import { serviciosAdicionalesApi } from "@/apis/servicios-adicionales.api";
import { reservasServiciosApi } from "@/apis/reservas-servicios.api";
import { ventasApi } from "@/apis/ventas.api";

import { calculateNights } from "./utils";

export async function loadRoomTypes(
  setRoomTypes: (types: RoomType[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await tiposHabitacionApi.traerTodos(1, 100);
    if (response.ok && response.tipos) {
      const mapped: RoomType[] = response.tipos.map(tipo => ({
        id: String(tipo.id),
        name: tipo.name,
        description: tipo.description || '',
        maxGuests: tipo.max_occupancy,
        rateHour: 0,
        rateDay: parseFloat(tipo.base_price),
        rateWeek: 0,
        rateMonth: 0,
        amenities: tipo.amenities ? Object.keys(tipo.amenities) : [],
        status: tipo.is_active ? 'active' : 'inactive'
      }));
      setRoomTypes(mapped);
    }
  } catch (error) {
    console.error('Error loading room types:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadGuests(
  setGuests: (guests: Guest[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await huespedesApi.traerTodos(1, 100);
    if (response.ok && response.huespedes) {
      const mapped: Guest[] = response.huespedes.map(huesped => ({
        id: String(huesped.id),
        firstName: huesped.first_name,
        lastName: huesped.last_name,
        documentType: huesped.document_type.toUpperCase(),
        documentNumber: huesped.document_number,
        email: huesped.email,
        phone: huesped.phone,
        nationality: huesped.nationality || '',
        city: huesped.city || '',
        country: huesped.country || '',
        preferences: huesped.preferences || {}
      }));
      setGuests(mapped);
    }
  } catch (error) {
    console.error('Error loading guests:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadReservations(
  setReservations: (reservations: Reservation[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await reservasApi.traerTodos(1, 100);
    if (response.ok && response.reservas) {
      const mapped: Reservation[] = response.reservas.map(reserva => ({
        id: String(reserva.id),
        code: `RSV-${reserva.id}`,
        guestId: String(reserva.guest_id),
        guestName: '',
        channel: 'direct',
        additionalGuestIds: [],
        roomId: String(reserva.room_id),
        roomNumber: '',
        status: reserva.status === 'checked_in' ? 'checkin' : reserva.status === 'checked_out' ? 'checkout' : reserva.status as ReservationStatus,
        checkIn: reserva.check_in_date,
        checkOut: reserva.check_out_date,
        nights: calculateNights(reserva.check_in_date, reserva.check_out_date),
        total: parseFloat(reserva.total_price),
        adults: reserva.num_guests,
        children: 0,
        createdAt: reserva.created_at || reserva.check_in_date
      }));
      setReservations(mapped);
    }
  } catch (error) {
    console.error('Error loading reservations:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadCorporateClients(
  setCorporateClients: (clients: CorporateClient[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await clientesCorporativosApi.traerTodos(1, 100);
    if (response.ok && response.clientes) {
      const mapped: CorporateClient[] = response.clientes.map(cliente => ({
        id: String(cliente.id),
        companyName: cliente.company_name,
        contactName: cliente.contact_name,
        contactEmail: cliente.email,
        contactPhone: cliente.phone,
        taxId: cliente.ruc || '',
        discount: cliente.discount_percentage || 0,
        paymentTerms: parseInt(cliente.payment_terms || '0'),
        country: cliente.country || '',
        status: cliente.is_active ? 'active' : 'inactive'
      }));
      setCorporateClients(mapped);
    }
  } catch (error) {
    console.error('Error loading corporate clients:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadCategories(
  setCategories: (categories: ProductCategory[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await categoriasProductosApi.traerTodos(1, 100);
    if (response.ok && response.categorias) {
      const mapped: ProductCategory[] = response.categorias.map(categoria => ({
        id: String(categoria.id),
        name: categoria.name,
        description: categoria.description,
        status: categoria.is_active ? 'active' : 'inactive'
      }));
      setCategories(mapped);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadProducts(
  setProducts: (products: Product[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await productosApi.traerTodos(1, 100);
    if (response.ok && response.productos) {
      const mapped: Product[] = response.productos.map(producto => ({
        id: String(producto.id),
        name: producto.name,
        sku: producto.sku || '',
        categoryId: String(producto.category_id),
        categoryName: '',
        price: parseFloat(producto.price),
        cost: producto.cost ? parseFloat(producto.cost) : 0,
        status: producto.is_active ? 'active' : 'inactive',
        trackStock: true
      }));
      setProducts(mapped);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadLocations(
  setLocations: (locations: InventoryLocation[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await ubicacionesInventarioApi.traerTodos(1, 100);
    if (response.ok && response.ubicaciones) {
      const mapped: InventoryLocation[] = response.ubicaciones.map(ubicacion => ({
        id: String(ubicacion.id),
        name: ubicacion.name,
        type: ubicacion.location_type === 'almacen' ? 'storage' : ubicacion.location_type === 'minibar' ? 'minibar' : 'reception' as LocationType,
        status: ubicacion.is_active ? 'active' : 'inactive' as LocationStatus
      }));
      setLocations(mapped);
    }
  } catch (error) {
    console.error('Error loading locations:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadInventory(
  setInventory: (inventory: InventoryItem[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await inventarioApi.traerTodos(1, 100);
    if (response.ok && response.inventario) {
      const mapped: InventoryItem[] = response.inventario.map(item => ({
        id: String(item.id),
        productId: String(item.product_id),
        productName: '',
        sku: '',
        locationId: String(item.location_id),
        locationName: '',
        stock: item.quantity,
        minStock: item.min_stock || 0
      }));
      setInventory(mapped);
    }
  } catch (error) {
    console.error('Error loading inventory:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadServices(
  setServices: (services: Service[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await serviciosAdicionalesApi.traerTodos(1, 100);
    if (response.ok && response.servicios) {
      const mapped: Service[] = response.servicios.map(servicio => ({
        id: String(servicio.id),
        name: servicio.name,
        category: servicio.category,
        description: servicio.description,
        price: parseFloat(servicio.price),
        durationMinutes: servicio.duration_minutes || 0,
        status: servicio.is_active ? 'active' : 'inactive'
      }));
      setServices(mapped);
    }
  } catch (error) {
    console.error('Error loading services:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadServiceBookings(
  setServiceBookings: (bookings: ServiceBooking[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await reservasServiciosApi.traerTodos(1, 100);
    if (response.ok && response.reservas) {
      const mapped: ServiceBooking[] = response.reservas.map(reserva => ({
        id: String(reserva.id),
        serviceId: String(reserva.service_id),
        serviceName: '',
        guestId: '',
        guestName: '',
        date: reserva.scheduled_date,
        time: reserva.scheduled_time || '',
        status: reserva.status === 'confirmed' ? 'scheduled' : reserva.status === 'completed' ? 'completed' : 'scheduled',
        price: parseFloat(reserva.total_price),
        notes: reserva.notes
      }));
      setServiceBookings(mapped);
    }
  } catch (error) {
    console.error('Error loading service bookings:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadSales(
  setSales: (sales: Sale[]) => void,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);
    const response = await ventasApi.traerTodos(1, 100);
    if (response.ok && response.ventas) {
      const mapped: Sale[] = response.ventas.map(venta => ({
        id: String(venta.id),
        number: venta.sale_number,
        date: venta.sale_date,
        guestId: venta.customer_id ? String(venta.customer_id) : '',
        guestName: '',
        status: venta.status === 'completed' ? 'paid' : venta.status === 'pending' ? 'pending' : 'cancelled',
        paymentMethod: '',
        items: [],
        subtotal: parseFloat(venta.subtotal),
        tax: parseFloat(venta.tax),
        total: parseFloat(venta.total),
        notes: venta.notes
      }));
      setSales(mapped);
    }
  } catch (error) {
    console.error('Error loading sales:', error);
  } finally {
    setLoading(false);
  }
}

export async function loadAllData(setters: {
  setRoomTypes: (types: RoomType[]) => void;
  setIsLoadingRoomTypes: (loading: boolean) => void;
  setGuests: (guests: Guest[]) => void;
  setIsLoadingGuests: (loading: boolean) => void;
  setReservations: (reservations: Reservation[]) => void;
  setIsLoadingReservations: (loading: boolean) => void;
  setCorporateClients: (clients: CorporateClient[]) => void;
  setIsLoadingCorporateClients: (loading: boolean) => void;
  setCategories: (categories: ProductCategory[]) => void;
  setIsLoadingCategories: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  setIsLoadingProducts: (loading: boolean) => void;
  setLocations: (locations: InventoryLocation[]) => void;
  setIsLoadingLocations: (loading: boolean) => void;
  setInventory: (inventory: InventoryItem[]) => void;
  setIsLoadingInventory: (loading: boolean) => void;
  setServices: (services: Service[]) => void;
  setIsLoadingServices: (loading: boolean) => void;
  setServiceBookings: (bookings: ServiceBooking[]) => void;
  setIsLoadingServiceBookings: (loading: boolean) => void;
  setSales: (sales: Sale[]) => void;
  setIsLoadingSales: (loading: boolean) => void;
}) {
  await Promise.all([
    loadRoomTypes(setters.setRoomTypes, setters.setIsLoadingRoomTypes),
    loadGuests(setters.setGuests, setters.setIsLoadingGuests),
    loadReservations(setters.setReservations, setters.setIsLoadingReservations),
    loadCorporateClients(setters.setCorporateClients, setters.setIsLoadingCorporateClients),
    loadCategories(setters.setCategories, setters.setIsLoadingCategories),
    loadProducts(setters.setProducts, setters.setIsLoadingProducts),
    loadLocations(setters.setLocations, setters.setIsLoadingLocations),
    loadInventory(setters.setInventory, setters.setIsLoadingInventory),
    loadServices(setters.setServices, setters.setIsLoadingServices),
    loadServiceBookings(setters.setServiceBookings, setters.setIsLoadingServiceBookings),
    loadSales(setters.setSales, setters.setIsLoadingSales),
  ]);
}
