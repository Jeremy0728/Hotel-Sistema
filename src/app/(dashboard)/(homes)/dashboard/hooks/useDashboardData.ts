import { useMemo } from "react";
import dayjs from "dayjs";
import { useRooms } from "@/hooks/useRooms";
import { useReservations } from "@/hooks/useReservations";
import { useInvoices } from "@/hooks/useInvoices";
import { useSales } from "@/hooks/useSales";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import type { Invoice, Reservation, Room, RoomStatus } from "@/types/hotel";

interface RoomSnapshot {
  room: Room;
  activeReservation?: Reservation;
  arrivalReservation?: Reservation;
  departureReservation?: Reservation;
  hasPendingPayment: boolean;
  hasAlert: boolean;
}

export function useDashboardData(statusFilter: RoomStatus | "all", selectedFloor: number) {
  // Obtener datos desde hooks individuales
  const { reservations: apiReservations } = useReservations({ limit: 100 });
  const { invoices: apiInvoices } = useInvoices({ limit: 100 });
  const { sales: apiSales } = useSales({ limit: 100 });
  const { settings: hotelSettings } = useHotelSettings();

  // Cargar TODAS las habitaciones para calcular contadores correctamente
  const {
    rooms: allRooms,
    isLoading: allRoomsLoading,
  } = useRooms({ 
    limit: 100,
  });

  // Cargar habitaciones filtradas para mostrar en el grid
  const {
    rooms: filteredRooms,
    isLoading: filteredRoomsLoading,
    updateRoomStatus,
  } = useRooms({ 
    limit: 100,
    status: statusFilter !== "all" ? statusFilter : undefined,
    floor: selectedFloor,
  });

  // Transformar datos de API a formato local usando useMemo
  const rooms = useMemo(() => allRooms.map((room) => ({
    id: String(room.id),
    number: room.number,
    type: room.roomType?.name || "Standard",
    floor: room.floor,
    status: room.status as RoomStatus,
    notes: room.notes || "",
  })), [allRooms]);

  const reservations = useMemo(() => apiReservations.map((res) => ({
    id: String(res.id),
    code: res.confirmation_code,
    confirmation_code: res.confirmation_code,
    guestId: String(res.guest_id),
    guestName: res.guest 
      ? `${res.guest.nombres} ${res.guest.apellido_paterno}` 
      : "Huésped",
    roomId: String(res.room_id),
    roomNumber: res.room?.number || "",
    status: res.status === "checked_in" ? "checkin" as const : 
            res.status === "checked_out" ? "checkout" as const :
            res.status as "pending" | "confirmed" | "cancelled",
    checkIn: res.check_in_date,
    checkOut: res.check_out_date,
    nights: res.total_nights,
    total: typeof res.total_amount === 'string' ? parseFloat(res.total_amount) : res.total_amount,
    adults: res.adults,
    children: res.children,
    notes: res.special_requests || "",
    createdAt: res.created_at || res.check_in_date,
  })), [apiReservations]);

  const invoices = useMemo(() => apiInvoices.map((inv) => ({
    id: String(inv.id),
    number: String(inv.id),
    reservationCode: inv.reservation?.confirmation_code,
    clientName: inv.guest?.nombres || "Cliente",
    clientType: "guest" as const,
    date: inv.issue_date,
    items: [],
    subtotal: typeof inv.subtotal === 'string' ? parseFloat(inv.subtotal) : inv.subtotal,
    tax: typeof inv.tax === 'string' ? parseFloat(inv.tax) : (inv.tax || 0),
    total: typeof inv.total_amount === 'string' ? parseFloat(inv.total_amount) : inv.total_amount,
    balance: typeof inv.balance === 'string' ? parseFloat(inv.balance) : inv.balance,
    status: inv.status,
    payments: inv.all_related_payments?.map(p => ({
      amount: typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount,
      method: p.paymentMethod?.name || 'Desconocido',
      date: p.payment_date,
    })) || [],
  })), [apiInvoices]);

  const sales = useMemo(() => apiSales.map((sale) => ({
    id: String(sale.id),
    date: sale.created_at.split('T')[0],
    total: typeof sale.total_amount === 'string' ? parseFloat(sale.total_amount) : sale.total_amount,
  })), [apiSales]);

  const todayStr = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const yesterdayStr = useMemo(() => dayjs().subtract(1, 'day').format("YYYY-MM-DD"), []);

  // Calcular snapshots para todas las habitaciones
  const snapshots = useMemo<RoomSnapshot[]>(() => {
    return rooms.map((room) => {
      const roomReservations = reservations
        .filter((reservation) => reservation.roomId === room.id)
        .sort((a, b) => b.checkIn.localeCompare(a.checkIn));

      const activeReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin"
      );
      const arrivalReservation = roomReservations.find(
        (reservation) =>
          (reservation.status === "confirmed" || reservation.status === "pending") &&
          reservation.checkIn === todayStr
      );
      const departureReservation = roomReservations.find(
        (reservation) =>
          reservation.status === "checkin" && reservation.checkOut === todayStr
      );

      const reservationCodes = new Set(roomReservations.map((reservation) => reservation.code));
      const reservationGuests = new Set(
        roomReservations.map((reservation) => reservation.guestName?.toLowerCase())
      );

      const pendingInvoice = invoices.find((invoice) => {
        const matchCode = invoice.reservationCode
          ? reservationCodes.has(invoice.reservationCode)
          : false;
        const matchGuest = reservationGuests.has(invoice.clientName?.toLowerCase());
        return (
          (matchCode || matchGuest) &&
          invoice.balance > 0 &&
          invoice.status !== "paid" &&
          invoice.status !== "cancelled"
        );
      });

      return {
        room,
        activeReservation,
        arrivalReservation,
        departureReservation,
        hasPendingPayment: Boolean(pendingInvoice),
        hasAlert: room.status === "maintenance" || room.status === "out_of_service",
      };
    });
  }, [rooms, reservations, invoices, todayStr]);

  // Transformar habitaciones filtradas para el grid
  const filteredRoomSnapshots = useMemo<RoomSnapshot[]>(() => {
    return filteredRooms.map((room) => {
      const roomReservations = reservations
        .filter((reservation) => reservation.roomId === String(room.id))
        .sort((a, b) => b.checkIn.localeCompare(a.checkIn));

      const activeReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin"
      );
      const arrivalReservation = roomReservations.find(
        (reservation) =>
          (reservation.status === "confirmed" || reservation.status === "pending") &&
          reservation.checkIn === todayStr
      );
      const departureReservation = roomReservations.find(
        (reservation) =>
          reservation.status === "checkin" && reservation.checkOut === todayStr
      );

      const reservationCodes = new Set(roomReservations.map((reservation) => reservation.code));

      const pendingInvoice = invoices.find((invoice) => {
        const matchCode = invoice.reservationCode
          ? reservationCodes.has(invoice.reservationCode)
          : false;
        return (
          matchCode &&
          invoice.balance > 0 &&
          invoice.status !== "paid" &&
          invoice.status !== "cancelled"
        );
      });

      return {
        room: {
          id: String(room.id),
          number: room.number,
          type: room.roomType?.name || "Standard",
          floor: room.floor,
          status: room.status,
          notes: room.notes || "",
        },
        activeReservation,
        arrivalReservation,
        departureReservation,
        hasPendingPayment: Boolean(pendingInvoice),
        hasAlert: room.status === "maintenance" || room.status === "out_of_service",
      };
    });
  }, [filteredRooms, reservations, invoices, todayStr]);

  return {
    rooms,
    reservations,
    invoices,
    sales,
    hotelSettings,
    snapshots,
    filteredRoomSnapshots,
    filteredRoomsLoading,
    updateRoomStatus,
    todayStr,
    yesterdayStr,
  };
}
