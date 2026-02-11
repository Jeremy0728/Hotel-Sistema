"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/hotel/empty-state";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";

const paymentOptions = ["Efectivo", "Tarjeta", "Transferencia", "Mixto"] as const;

const extraOptions = [
  { id: "minibar", label: "Consumo minibar", amount: 40 },
  { id: "laundry", label: "Lavanderia", amount: 35 },
  { id: "late", label: "Late check-out", amount: 60 },
] as const;

export default function CheckOutPage() {
  const { reservations, guests, rooms, completeCheckOut, updateReservation } = useHotelData();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [form, setForm] = useState({
    date: todayStr,
    time: "12:00",
    paymentMethod: "Tarjeta",
    manualCharge: 0,
    discount: 0,
    notes: "",
  });
  const [extras, setExtras] = useState<string[]>([]);

  const filtered = reservations.filter((reservation) => {
    if (reservation.status !== "checkin") return false;
    const query = search.toLowerCase();
    return (
      reservation.code.toLowerCase().includes(query) ||
      reservation.guestName.toLowerCase().includes(query) ||
      reservation.roomNumber.toLowerCase().includes(query)
    );
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
  const canComplete = selectedReservation?.status === "checkin";

  const extrasTotal = useMemo(() => {
    return extraOptions.reduce((sum, extra) => {
      return extras.includes(extra.id) ? sum + extra.amount : sum;
    }, 0);
  }, [extras]);

  const baseTotal = selectedReservation?.total ?? 0;
  const subtotal = baseTotal + extrasTotal + form.manualCharge;
  const discountAmount = Math.round(subtotal * (form.discount / 100));
  const total = Math.max(0, subtotal - discountAmount);

  const handleToggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setForm({
      date: todayStr,
      time: "12:00",
      paymentMethod: "Tarjeta",
      manualCharge: 0,
      discount: 0,
      notes: "",
    });
    setExtras([]);
    setError(null);
    setSuccess(null);
  };

  const handleComplete = () => {
    if (!selectedReservation) {
      setError("Selecciona una reserva para completar el check-out.");
      return;
    }
    if (selectedReservation.status !== "checkin") {
      setError("La reserva ya fue cerrada.");
      return;
    }

    setProcessing(true);
    completeCheckOut(selectedReservation.id);

    const extraLabels = extraOptions
      .filter((extra) => extras.includes(extra.id))
      .map((extra) => extra.label);

    const notesParts: string[] = [];
    if (selectedReservation.notes) notesParts.push(selectedReservation.notes);
    if (form.notes) notesParts.push(form.notes);
    if (extraLabels.length) notesParts.push(`Extras: ${extraLabels.join(", ")}`);
    if (form.manualCharge > 0) notesParts.push(`Cargo manual: S/ ${form.manualCharge}`);
    if (form.discount > 0) notesParts.push(`Descuento: ${form.discount}%`);
    notesParts.push(`Pago: ${form.paymentMethod}`);

    updateReservation(selectedReservation.id, {
      actualCheckOut: form.date,
      total,
      notes: notesParts.join(" | "),
    });

    setProcessing(false);
    setSuccess("Check-out completado. Habitacion en limpieza.");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Check-out</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Cierre de estadia, cargos finales y facturacion
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Buscar por codigo, huesped o habitacion"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Input type="date" value={todayStr} readOnly />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin check-outs pendientes"
          description="No hay reservas con check-in activo para cerrar."
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
              <h3 className="text-lg font-semibold">Detalle de check-out</h3>
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
                  <div>Check-out programado: {selectedReservation.checkOut}</div>
                </div>

                <Card className="p-3 bg-neutral-50 dark:bg-slate-800">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Contacto</div>
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
                    placeholder="Cargo manual (S/)"
                    value={form.manualCharge}
                    onChange={(event) =>
                      setForm({ ...form, manualCharge: Number(event.target.value) })
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="Descuento (%)"
                    value={form.discount}
                    onChange={(event) =>
                      setForm({ ...form, discount: Number(event.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Cargos adicionales</p>
                  {extraOptions.map((extra) => (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`extra-${extra.id}`}
                          checked={extras.includes(extra.id)}
                          onCheckedChange={() => handleToggleExtra(extra.id)}
                        />
                        <Label htmlFor={`extra-${extra.id}`}>{extra.label}</Label>
                      </div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-300">
                        S/ {extra.amount}
                      </span>
                    </div>
                  ))}
                </div>

                <Card className="p-3 bg-neutral-50 dark:bg-slate-800">
                  <p className="text-sm font-semibold mb-2">Preview factura</p>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Hospedaje</span>
                      <span>S/ {baseTotal}</span>
                    </div>
                    {extrasTotal > 0 ? (
                      <div className="flex items-center justify-between">
                        <span>Extras</span>
                        <span>S/ {extrasTotal}</span>
                      </div>
                    ) : null}
                    {form.manualCharge > 0 ? (
                      <div className="flex items-center justify-between">
                        <span>Otros cargos</span>
                        <span>S/ {form.manualCharge}</span>
                      </div>
                    ) : null}
                    {form.discount > 0 ? (
                      <div className="flex items-center justify-between">
                        <span>Descuento</span>
                        <span>-S/ {discountAmount}</span>
                      </div>
                    ) : null}
                    <Separator />
                    <div className="flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                      <span>Total</span>
                      <span>S/ {total}</span>
                    </div>
                  </div>
                </Card>

                <Textarea
                  placeholder="Notas finales"
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
                    {processing ? "Procesando..." : "Completar check-out"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-neutral-500 dark:text-neutral-300">
                Selecciona una reserva para cerrar la estadia.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
