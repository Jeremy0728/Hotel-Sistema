"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { useHotelData } from "@/contexts/HotelDataContext";

const DRAFT_KEY = "hotel-reservation-draft";

type WizardStep = 1 | 2 | 3 | 4;

interface ReservationDraft {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  roomId: string;
  roomNumber: string;
  guestId: string;
  isNewGuest: boolean;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
  discount: number;
}

const defaultDraft: ReservationDraft = {
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
  roomType: "",
  roomId: "",
  roomNumber: "",
  guestId: "",
  isNewGuest: false,
  guestFirstName: "",
  guestLastName: "",
  guestEmail: "",
  guestPhone: "",
  notes: "",
  discount: 0,
};

export default function ReservationWizard() {
  const router = useRouter();
  const { rooms, guests, addReservation, addGuest } = useHotelData();
  const [step, setStep] = useState<WizardStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReservationDraft>(() => {
    if (typeof window === "undefined") return defaultDraft;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return defaultDraft;
    try {
      return { ...defaultDraft, ...JSON.parse(saved) } as ReservationDraft;
    } catch {
      return defaultDraft;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [draft]);

  const nights = useMemo(() => {
    if (!draft.checkIn || !draft.checkOut) return 0;
    const start = new Date(`${draft.checkIn}T00:00:00`);
    const end = new Date(`${draft.checkOut}T00:00:00`);
    const diff = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
    return diff;
  }, [draft.checkIn, draft.checkOut]);

  const roomTypes = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.type))),
    [rooms]
  );

  const availableRooms = rooms.filter(
    (room) =>
      room.status === "available" &&
      (draft.roomType ? room.type === draft.roomType : true)
  );

  const baseRate = draft.roomType === "Suite" ? 320 : draft.roomType === "Doble" ? 220 : 150;
  const subtotal = nights * baseRate;
  const discountAmount = subtotal * (draft.discount / 100);
  const taxable = subtotal - discountAmount;
  const tax = taxable * 0.18;
  const total = Math.max(0, Math.round(taxable + tax));

  const steps = ["Fechas", "Huésped", "Detalles", "Confirmación"];

  const handleNext = () => {
    if (step === 1) {
      if (!draft.checkIn || !draft.checkOut || !draft.roomId) {
        setError("Completa fechas y selecciona una habitación.");
        return;
      }
      setError(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      if (draft.isNewGuest) {
        if (!draft.guestFirstName || !draft.guestLastName) {
          setError("Completa el nombre del huésped.");
          return;
        }
      } else if (!draft.guestId) {
        setError("Selecciona un huésped.");
        return;
      }
      setError(null);
      setStep(3);
      return;
    }
    if (step === 3) {
      setError(null);
      setStep(4);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev));
  };

  const handleCreateReservation = () => {
    let guestId = draft.guestId;
    let guestName = "";

    if (draft.isNewGuest) {
      guestId = `guest-${Date.now()}`;
      guestName = `${draft.guestFirstName} ${draft.guestLastName}`;
      addGuest({
        id: guestId,
        firstName: draft.guestFirstName,
        lastName: draft.guestLastName,
        documentType: "DNI",
        documentNumber: "00000000",
        email: draft.guestEmail,
        phone: draft.guestPhone,
        nationality: "Peruana",
      });
    } else {
      const guest = guests.find((item) => item.id === draft.guestId);
      guestName = guest ? `${guest.firstName} ${guest.lastName}` : "";
    }

    addReservation({
      guestId,
      guestName,
      roomId: draft.roomId,
      roomNumber: draft.roomNumber,
      status: "pending",
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      nights,
      total,
      adults: draft.adults,
      children: draft.children,
      notes: draft.notes,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem(DRAFT_KEY);
    }
    router.push("/reservations");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          {steps.map((label, index) => {
            const stepNumber = (index + 1) as WizardStep;
            const active = step === stepNumber;
            return (
              <div
                key={label}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  active
                    ? "bg-primary text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-slate-700 dark:text-neutral-200"
                }`}
              >
                {stepNumber}. {label}
              </div>
            );
          })}
        </div>
        {error ? (
          <p className="text-sm text-red-500 mt-3">{error}</p>
        ) : null}
      </Card>

      {step === 1 ? (
        <Card className="p-5 space-y-4">
          <h3 className="text-lg font-semibold">Fechas y habitación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="date"
              value={draft.checkIn}
              onChange={(event) => setDraft({ ...draft, checkIn: event.target.value })}
            />
            <Input
              type="date"
              value={draft.checkOut}
              onChange={(event) => setDraft({ ...draft, checkOut: event.target.value })}
            />
            <Input
              type="number"
              min={1}
              value={draft.adults}
              onChange={(event) => setDraft({ ...draft, adults: Number(event.target.value) })}
              placeholder="Adultos"
            />
            <Input
              type="number"
              min={0}
              value={draft.children}
              onChange={(event) => setDraft({ ...draft, children: Number(event.target.value) })}
              placeholder="Niños"
            />
            <Select
              value={draft.roomType}
              onValueChange={(value) =>
                setDraft({ ...draft, roomType: value, roomId: "", roomNumber: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de habitación" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-neutral-500 dark:text-neutral-300">
              Noches: {nights || 0}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Habitaciones disponibles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableRooms.map((room) => (
                <Card
                  key={room.id}
                  className={`p-3 border cursor-pointer ${
                    draft.roomId === room.id
                      ? "border-primary"
                      : "border-neutral-200 dark:border-slate-700"
                  }`}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      roomId: room.id,
                      roomNumber: room.number,
                    })
                  }
                >
                  <p className="font-semibold">Habitación #{room.number}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-300">
                    {room.type} · Piso {room.floor}
                  </p>
                </Card>
              ))}
              {availableRooms.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                  No hay habitaciones disponibles con esos filtros.
                </p>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="p-5 space-y-4">
          <h3 className="text-lg font-semibold">Huésped</h3>
          <Select
            value={draft.guestId}
            onValueChange={(value) =>
              setDraft({ ...draft, guestId: value, isNewGuest: false })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona huésped" />
            </SelectTrigger>
            <SelectContent>
              {guests.map((guest) => (
                <SelectItem key={guest.id} value={guest.id}>
                  {guest.firstName} {guest.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setDraft({ ...draft, isNewGuest: !draft.isNewGuest, guestId: "" })
              }
            >
              {draft.isNewGuest ? "Usar huésped existente" : "Crear nuevo huésped"}
            </Button>
          </div>

          {draft.isNewGuest ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Nombres"
                value={draft.guestFirstName}
                onChange={(event) => setDraft({ ...draft, guestFirstName: event.target.value })}
              />
              <Input
                placeholder="Apellidos"
                value={draft.guestLastName}
                onChange={(event) => setDraft({ ...draft, guestLastName: event.target.value })}
              />
              <Input
                placeholder="Email"
                value={draft.guestEmail}
                onChange={(event) => setDraft({ ...draft, guestEmail: event.target.value })}
              />
              <Input
                placeholder="Teléfono"
                value={draft.guestPhone}
                onChange={(event) => setDraft({ ...draft, guestPhone: event.target.value })}
              />
            </div>
          ) : null}
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="p-5 space-y-4">
          <h3 className="text-lg font-semibold">Detalles</h3>
          <Textarea
            placeholder="Solicitudes especiales o notas internas"
            value={draft.notes}
            onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
          />
          <Input
            type="number"
            min={0}
            max={50}
            value={draft.discount}
            onChange={(event) =>
              setDraft({ ...draft, discount: Number(event.target.value) })
            }
            placeholder="Descuento (%)"
          />

          <Card className="p-4 bg-neutral-50 dark:bg-slate-800">
            <p className="text-sm font-semibold mb-2">Resumen de precios</p>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
              <div>Subtotal: S/ {subtotal}</div>
              <div>Descuento: -S/ {Math.round(discountAmount)}</div>
              <div>Impuestos (18%): S/ {Math.round(tax)}</div>
              <div className="font-semibold text-neutral-900 dark:text-white">
                Total: S/ {total}
              </div>
            </div>
          </Card>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card className="p-5 space-y-4">
          <h3 className="text-lg font-semibold">Confirmación</h3>
          <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
            <div>Check-in: {draft.checkIn}</div>
            <div>Check-out: {draft.checkOut}</div>
            <div>Noches: {nights}</div>
            <div>Habitación: #{draft.roomNumber || "Sin asignar"}</div>
            <div>Total: S/ {total}</div>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            El borrador se guarda automáticamente.
          </div>
        </Card>
      ) : null}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
          Anterior
        </Button>
        {step < 4 ? (
          <Button onClick={handleNext}>Siguiente</Button>
        ) : (
          <Button onClick={handleCreateReservation}>Crear reserva</Button>
        )}
      </div>
    </div>
  );
}
