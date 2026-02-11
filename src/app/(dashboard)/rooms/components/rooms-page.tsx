"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, CircleCheck, LoaderCircle, Wrench } from "lucide-react";
import EmptyState from "@/components/hotel/empty-state";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";
import StatusBadge from "@/components/hotel/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Invoice, Reservation, Room, RoomStatus } from "@/types/hotel";
import RoomOpsTile from "./room-ops-tile";

type StatusFilter = RoomStatus | "all";

const validRoomStatuses = new Set<RoomStatus>([
  "available",
  "occupied",
  "cleaning",
  "maintenance",
  "out_of_service",
]);

interface RoomSnapshot {
  room: Room;
  roomReservations: Reservation[];
  activeReservation?: Reservation;
  arrivalReservation?: Reservation;
  departureReservation?: Reservation;
  pendingInvoice?: Invoice;
  hasPendingPayment: boolean;
  hasAlert: boolean;
}

function displayName(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length <= 1) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function paxLabel(reservation?: Reservation) {
  if (!reservation) return "Pax -";
  return `Pax ${(reservation.adults ?? 0) + (reservation.children ?? 0)}`;
}

export default function RoomsPage() {
  const {
    rooms,
    reservations,
    invoices,
    hotelSettings,
    updateRoom,
    completeCheckIn,
    completeCheckOut,
  } = useHotelData();
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b),
    [rooms]
  );

  const statusParam = searchParams.get("status");
  const floorParam = searchParams.get("floor");
  const initialStatusFilter: StatusFilter =
    statusParam && validRoomStatuses.has(statusParam as RoomStatus)
      ? (statusParam as RoomStatus)
      : "all";
  const parsedFloor = floorParam ? Number(floorParam) : NaN;
  const initialSelectedFloor =
    !Number.isNaN(parsedFloor) && floors.includes(parsedFloor)
      ? parsedFloor
      : (floors[0] ?? 1);

  const [selectedFloor, setSelectedFloor] = useState<number>(initialSelectedFloor);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");

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
          reservation.checkIn === today
      );
      const departureReservation = roomReservations.find(
        (reservation) => reservation.status === "checkin" && reservation.checkOut === today
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
        return (matchCode || matchGuest) && invoice.balance > 0 && invoice.status !== "paid" && invoice.status !== "cancelled";
      });

      const hasAlert =
        room.status === "maintenance" || room.status === "out_of_service";

      return {
        room,
        roomReservations,
        activeReservation,
        arrivalReservation,
        departureReservation,
        pendingInvoice,
        hasPendingPayment: Boolean(pendingInvoice),
        hasAlert,
      };
    });
  }, [rooms, reservations, invoices, today]);

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

  const roomsByFloor = useMemo(() => {
    const query = search.trim().toLowerCase();
    return snapshots
      .filter((snapshot) => snapshot.room.floor === selectedFloor)
      .filter((snapshot) => {
        if (statusFilter !== "all" && snapshot.room.status !== statusFilter) return false;

        if (!query) return true;

        const matchesRoom =
          snapshot.room.number.toLowerCase().includes(query) ||
          snapshot.room.type.toLowerCase().includes(query);
        const matchesGuest = [
          snapshot.activeReservation?.guestName,
          snapshot.arrivalReservation?.guestName,
          snapshot.departureReservation?.guestName,
        ].some((name) => name?.toLowerCase().includes(query));

        return matchesRoom || matchesGuest;
      })
      .sort((a, b) =>
        a.room.number.localeCompare(b.room.number, undefined, { numeric: true })
      );
  }, [snapshots, selectedFloor, search, statusFilter]);

  const selectedSnapshot = useMemo(
    () => roomsByFloor.find((snapshot) => snapshot.room.id === selectedRoomId) ??
      snapshots.find((snapshot) => snapshot.room.id === selectedRoomId) ??
      null,
    [roomsByFloor, snapshots, selectedRoomId]
  );

  const selectedReservation =
    selectedSnapshot?.activeReservation ??
    selectedSnapshot?.arrivalReservation ??
    selectedSnapshot?.departureReservation ??
    selectedSnapshot?.roomReservations[0];

  const reservationHistory = selectedSnapshot
    ? selectedSnapshot.roomReservations.filter(
        (reservation) => reservation.id !== selectedReservation?.id
      )
    : [];

  const currentFloorSummary = floorSummaries.find(
    (summary) => summary.floor === selectedFloor
  );

  const currentFloorSnapshots = useMemo(
    () => snapshots.filter((snapshot) => snapshot.room.floor === selectedFloor),
    [snapshots, selectedFloor]
  );

  const counts = {
    all: currentFloorSummary?.total ?? 0,
    available: currentFloorSummary?.available ?? 0,
    occupied: currentFloorSummary?.occupied ?? 0,
    cleaning: currentFloorSummary?.cleaning ?? 0,
    maintenance: currentFloorSnapshots.filter(
      (snapshot) => snapshot.room.status === "maintenance"
    ).length,
    out_of_service: currentFloorSnapshots.filter(
      (snapshot) => snapshot.room.status === "out_of_service"
    ).length,
  };

  const quickAction = (snapshot: RoomSnapshot) => {
    if (snapshot.arrivalReservation && snapshot.room.status === "available") {
      return {
        label: "Check-in",
        execute: () => completeCheckIn(snapshot.arrivalReservation!.id),
      };
    }

    if (snapshot.departureReservation) {
      return {
        label: "Check-out",
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

    if (snapshot.room.status === "available") {
      return {
        label: "Reservar",
        execute: () => router.push("/reservations/new"),
      };
    }

    return {
      label: "Detalle",
      execute: () => {
        setSelectedRoomId(snapshot.room.id);
        setDrawerNotes(snapshot.room.notes ?? "");
      },
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

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="info" className="px-2 py-0.5">
                Modo operacion
              </Badge>
              <span className="text-xs text-neutral-500 dark:text-neutral-300">
                Recepcion: ejecutar sin editar datos maestros
              </span>
            </div>
            <h2 className="text-lg font-semibold">Habitaciones</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Disponibilidad y estado operativo en tiempo real
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/reservations/new">Nueva reserva</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/housekeeping">Housekeeping</Link>
            </Button>
            <Button asChild>
              <Link href="/operaciones/habitaciones/configuracion">
                Configuracion habitaciones
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <Button size="sm" variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
            Todo ({counts.all})
          </Button>
          <Button size="sm" variant={statusFilter === "available" ? "default" : "outline"} onClick={() => setStatusFilter("available")}>
            <CircleCheck className="h-4 w-4" />
            Disponible ({counts.available})
          </Button>
          <Button size="sm" variant={statusFilter === "occupied" ? "default" : "outline"} onClick={() => setStatusFilter("occupied")}>
            <Building2 className="h-4 w-4" />
            Ocupada ({counts.occupied})
          </Button>
          <Button size="sm" variant={statusFilter === "cleaning" ? "default" : "outline"} onClick={() => setStatusFilter("cleaning")}>
            <LoaderCircle className="h-4 w-4" />
            Limpieza ({counts.cleaning})
          </Button>
          <Button size="sm" variant={statusFilter === "maintenance" ? "default" : "outline"} onClick={() => setStatusFilter("maintenance")}>
            <Wrench className="h-4 w-4" />
            Mant. ({counts.maintenance})
          </Button>
          <Button size="sm" variant={statusFilter === "out_of_service" ? "default" : "outline"} onClick={() => setStatusFilter("out_of_service")}>
            F/S ({counts.out_of_service})
          </Button>
        </div>

        <Input
          placeholder="Buscar por numero, tipo o huesped"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          {floorSummaries.map((summary) => (
            <button
              key={summary.floor}
              type="button"
              onClick={() => setSelectedFloor(summary.floor)}
              className={`min-w-[170px] rounded-lg border px-3 py-2 text-left transition ${
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
      </Card>

      {roomsByFloor.length === 0 ? (
        <EmptyState
          title="Sin habitaciones para mostrar"
          description="Ajusta piso, estado o busqueda para continuar."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roomsByFloor.map((snapshot) => {
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
                onView={() => {
                  setSelectedRoomId(snapshot.room.id);
                  setDrawerNotes(snapshot.room.notes ?? "");
                }}
                onQuick={action.execute}
              />
            );
          })}
        </div>
      )}

      <Sheet
        open={Boolean(selectedRoomId && selectedSnapshot)}
        onOpenChange={(open) => {
          if (!open) setSelectedRoomId(null);
        }}
      >
        <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl">
          {selectedSnapshot ? (
            <>
              <SheetHeader className="border-b border-neutral-200 p-4 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 p-3 dark:border-slate-700">
                  <div>
                    <SheetTitle>Habitacion #{selectedSnapshot.room.number}</SheetTitle>
                    <SheetDescription>
                      {selectedSnapshot.room.type} - Piso {selectedSnapshot.room.floor}
                    </SheetDescription>
                  </div>
                  <StatusBadge type="room" status={selectedSnapshot.room.status} />
                </div>
              </SheetHeader>

              <div className="space-y-4 p-4">
                <Tabs defaultValue="current" className="w-full">
                  <TabsList className="grid h-auto w-full grid-cols-3">
                    <TabsTrigger value="current">Reserva actual</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                    <TabsTrigger value="housekeeping">Notas HK</TabsTrigger>
                  </TabsList>

                  <TabsContent value="current" className="space-y-3">
                    {selectedReservation ? (
                      <>
                        <Card className="p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 text-sm">
                              <p className="font-semibold">{selectedReservation.guestName}</p>
                              <p className="text-neutral-500 dark:text-neutral-300">
                                Reserva {selectedReservation.code}
                              </p>
                              <p className="text-neutral-500 dark:text-neutral-300">
                                Check-in {selectedReservation.checkIn} - Check-out {selectedReservation.checkOut}
                              </p>
                              <p className="text-neutral-500 dark:text-neutral-300">
                                {paxLabel(selectedReservation)}
                              </p>
                            </div>
                            <StatusBadge type="reservation" status={selectedReservation.status} />
                          </div>
                        </Card>

                        <Card className="p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">Facturacion</p>
                            {selectedSnapshot.pendingInvoice ? (
                              <InvoiceStatusBadge status={selectedSnapshot.pendingInvoice.status} />
                            ) : null}
                          </div>
                          <Separator className="my-2" />
                          {selectedSnapshot.pendingInvoice ? (
                            <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                              <p>Documento: {selectedSnapshot.pendingInvoice.number}</p>
                              <p>
                                Total: S/ {selectedSnapshot.pendingInvoice.total.toFixed(2)}
                              </p>
                              <p className="font-semibold text-rose-600">
                                Saldo pendiente: S/ {selectedSnapshot.pendingInvoice.balance.toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-emerald-600">
                              Sin pagos pendientes para esta habitacion.
                            </p>
                          )}
                        </Card>
                      </>
                    ) : (
                      <Card className="p-4 text-sm text-neutral-500 dark:text-neutral-300">
                        No hay reserva activa para esta habitacion.
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="history" className="space-y-2">
                    {reservationHistory.length === 0 ? (
                      <Card className="p-4 text-sm text-neutral-500 dark:text-neutral-300">
                        Sin historial registrado.
                      </Card>
                    ) : (
                      reservationHistory.map((reservation) => (
                        <Card key={reservation.id} className="p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm">
                              <p className="font-semibold">{reservation.guestName}</p>
                              <p className="text-neutral-500 dark:text-neutral-300">
                                {reservation.code} - {reservation.checkIn} a {reservation.checkOut}
                              </p>
                            </div>
                            <StatusBadge type="reservation" status={reservation.status} />
                          </div>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="housekeeping" className="space-y-3">
                    <Card className="p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Estado operativo</p>
                        <StatusBadge type="room" status={selectedSnapshot.room.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" onClick={() => updateRoom(selectedSnapshot.room.id, { status: "available" })}>
                          Marcar lista
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateRoom(selectedSnapshot.room.id, { status: "cleaning" })}>
                          En limpieza
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateRoom(selectedSnapshot.room.id, { status: "maintenance" })}>
                          Mantenimiento
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateRoom(selectedSnapshot.room.id, { status: "out_of_service" })}>
                          Fuera servicio
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">Notas HK</p>
                        <Textarea
                          rows={5}
                          value={drawerNotes}
                          onChange={(event) => setDrawerNotes(event.target.value)}
                          placeholder="Notas internas de limpieza/mantenimiento"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setDrawerNotes(selectedSnapshot.room.notes ?? "")}>
                            Revertir
                          </Button>
                          <Button size="sm" onClick={() => updateRoom(selectedSnapshot.room.id, { notes: drawerNotes.trim() })}>
                            Guardar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <SheetFooter className="border-t border-neutral-200 p-4 dark:border-slate-800">
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button variant="outline" onClick={() => router.push("/reservations")}>
                    Ver reservas
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/invoices")}>
                    Cobrar
                  </Button>
                  <Button
                    onClick={() =>
                      router.push("/operaciones/habitaciones/configuracion")
                    }
                  >
                    Ir a configuracion
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
