"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/hotel/status-badge";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { ReservationStatus } from "@/types/hotel";
import { MoreHorizontal } from "lucide-react";

const statusOptions: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "checkin", label: "Check-in" },
  { value: "checkout", label: "Check-out" },
  { value: "cancelled", label: "Cancelada" },
];

const channelOptions = [
  { value: "all", label: "Todos" },
  { value: "direct", label: "Directo" },
  { value: "ota", label: "OTA" },
  { value: "corporate", label: "Corporativo" },
];

const paymentOptions = [
  { value: "all", label: "Todos" },
  { value: "paid", label: "Pagado" },
  { value: "pending", label: "Pendiente" },
  { value: "none", label: "Sin factura" },
];

export default function ReservationsPage() {
  const {
    reservations,
    guests,
    rooms,
    invoices,
    updateReservation,
    completeCheckIn,
    completeCheckOut,
  } = useHotelData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const paymentParam = searchParams.get("payment");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const initialStatusFilter: ReservationStatus | "all" =
    statusParam && statusOptions.some((option) => option.value === statusParam)
      ? (statusParam as ReservationStatus | "all")
      : "all";
  const initialPaymentFilter =
    paymentParam && paymentOptions.some((option) => option.value === paymentParam)
      ? paymentParam
      : "all";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ReservationStatus | "all">(initialStatusFilter);
  const [guestFilter, setGuestFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState(initialPaymentFilter);
  const [dateFrom, setDateFrom] = useState(fromParam ?? "");
  const [dateTo, setDateTo] = useState(toParam ?? "");

  const todayStr = new Date().toISOString().split("T")[0];

  const paymentStatus = (reservationCode: string) => {
    const invoice = invoices.find((entry) => entry.reservationCode === reservationCode);
    if (!invoice) return "none";
    return invoice.balance > 0 ? "pending" : "paid";
  };

  const filtered = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.code.toLowerCase().includes(search.toLowerCase()) ||
      reservation.guestName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : reservation.status === statusFilter;
    const matchesGuest =
      guestFilter === "all" ? true : reservation.guestId === guestFilter;
    const matchesRoom =
      roomFilter === "all" ? true : reservation.roomId === roomFilter;
    const matchesDateFrom = dateFrom ? reservation.checkIn >= dateFrom : true;
    const matchesDateTo = dateTo ? reservation.checkOut <= dateTo : true;
    const matchesChannel =
      channelFilter === "all" ? true : reservation.channel === channelFilter;
    const matchesPayment =
      paymentFilter === "all"
        ? true
        : paymentStatus(reservation.code) === paymentFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesGuest &&
      matchesRoom &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesChannel &&
      matchesPayment
    );
  });

  const guestOptions = useMemo(
    () =>
      guests.map((guest) => ({
        value: guest.id,
        label: `${guest.firstName} ${guest.lastName}`,
      })),
    [guests]
  );

  const roomOptions = useMemo(
    () =>
      rooms.map((room) => ({
        value: room.id,
        label: `#${room.number}`,
      })),
    [rooms]
  );

  const applyView = (view: "today" | "pending" | "week") => {
    if (view === "today") {
      setDateFrom(todayStr);
      setDateTo(todayStr);
      setStatusFilter("all");
      setPaymentFilter("all");
      return;
    }
    if (view === "pending") {
      setPaymentFilter("pending");
      setStatusFilter("all");
      return;
    }
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split("T")[0];
    setDateFrom(todayStr);
    setDateTo(weekEndStr);
  };

  const handleConfirm = (id: string) => {
    updateReservation(id, { status: "confirmed" });
  };

  const handleCancel = (id: string) => {
    updateReservation(id, { status: "cancelled" });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4 md:sticky md:top-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reservas</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Administración de reservas y estados
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyView("today")}
            >
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyView("pending")}
            >
              Pendientes pago
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyView("week")}
            >
              Llegadas semana
            </Button>
            <Button asChild>
              <Link href="/reservations/new">Nueva reserva</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input
            placeholder="Buscar por código o huésped"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ReservationStatus | "all")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Pago" />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Habitación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {roomOptions.map((room) => (
                <SelectItem key={room.value} value={room.value}>
                  {room.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={guestFilter} onValueChange={setGuestFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Huésped" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {guestOptions.map((guest) => (
                <SelectItem key={guest.value} value={guest.value}>
                  {guest.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin reservas"
          description="No hay reservas para mostrar con los filtros actuales."
          action={
            <Button asChild>
              <Link href="/reservations/new">Crear reserva</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Card className="p-4 hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Noches</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((reservation) => (
                  <TableRow
                    key={reservation.id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => router.push(`/reservations/${reservation.id}`)}
                  >
                    <TableCell className="font-medium">{reservation.code}</TableCell>
                    <TableCell>{reservation.guestName}</TableCell>
                    <TableCell>#{reservation.roomNumber}</TableCell>
                    <TableCell>{reservation.checkIn}</TableCell>
                    <TableCell>{reservation.checkOut}</TableCell>
                    <TableCell>{reservation.nights}</TableCell>
                    <TableCell>
                      <StatusBadge type="reservation" status={reservation.status} />
                    </TableCell>
                    <TableCell>S/ {reservation.total}</TableCell>
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" aria-label="Acciones">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/reservations/${reservation.id}`)}>
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleConfirm(reservation.id)}
                            disabled={reservation.status !== "pending"}
                          >
                            Confirmar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => completeCheckIn(reservation.id)}
                            disabled={reservation.status !== "confirmed"}
                          >
                            Check-in
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => completeCheckOut(reservation.id)}
                            disabled={reservation.status !== "checkin"}
                          >
                            Check-out
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push("/invoices")}
                          >
                            Cobrar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCancel(reservation.id)}
                            disabled={reservation.status === "cancelled"}
                          >
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-3 md:hidden">
            {filtered.map((reservation) => (
              <Card
                key={reservation.id}
                className="p-4 border border-neutral-200 dark:border-slate-700 cursor-pointer"
                onClick={() => router.push(`/reservations/${reservation.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{reservation.code}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-300">
                      {reservation.guestName} · Hab. #{reservation.roomNumber}
                    </p>
                  </div>
                  <StatusBadge type="reservation" status={reservation.status} />
                </div>
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-300">
                  {reservation.checkIn} → {reservation.checkOut} · {reservation.nights} noches
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold">S/ {reservation.total}</span>
                  <Button
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/reservations/${reservation.id}`);
                    }}
                  >
                    Ver detalle
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
