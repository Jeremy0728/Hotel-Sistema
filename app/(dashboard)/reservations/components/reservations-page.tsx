"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/hotel/status-badge";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { ReservationStatus } from "@/types/hotel";

const statusOptions: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "checkin", label: "Check-in" },
  { value: "checkout", label: "Check-out" },
  { value: "cancelled", label: "Cancelada" },
];

export default function ReservationsPage() {
  const { reservations, guests, rooms, updateReservation, completeCheckIn, completeCheckOut } =
    useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all"
  );
  const [guestFilter, setGuestFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
    return (
      matchesSearch &&
      matchesStatus &&
      matchesGuest &&
      matchesRoom &&
      matchesDateFrom &&
      matchesDateTo
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

  const handleConfirm = (id: string) => {
    updateReservation(id, { status: "confirmed" });
  };

  const handleCancel = (id: string) => {
    updateReservation(id, { status: "cancelled" });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reservas</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Administración de reservas y estados
            </p>
          </div>
          <Button asChild>
            <Link href="/reservations/new">Nueva reserva</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        <Card className="p-4">
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
                <TableRow key={reservation.id}>
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
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleConfirm(reservation.id)}
                        disabled={reservation.status !== "pending"}
                      >
                        Confirmar
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/reservations/${reservation.id}`}>Ver detalle</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => completeCheckIn(reservation.id)}
                        disabled={reservation.status !== "confirmed"}
                      >
                        Check-in
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => completeCheckOut(reservation.id)}
                        disabled={reservation.status !== "checkin"}
                      >
                        Check-out
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(reservation.id)}
                        disabled={reservation.status === "cancelled"}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
