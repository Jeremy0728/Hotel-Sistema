"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import RoomOpsTile from "@/app/(dashboard)/rooms/components/room-ops-tile";
import MetricCard from "@/components/hotel/metric-card";
import StatusBadge from "@/components/hotel/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Invoice, Reservation, Room, RoomStatus } from "@/types/hotel";
import {
  AlertTriangle,
  BedDouble,
  CalendarCheck2,
  CircleCheck,
  CreditCard,
  Info,
  LogIn,
  LogOut,
  Receipt,
  RefreshCw,
  Sparkles,
  UserPlus,
} from "lucide-react";
import OccupancyChartCard from "./occupancy-chart-card";
import UpcomingReservations from "./upcoming-reservations";

type StatusFilter = RoomStatus | "all";

interface RoomSnapshot {
  room: Room;
  activeReservation?: Reservation;
  arrivalReservation?: Reservation;
  departureReservation?: Reservation;
  hasPendingPayment: boolean;
  hasAlert: boolean;
}

const staffPool = ["Ana", "Carlos", "Brenda", "Luis"];

function displayName(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length <= 1) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function paxLabel(reservation?: Reservation) {
  if (!reservation) return "Pax -";
  return `Pax ${(reservation.adults ?? 0) + (reservation.children ?? 0)}`;
}

function paymentMeta(invoice?: Invoice) {
  if (!invoice) return { label: "Sin factura", variant: "info" as const };
  if (invoice.balance <= 0) return { label: "Pagado", variant: "success" as const };
  if (invoice.balance < invoice.total) return { label: "Parcial", variant: "info" as const };
  return { label: "Pendiente", variant: "warning" as const };
}

function roomNumeric(roomNumber: string) {
  const parsed = Number.parseInt(roomNumber, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function reservationStatusLabel(status: Reservation["status"]) {
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmada";
  if (status === "checkin") return "Check-in";
  if (status === "checkout") return "Check-out";
  return "Cancelada";
}

export default function HotelDashboard() {
  const {
    rooms,
    reservations,
    invoices,
    sales,
    hotelSettings,
    completeCheckIn,
    completeCheckOut,
    updateRoom,
  } = useHotelData();
  const router = useRouter();

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const yesterdayStr = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }, []);

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "available").length;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const cleaningRooms = rooms.filter((room) => room.status === "cleaning").length;
  const maintenanceRooms = rooms.filter((room) => room.status === "maintenance").length;
  const outOfServiceRooms = rooms.filter((room) => room.status === "out_of_service").length;

  const arrivalsToday = reservations
    .filter(
      (reservation) =>
        reservation.checkIn === todayStr &&
        (reservation.status === "pending" || reservation.status === "confirmed")
    )
    .sort((a, b) => roomNumeric(a.roomNumber) - roomNumeric(b.roomNumber));

  const departuresToday = reservations
    .filter(
      (reservation) =>
        reservation.checkOut === todayStr && reservation.status === "checkin"
    )
    .sort((a, b) => roomNumeric(a.roomNumber) - roomNumeric(b.roomNumber));

  const checkInsToday = arrivalsToday.length;
  const checkOutsToday = departuresToday.length;
  const checkInsYesterday = reservations.filter(
    (reservation) =>
      reservation.checkIn === yesterdayStr &&
      (reservation.status === "pending" || reservation.status === "confirmed")
  ).length;
  const checkOutsYesterday = reservations.filter(
    (reservation) =>
      reservation.checkOut === yesterdayStr && reservation.status === "checkin"
  ).length;

  const paymentsToday = invoices
    .filter((invoice) => invoice.date === todayStr)
    .reduce(
      (sum, invoice) =>
        sum + invoice.payments.reduce((acc, payment) => acc + payment.amount, 0),
      0
    );
  const salesToday = sales
    .filter((sale) => sale.date === todayStr)
    .reduce((sum, sale) => sum + sale.total, 0);
  const revenueToday = paymentsToday + salesToday;
  const pendingToday = invoices
    .filter((invoice) => invoice.date === todayStr)
    .reduce((sum, invoice) => sum + invoice.balance, 0);

  const unpaidReservations = invoices.filter((invoice) => invoice.balance > 0).length;
  const overbookingRisk = Math.max(0, checkInsToday - availableRooms);
  const sapStatus = pendingToday > 0 ? "Error" : "OK";

  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b),
    [rooms]
  );
  const [selectedFloor, setSelectedFloor] = useState<number>(floors[0] ?? 1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const invoiceByReservation = useMemo(() => {
    const map = new Map<string, Invoice>();
    invoices.forEach((invoice) => {
      if (invoice.reservationCode) map.set(invoice.reservationCode, invoice);
    });
    return map;
  }, [invoices]);

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
        roomReservations.map((reservation) => reservation.guestName.toLowerCase())
      );

      const pendingInvoice = invoices.find((invoice) => {
        const matchCode = invoice.reservationCode
          ? reservationCodes.has(invoice.reservationCode)
          : false;
        const matchGuest = reservationGuests.has(invoice.clientName.toLowerCase());
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

  const floorRooms = useMemo(
    () =>
      snapshots
        .filter((snapshot) => snapshot.room.floor === selectedFloor)
        .sort((a, b) => roomNumeric(a.room.number) - roomNumeric(b.room.number)),
    [snapshots, selectedFloor]
  );

  const visibleRooms = useMemo(() => {
    if (statusFilter === "all") return floorRooms;
    return floorRooms.filter((snapshot) => snapshot.room.status === statusFilter);
  }, [floorRooms, statusFilter]);

  const floorCounts = {
    all: floorRooms.length,
    available: floorRooms.filter((snapshot) => snapshot.room.status === "available").length,
    occupied: floorRooms.filter((snapshot) => snapshot.room.status === "occupied").length,
    cleaning: floorRooms.filter((snapshot) => snapshot.room.status === "cleaning").length,
    maintenance: floorRooms.filter((snapshot) => snapshot.room.status === "maintenance").length,
    out_of_service: floorRooms.filter((snapshot) => snapshot.room.status === "out_of_service")
      .length,
  };

  const quickAction = (snapshot: RoomSnapshot) => {
    if (snapshot.arrivalReservation && snapshot.room.status === "available") {
      return {
        label: "Check-in rapido",
        execute: () => completeCheckIn(snapshot.arrivalReservation!.id),
      };
    }

    if (snapshot.departureReservation) {
      return {
        label: "Check-out rapido",
        execute: () => completeCheckOut(snapshot.departureReservation!.id),
      };
    }

    if (snapshot.room.status === "cleaning") {
      return {
        label: "Marcar lista",
        execute: () => updateRoom(snapshot.room.id, { status: "available" }),
      };
    }

    if (snapshot.room.status === "maintenance" || snapshot.room.status === "out_of_service") {
      return {
        label: "Reactivar",
        execute: () => updateRoom(snapshot.room.id, { status: "available" }),
      };
    }

    return {
      label: "Detalle",
      execute: () => router.push(`/rooms?floor=${selectedFloor}`),
    };
  };

  const contextLine = (snapshot: RoomSnapshot) => {
    if (snapshot.departureReservation) return `Sale ${hotelSettings.checkOutTime}`;
    if (snapshot.arrivalReservation) return `Llega ${hotelSettings.checkInTime}`;
    if (snapshot.room.status === "cleaning") return "Pendiente de limpieza";
    if (snapshot.room.status === "maintenance") return "Revision tecnica";
    if (snapshot.room.status === "out_of_service") return "Fuera de servicio";
    if (snapshot.room.status === "occupied") return "Huesped alojado";
    return "Lista";
  };

  const housekeepingQueue = useMemo(() => {
    const priority = {
      out_of_service: 1,
      maintenance: 2,
      cleaning: 3,
      occupied: 4,
      available: 5,
    } as const;

    return rooms
      .filter((room) => ["cleaning", "maintenance", "out_of_service"].includes(room.status))
      .sort((a, b) => {
        const aPriority = priority[a.status];
        const bPriority = priority[b.status];
        if (aPriority !== bPriority) return aPriority - bPriority;
        if (a.floor !== b.floor) return a.floor - b.floor;
        return roomNumeric(a.number) - roomNumeric(b.number);
      })
      .slice(0, 5)
      .map((room, index) => ({ room, assignedTo: staffPool[index % staffPool.length] }));
  }, [rooms]);

  const trendText = (value: number) => `${value >= 0 ? "+" : ""}${value} vs ayer`;

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {unpaidReservations > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
              asChild
            >
              <Link href="/reservations?payment=pending">
                <CreditCard className="h-4 w-4" />
                {unpaidReservations} reservas sin pago · Ver cuentas por cobrar
              </Link>
            </Button>
          ) : null}

          {cleaningRooms > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
              asChild
            >
              <Link href="/housekeeping?status=cleaning">
                <Sparkles className="h-4 w-4" />
                {cleaningRooms} habitaciones por limpiar · Ver pendientes HK
              </Link>
            </Button>
          ) : null}

          {sapStatus === "Error" ? (
            <Button size="sm" variant="destructive" className="animate-pulse" asChild>
              <Link href="/invoices">
                <AlertTriangle className="h-4 w-4" />
                Sync SAP: error · Ver detalle
              </Link>
            </Button>
          ) : (
            <Badge variant="success">Sync SAP: OK</Badge>
          )}

          {overbookingRisk > 0 ? (
            <Badge variant="danger">{overbookingRisk} riesgo overbooking</Badge>
          ) : null}

          {unpaidReservations === 0 && cleaningRooms === 0 && overbookingRisk === 0 ? (
            <span className="text-sm text-neutral-500 dark:text-neutral-300">
              Sin alertas criticas por ahora.
            </span>
          ) : null}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              title="Disponibles"
              value={`${availableRooms}/${totalRooms}`}
              description="Capacidad actual"
              trend={`${Math.round((availableRooms / Math.max(totalRooms, 1)) * 100)}% del total`}
              actionLabel="Ver habitaciones"
              href="/rooms?status=available"
              icon={CircleCheck}
              accentClassName="bg-emerald-100 text-emerald-600"
            />
            <MetricCard
              title="Ocupadas"
              value={`${occupiedRooms}/${totalRooms}`}
              description="En este momento"
              trend={`${Math.round((occupiedRooms / Math.max(totalRooms, 1)) * 100)}% del total`}
              actionLabel="Ver ocupadas"
              href="/rooms?status=occupied"
              icon={BedDouble}
              accentClassName="bg-red-100 text-red-600"
            />
            <MetricCard
              title="Check-ins hoy"
              value={checkInsToday}
              description="Llegadas programadas"
              trend={trendText(checkInsToday - checkInsYesterday)}
              actionLabel="Ir a check-in"
              href="/checkin"
              icon={LogIn}
              accentClassName="bg-emerald-100 text-emerald-600"
            />
            <MetricCard
              title="Check-outs hoy"
              value={checkOutsToday}
              description="Salidas programadas"
              trend={trendText(checkOutsToday - checkOutsYesterday)}
              actionLabel="Ir a check-out"
              href="/checkout"
              icon={LogOut}
              accentClassName="bg-orange-100 text-orange-600"
            />
          </div>

          <Card className="p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold">Habitaciones por piso</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-300">
                  Vista operativa en tiempo real
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/rooms">Abrir vista completa</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <Button
                size="sm"
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                Todo ({floorCounts.all})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "available" ? "default" : "outline"}
                onClick={() => setStatusFilter("available")}
              >
                Disponible ({floorCounts.available})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "occupied" ? "default" : "outline"}
                onClick={() => setStatusFilter("occupied")}
              >
                Ocupada ({floorCounts.occupied})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "cleaning" ? "default" : "outline"}
                onClick={() => setStatusFilter("cleaning")}
              >
                Limpieza ({floorCounts.cleaning})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "maintenance" ? "default" : "outline"}
                onClick={() => setStatusFilter("maintenance")}
              >
                Mant. ({floorCounts.maintenance})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "out_of_service" ? "default" : "outline"}
                onClick={() => setStatusFilter("out_of_service")}
              >
                F/S ({floorCounts.out_of_service})
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {floorSummaries.map((summary) => (
                <button
                  key={summary.floor}
                  type="button"
                  onClick={() => setSelectedFloor(summary.floor)}
                  className={`min-w-[168px] rounded-lg border px-3 py-2 text-left transition ${
                    selectedFloor === summary.floor
                      ? "border-primary bg-primary/10"
                      : "border-neutral-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  }`}
                >
                  <p className="text-sm font-semibold">Piso {summary.floor}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-300">
                    D:{summary.available} O:{summary.occupied} L:{summary.cleaning}
                  </p>
                </button>
              ))}
            </div>

            {visibleRooms.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
                No hay habitaciones para los filtros seleccionados.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {visibleRooms.map((snapshot) => {
                  const action = quickAction(snapshot);
                  const guest =
                    snapshot.activeReservation?.guestName ??
                    snapshot.arrivalReservation?.guestName ??
                    snapshot.departureReservation?.guestName;

                  return (
                    <RoomOpsTile
                      key={snapshot.room.id}
                      room={snapshot.room}
                      guestName={guest ? displayName(guest) : undefined}
                      paxLabel={paxLabel(snapshot.activeReservation ?? snapshot.arrivalReservation)}
                      context={contextLine(snapshot)}
                      hasPendingPayment={snapshot.hasPendingPayment}
                      hasAlert={snapshot.hasAlert}
                      quickLabel={action.label}
                      onView={() => router.push(`/rooms?floor=${selectedFloor}`)}
                      onQuick={action.execute}
                    />
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-semibold">Hoy</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-300">
                  Llegadas y salidas ordenadas para recepcion
                </p>
              </div>
            </div>

            <Tabs defaultValue="arrivals" className="w-full">
              <TabsList className="grid w-full h-auto grid-cols-2">
                <TabsTrigger value="arrivals">Llegadas ({arrivalsToday.length})</TabsTrigger>
                <TabsTrigger value="departures">Salidas ({departuresToday.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="arrivals" className="space-y-2 mt-3">
                {arrivalsToday.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
                    No hay llegadas hoy.
                  </div>
                ) : (
                  arrivalsToday.slice(0, 6).map((reservation) => {
                    const payment = paymentMeta(invoiceByReservation.get(reservation.code));
                    return (
                      <div
                        key={reservation.id}
                        className="rounded-lg border border-neutral-200 p-3 dark:border-slate-700"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">{reservation.guestName}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-300">
                              Hab. #{reservation.roomNumber} · {hotelSettings.checkInTime} · {reservationStatusLabel(reservation.status)}
                            </p>
                          </div>
                          <Badge variant={payment.variant}>{payment.label}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/reservations/${reservation.id}`)}
                          >
                            Ver reserva
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => completeCheckIn(reservation.id)}
                            disabled={
                              reservation.status !== "pending" && reservation.status !== "confirmed"
                            }
                          >
                            Check-in rapido
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="departures" className="space-y-2 mt-3">
                {departuresToday.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
                    No hay salidas hoy.
                  </div>
                ) : (
                  departuresToday.slice(0, 6).map((reservation) => {
                    const payment = paymentMeta(invoiceByReservation.get(reservation.code));
                    return (
                      <div
                        key={reservation.id}
                        className="rounded-lg border border-neutral-200 p-3 dark:border-slate-700"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">{reservation.guestName}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-300">
                              Hab. #{reservation.roomNumber} · {hotelSettings.checkOutTime} · {reservationStatusLabel(reservation.status)}
                            </p>
                          </div>
                          <Badge variant={payment.variant}>{payment.label}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/reservations/${reservation.id}`)}
                          >
                            Ver reserva
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => completeCheckOut(reservation.id)}
                            disabled={reservation.status !== "checkin"}
                          >
                            Check-out rapido
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </Card>

          <UpcomingReservations />

          <OccupancyChartCard compact />
        </div>

        <div className="xl:col-span-4">
          <div className="space-y-5 xl:sticky xl:top-24">
            <Card className="p-4 space-y-3">
              <div>
                <h3 className="text-base font-semibold">Acciones rapidas</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-300">
                  Flujo operativo de recepcion
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                <Button asChild>
                  <Link href="/reservations/new">
                    <CalendarCheck2 className="h-4 w-4" />
                    Nueva reserva
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/checkin">
                    <LogIn className="h-4 w-4" />
                    Check-in (flujo)
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/invoices">
                    <Receipt className="h-4 w-4" />
                    Cobrar
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/guests">
                    <UserPlus className="h-4 w-4" />
                    Nuevo huesped
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Housekeeping en cola</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-300">
                    Top 5 habitaciones prioritarias
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/housekeeping">Ver todo</Link>
                </Button>
              </div>

              {housekeepingQueue.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
                  No hay pendientes de limpieza.
                </div>
              ) : (
                <div className="space-y-2">
                  {housekeepingQueue.map((item) => (
                    <div
                      key={item.room.id}
                      className="rounded-lg border border-neutral-200 p-3 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">Habitacion #{item.room.number}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-300">
                            Piso {item.room.floor} · {item.assignedTo}
                          </p>
                        </div>
                        <StatusBadge type="room" status={item.room.status} />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateRoom(item.room.id, { status: "available" })}
                        >
                          Marcar lista
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Caja compacta</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-300">
                    Pendientes y sincronizacion
                  </p>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <CalendarCheck2 className="h-4 w-4" />
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Ingresos hoy</span>
                  <span className="font-semibold">S/ {revenueToday.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pendiente por cobrar</span>
                  <span className="font-semibold">S/ {pendingToday.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pagos en SAP</span>
                  <Badge variant={sapStatus === "OK" ? "success" : "danger"}>{sapStatus}</Badge>
                </div>
                {sapStatus === "Error" ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                    No se pudo sincronizar. Reintentar o revisar detalle de integracion.
                  </div>
                ) : (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-700">
                    Sincronizacion correcta con SAP.
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Mantenimiento / F/S</span>
                  <span className="font-semibold">{maintenanceRooms + outOfServiceRooms}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/invoices?status=overdue">
                    <Info className="h-4 w-4" />
                    Ver detalle
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/invoices">
                    <RefreshCw className="h-4 w-4" />
                    Reintentar sync
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
