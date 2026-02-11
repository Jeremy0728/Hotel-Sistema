"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/hotel/empty-state";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Guest, Reservation, ReservationStatus } from "@/types/hotel";

interface ReservationDetailProps {
  reservationId: string;
}

const documentOptions = ["DNI", "Pasaporte", "CE"] as const;

export default function ReservationDetail({ reservationId }: ReservationDetailProps) {
  const {
    reservations,
    guests,
    rooms,
    addGuest,
    updateReservation,
    completeCheckIn,
  } = useHotelData();
  const reservation = useMemo(
    () => reservations.find((item) => item.id === reservationId) ?? null,
    [reservations, reservationId]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
  });
  const [note, setNote] = useState("");

  if (!reservation) {
    return (
      <EmptyState
        title="Reserva no encontrada"
        description="No existe la reserva solicitada."
      />
    );
  }

  const room = rooms.find((item) => item.id === reservation.roomId);
  const additionalGuestIds = reservation.additionalGuestIds ?? [];
  const primaryGuest = guests.find((guest) => guest.id === reservation.guestId);
  const additionalGuests = additionalGuestIds
    .map((id) => guests.find((guest) => guest.id === id))
    .filter(Boolean) as Guest[];

  const handleConfirm = () => {
    updateReservation(reservation.id, { status: "confirmed" });
  };

  const handleCancel = () => {
    updateReservation(reservation.id, { status: "cancelled" });
  };

  const handleCheckIn = () => {
    completeCheckIn(reservation.id);
  };

  const handleAddGuest = () => {
    if (mode === "existing") {
      if (!selectedGuestId) return;
      if (selectedGuestId === reservation.guestId) return;
      if (additionalGuestIds.includes(selectedGuestId)) return;
      updateReservation(reservation.id, {
        additionalGuestIds: [...additionalGuestIds, selectedGuestId],
      });
      setSelectedGuestId("");
      setDialogOpen(false);
      return;
    }

    if (!newGuest.firstName || !newGuest.lastName) return;
    const newId = `guest-${Date.now()}`;
    addGuest({
      id: newId,
      firstName: newGuest.firstName,
      lastName: newGuest.lastName,
      documentType: newGuest.documentType,
      documentNumber: newGuest.documentNumber || "00000000",
      email: newGuest.email,
      phone: newGuest.phone || "000000000",
      nationality: "Peruana",
    });
    updateReservation(reservation.id, {
      additionalGuestIds: [...additionalGuestIds, newId],
    });
    setNewGuest({
      firstName: "",
      lastName: "",
      documentType: "DNI",
      documentNumber: "",
      email: "",
      phone: "",
    });
    setDialogOpen(false);
  };

  const handleSetPrimary = (guestId: string) => {
    if (guestId === reservation.guestId) return;
    const newPrimary = guests.find((guest) => guest.id === guestId);
    const filtered = additionalGuestIds.filter((id) => id !== guestId);
    const nextAdditional = reservation.guestId
      ? [...filtered, reservation.guestId]
      : filtered;

    updateReservation(reservation.id, {
      guestId: guestId,
      guestName: newPrimary ? `${newPrimary.firstName} ${newPrimary.lastName}` : reservation.guestName,
      additionalGuestIds: nextAdditional,
    });
  };

  const handleRemoveGuest = (guestId: string) => {
    updateReservation(reservation.id, {
      additionalGuestIds: additionalGuestIds.filter((id) => id !== guestId),
    });
  };

  const subtotal = reservation.total ? reservation.total / 1.18 : 0;
  const tax = reservation.total ? reservation.total - subtotal : 0;

  const timeline = [
    { label: "Reserva creada", date: reservation.createdAt },
    reservation.status === "confirmed"
      ? { label: "Reserva confirmada", date: reservation.checkIn }
      : null,
    reservation.status === "checkin"
      ? { label: "Check-in completado", date: reservation.actualCheckIn ?? reservation.checkIn }
      : null,
    reservation.status === "checkout"
      ? { label: "Check-out completado", date: reservation.actualCheckOut ?? reservation.checkOut }
      : null,
  ].filter(Boolean) as { label: string; date: string }[];

  const availableGuests = guests.filter(
    (guest) =>
      guest.id !== reservation.guestId &&
      !additionalGuestIds.includes(guest.id)
  );

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">Reserva</p>
            <h2 className="text-2xl font-semibold">{reservation.code}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              {reservation.checkIn} - {reservation.checkOut}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge type="reservation" status={reservation.status} />
            <Button
              variant="ghost"
              onClick={handleConfirm}
              disabled={reservation.status !== "pending"}
            >
              Confirmar
            </Button>
            <Button
              variant="ghost"
              onClick={handleCheckIn}
              disabled={reservation.status !== "confirmed"}
            >
              Check-in
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={reservation.status === "cancelled"}
            >
              Cancelar
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Habitacion</p>
            <p className="font-medium">#{reservation.roomNumber} {room?.type ? `· ${room.type}` : ""}</p>
          </div>
          <div>
            <p className="text-neutral-500">Noches</p>
            <p className="font-medium">{reservation.nights}</p>
          </div>
          <div>
            <p className="text-neutral-500">Huesped principal</p>
            <p className="font-medium">{reservation.guestName}</p>
          </div>
          <div>
            <p className="text-neutral-500">Total</p>
            <p className="font-medium">S/ {reservation.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Huespedes</h3>
          <Button onClick={() => setDialogOpen(true)}>Agregar huesped</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {primaryGuest ? (
              <TableRow key={primaryGuest.id}>
                <TableCell className="font-medium">
                  {primaryGuest.firstName} {primaryGuest.lastName}
                </TableCell>
                <TableCell>
                  {primaryGuest.documentType} {primaryGuest.documentNumber}
                </TableCell>
                <TableCell>{primaryGuest.email || "-"}</TableCell>
                <TableCell>{primaryGuest.phone}</TableCell>
                <TableCell>Principal</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ) : null}
            {additionalGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">
                  {guest.firstName} {guest.lastName}
                </TableCell>
                <TableCell>
                  {guest.documentType} {guest.documentNumber}
                </TableCell>
                <TableCell>{guest.email || "-"}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>Adicional</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleSetPrimary(guest.id)}>
                      Principal
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveGuest(guest.id)}>
                      Quitar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {additionalGuests.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            No hay huespedes adicionales registrados.
          </p>
        ) : null}
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="text-base font-semibold">Informacion financiera</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Subtotal</p>
            <p className="font-semibold">S/ {subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Impuestos</p>
            <p className="font-semibold">S/ {tax.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Total</p>
            <p className="font-semibold">S/ {reservation.total.toFixed(2)}</p>
          </div>
        </div>
        <Textarea
          placeholder="Notas internas"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="text-base font-semibold">Servicios adicionales</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          Sin servicios asociados. (Pendiente de integracion)
        </p>
        <Button variant="ghost">Agregar servicio</Button>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="text-base font-semibold">Historial</h3>
        <div className="space-y-2">
          {timeline.map((item, index) => (
            <div key={`${item.label}-${index}`} className="text-sm text-neutral-600 dark:text-neutral-300">
              {item.date} · {item.label}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar huesped</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={mode} onValueChange={(value) => setMode(value as "existing" | "new")}>
              <SelectTrigger>
                <SelectValue placeholder="Modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="existing">Seleccionar existente</SelectItem>
                <SelectItem value="new">Crear nuevo</SelectItem>
              </SelectContent>
            </Select>

            {mode === "existing" ? (
              <Select value={selectedGuestId} onValueChange={setSelectedGuestId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona huesped" />
                </SelectTrigger>
                <SelectContent>
                  {availableGuests.map((guest) => (
                    <SelectItem key={guest.id} value={guest.id}>
                      {guest.firstName} {guest.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nombres"
                  value={newGuest.firstName}
                  onChange={(event) =>
                    setNewGuest({ ...newGuest, firstName: event.target.value })
                  }
                />
                <Input
                  placeholder="Apellidos"
                  value={newGuest.lastName}
                  onChange={(event) =>
                    setNewGuest({ ...newGuest, lastName: event.target.value })
                  }
                />
                <Select
                  value={newGuest.documentType}
                  onValueChange={(value) =>
                    setNewGuest({ ...newGuest, documentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Numero de documento"
                  value={newGuest.documentNumber}
                  onChange={(event) =>
                    setNewGuest({ ...newGuest, documentNumber: event.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  value={newGuest.email}
                  onChange={(event) =>
                    setNewGuest({ ...newGuest, email: event.target.value })
                  }
                />
                <Input
                  placeholder="Telefono"
                  value={newGuest.phone}
                  onChange={(event) =>
                    setNewGuest({ ...newGuest, phone: event.target.value })
                  }
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddGuest}>Agregar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
