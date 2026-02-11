"use client";

import { useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/hotel/empty-state";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { ReservationStatus } from "@/types/hotel";

const statusOptions: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "pending", label: "Pendientes" },
];

const paymentOptions = ["Efectivo", "Tarjeta", "Transferencia", "Mixto"] as const;
const documentOptions = ["DNI", "Pasaporte", "Carnet Ext."] as const;

export default function CheckInPage() {
  const { reservations, guests, rooms, completeCheckIn, updateReservation } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [form, setForm] = useState({
    date: todayStr,
    time: "15:00",
    documentType: "DNI",
    documentNumber: "",
    paymentMethod: "Tarjeta",
    deposit: 0,
    notes: "",
  });

  const eligibleStatuses: ReservationStatus[] = ["confirmed", "pending"];

  const filtered = reservations.filter((reservation) => {
    if (!eligibleStatuses.includes(reservation.status)) return false;
    const query = search.toLowerCase();
    const matchesSearch =
      reservation.code.toLowerCase().includes(query) ||
      reservation.guestName.toLowerCase().includes(query) ||
      reservation.roomNumber.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" ? true : reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedReservation = useMemo(
    () => reservations.find((reservation) => reservation.id === selectedId) ?? null,
    [reservations, selectedId]
  );

  const selectedGuest = selectedReservation
    ? guests.find((guest) => guest.id === selectedReservation.guestId)
    : undefined;
  const selectedRoom = selectedReservation
    ? rooms.find((room) => room.id === selectedReservation.roomId)
    : undefined;
  const canComplete =
    selectedReservation && eligibleStatuses.includes(selectedReservation.status);

  const handleSelect = (id: string) => {
    const reservation = reservations.find((item) => item.id === id);
    const guest = reservation
      ? guests.find((item) => item.id === reservation.guestId)
      : undefined;
    setSelectedId(id);
    setForm({
      date: reservation?.checkIn || todayStr,
      time: "15:00",
      documentType: guest?.documentType ?? "DNI",
      documentNumber: guest?.documentNumber ?? "",
      paymentMethod: "Tarjeta",
      deposit: 0,
      notes: "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleComplete = () => {
    if (!selectedReservation) {
      setError("Selecciona una reserva para completar el check-in.");
      return;
    }
    if (!eligibleStatuses.includes(selectedReservation.status)) {
      setError("La reserva ya fue procesada.");
      return;
    }
    if (!form.documentNumber) {
      setError("Completa el documento del huesped.");
      return;
    }

    setProcessing(true);
    completeCheckIn(selectedReservation.id);

    const notesParts: string[] = [];
    if (selectedReservation.notes) notesParts.push(selectedReservation.notes);
    if (form.notes) notesParts.push(form.notes);
    if (form.deposit > 0) {
      notesParts.push(`Deposito: S/ ${form.deposit} (${form.paymentMethod})`);
    }

    updateReservation(selectedReservation.id, {
      actualCheckIn: form.date,
      notes: notesParts.length ? notesParts.join(" | ") : selectedReservation.notes,
    });

    setProcessing(false);
    setSuccess("Check-in completado. Habitacion marcada como ocupada.");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Check-in</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Gestiona la llegada de huespedes y asigna la habitacion
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Buscar por codigo, huesped o habitacion"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ReservationStatus | "all")}
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
          <Input type="date" value={todayStr} readOnly />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin reservas para check-in"
          description="No hay reservas confirmadas o pendientes para procesar."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-4 xl:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Huesped</TableHead>
                  <TableHead>Habitacion</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.code}</TableCell>
                    <TableCell>{reservation.guestName}</TableCell>
                    <TableCell>#{reservation.roomNumber}</TableCell>
                    <TableCell>{reservation.checkIn}</TableCell>
                    <TableCell>
                      <StatusBadge type="reservation" status={reservation.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={reservation.id === selectedId ? "default" : "ghost"}
                        onClick={() => handleSelect(reservation.id)}
                      >
                        {reservation.id === selectedId ? "Seleccionada" : "Seleccionar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalle de check-in</h3>
              {selectedReservation ? (
                <StatusBadge type="reservation" status={selectedReservation.status} />
              ) : null}
            </div>

            {selectedReservation ? (
              <>
                <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                  <div>Reserva: {selectedReservation.code}</div>
                  <div>Huesped: {selectedReservation.guestName}</div>
                  <div>Habitacion: #{selectedReservation.roomNumber}</div>
                  <div>Noches: {selectedReservation.nights}</div>
                </div>

                <Card className="p-3 bg-neutral-50 dark:bg-slate-800">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    Contacto
                  </div>
                  <div className="text-sm">
                    {selectedGuest?.email || "Sin email"} · {selectedGuest?.phone || "Sin telefono"}
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                  />
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(event) => setForm({ ...form, time: event.target.value })}
                  />
                  <Select
                    value={form.documentType}
                    onValueChange={(value) => setForm({ ...form, documentType: value })}
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
                    value={form.documentNumber}
                    onChange={(event) => setForm({ ...form, documentNumber: event.target.value })}
                  />
                  <Select
                    value={form.paymentMethod}
                    onValueChange={(value) => setForm({ ...form, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Metodo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Deposito (S/)"
                    value={form.deposit}
                    onChange={(event) =>
                      setForm({ ...form, deposit: Number(event.target.value) })
                    }
                  />
                </div>

                <Textarea
                  placeholder="Notas internas"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                />

                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Habitacion actual: {selectedRoom?.type || "N/A"} · Piso {selectedRoom?.floor ?? "-"}
                </div>

                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedId(null)}
                    disabled={processing}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleComplete} disabled={processing || !canComplete}>
                    {processing ? "Procesando..." : "Completar check-in"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-neutral-500 dark:text-neutral-300">
                Selecciona una reserva para registrar la llegada.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
