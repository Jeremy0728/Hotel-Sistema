import { useMemo } from "react";
import type { Room, Reservation, Invoice } from "@/types/hotel";
import { roomNumeric } from "../utils/dashboard-helpers";

interface RoomSnapshot {
  room: Room;
  activeReservation?: Reservation;
  arrivalReservation?: Reservation;
  departureReservation?: Reservation;
  hasPendingPayment: boolean;
  hasAlert: boolean;
}

interface UseDashboardMetricsProps {
  rooms: Room[];
  reservations: Reservation[];
  invoices: Invoice[];
  sales: Array<{ id: string; date: string; total: number }>;
  snapshots: RoomSnapshot[];
  selectedFloor: number;
  todayStr: string;
  yesterdayStr: string;
}

export function useDashboardMetrics({
  rooms,
  reservations,
  invoices,
  sales,
  snapshots,
  selectedFloor,
  todayStr,
  yesterdayStr,
}: UseDashboardMetricsProps) {
  // Contadores de habitaciones
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "available").length;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const cleaningRooms = rooms.filter((room) => room.status === "cleaning").length;
  const maintenanceRooms = rooms.filter((room) => room.status === "maintenance").length;
  const outOfServiceRooms = rooms.filter((room) => room.status === "out_of_service").length;

  // Llegadas y salidas de hoy
  const arrivalsToday = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            (reservation.status === "confirmed" || reservation.status === "pending") &&
            reservation.checkIn === todayStr
        )
        .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)),
    [reservations, todayStr]
  );

  const departuresToday = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            reservation.status === "checkin" && reservation.checkOut === todayStr
        )
        .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)),
    [reservations, todayStr]
  );

  // Reservas sin pago
  const unpaidReservations = useMemo(() => {
    const paidReservationCodes = new Set(
      invoices
        .filter((invoice) => invoice.balance <= 0)
        .map((invoice) => invoice.reservationCode)
        .filter(Boolean)
    );
    return reservations.filter(
      (reservation) =>
        (reservation.status === "confirmed" || reservation.status === "checkin") &&
        !paidReservationCodes.has(reservation.code)
    ).length;
  }, [reservations, invoices]);

  // Ventas de hoy y ayer
  const todaySales = useMemo(
    () => sales.filter((sale) => sale.date === todayStr).reduce((sum, sale) => sum + sale.total, 0),
    [sales, todayStr]
  );

  const yesterdaySales = useMemo(
    () =>
      sales.filter((sale) => sale.date === yesterdayStr).reduce((sum, sale) => sum + sale.total, 0),
    [sales, yesterdayStr]
  );

  const revenueTrend = todaySales - yesterdaySales;

  // Pisos disponibles
  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b),
    [rooms]
  );

  // Mapa de facturas por código de reserva
  const invoiceByReservation = useMemo(() => {
    const map = new Map<string, Invoice>();
    invoices.forEach((invoice) => {
      if (invoice.reservationCode) map.set(invoice.reservationCode, invoice);
    });
    return map;
  }, [invoices]);

  // Resúmenes por piso
  const floorSummaries = useMemo(() => {
    return floors.map((floor) => {
      const floorRooms = snapshots.filter((snapshot) => snapshot.room.floor === floor);
      return {
        floor,
        total: floorRooms.length,
        available: floorRooms.filter((snapshot) => snapshot.room.status === "available").length,
        occupied: floorRooms.filter((snapshot) => snapshot.room.status === "occupied").length,
        cleaning: floorRooms.filter((snapshot) => snapshot.room.status === "cleaning").length,
      };
    });
  }, [floors, snapshots]);

  // Habitaciones del piso seleccionado
  const floorRooms = useMemo(
    () =>
      snapshots
        .filter((snapshot) => snapshot.room.floor === selectedFloor)
        .sort((a, b) => roomNumeric(a.room.number) - roomNumeric(b.room.number)),
    [snapshots, selectedFloor]
  );

  // Contadores del piso seleccionado
  const floorCounts = useMemo(
    () => ({
      all: floorRooms.length,
      available: floorRooms.filter((snapshot) => snapshot.room.status === "available").length,
      occupied: floorRooms.filter((snapshot) => snapshot.room.status === "occupied").length,
      cleaning: floorRooms.filter((snapshot) => snapshot.room.status === "cleaning").length,
      maintenance: floorRooms.filter((snapshot) => snapshot.room.status === "maintenance").length,
      out_of_service: floorRooms.filter((snapshot) => snapshot.room.status === "out_of_service")
        .length,
    }),
    [floorRooms]
  );

  // Estado SAP (simulado)
  const sapStatus = "OK";
  const pendingToday = 0;

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    cleaningRooms,
    maintenanceRooms,
    outOfServiceRooms,
    arrivalsToday,
    departuresToday,
    unpaidReservations,
    todaySales,
    yesterdaySales,
    revenueTrend,
    floors,
    invoiceByReservation,
    floorSummaries,
    floorRooms,
    floorCounts,
    sapStatus,
    pendingToday,
  };
}
