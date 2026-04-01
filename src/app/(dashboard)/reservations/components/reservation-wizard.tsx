"use client";

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
import { useRooms } from "@/hooks/useRooms";
import { useGuests } from "@/hooks/useGuests";
import { useReservationWizard } from "../hooks/useReservationWizard";

type WizardStep = 1 | 2 | 3 | 4;

export default function ReservationWizard() {
  // Obtener datos desde hooks
  const { rooms: apiRooms, isLoading: roomsLoading } = useRooms({ limit: 100 });
  const { guests: apiGuests, isLoading: guestsLoading } = useGuests({ limit: 100 });

  // Mapear datos de API al formato esperado por el wizard
  const rooms = apiRooms.map(room => ({
    id: room.id,
    number: room.number,
    type: room.roomType?.name || 'Standard',
    floor: room.floor,
    status: room.status as string,
    roomType: room.roomType, // Incluir roomType completo con precios
  }));

  const guests = apiGuests.map(guest => ({
    id: guest.id,
    nombres: guest.nombres,
    apellido_paterno: guest.apellido_paterno,
    apellido_materno: guest.apellido_materno,
    email: guest.email,
    phone: guest.phone,
  }));

  // Hook del wizard
  const {
    step,
    error,
    draft,
    isSubmitting,
    nights,
    roomTypes,
    availableRooms,
    subtotal,
    discountAmount,
    tax,
    total,
    saveDraft,
    handleNext,
    handleBack,
    handleCreateReservation,
  } = useReservationWizard({ rooms, guests });

  const steps = ["Fechas", "Huésped", "Detalles", "Confirmación"];

  if (roomsLoading || guestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando...</p>
        </div>
      </div>
    );
  }

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
            <div>
              <label className="text-sm font-medium mb-1 block">Check-in</label>
              <Input
                type="date"
                value={draft.checkIn}
                onChange={(event) => saveDraft({ ...draft, checkIn: event.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Check-out</label>
              <Input
                type="date"
                value={draft.checkOut}
                onChange={(event) => saveDraft({ ...draft, checkOut: event.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Adultos</label>
              <Input
                type="number"
                min={1}
                value={draft.adults}
                onChange={(event) => saveDraft({ ...draft, adults: Number(event.target.value) })}
                placeholder="Adultos"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Niños</label>
              <Input
                type="number"
                min={0}
                value={draft.children}
                onChange={(event) => saveDraft({ ...draft, children: Number(event.target.value) })}
                placeholder="Niños"
              />
            </div>
            <Select
              value={draft.roomType}
              onValueChange={(value) =>
                saveDraft({ ...draft, roomType: value, roomId: "", roomNumber: "" })
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
                    draft.roomId === room.id.toString()
                      ? "border-primary"
                      : "border-neutral-200 dark:border-slate-700"
                  }`}
                  onClick={() =>
                    saveDraft({
                      ...draft,
                      roomId: room.id.toString(),
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
              saveDraft({ ...draft, guestId: value, isNewGuest: false })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona huésped" />
            </SelectTrigger>
            <SelectContent>
              {guests.map((guest) => (
                <SelectItem key={guest.id} value={guest.id.toString()}>
                  {guest.nombres} {guest.apellido_paterno}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                saveDraft({ ...draft, isNewGuest: !draft.isNewGuest, guestId: "" })
              }
            >
              {draft.isNewGuest ? "Usar huésped existente" : "Crear nuevo huésped"}
            </Button>
          </div>

          {draft.isNewGuest ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombres</label>
                <Input
                  placeholder="Nombres"
                  value={draft.guestFirstName}
                  onChange={(event) => saveDraft({ ...draft, guestFirstName: event.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Apellidos</label>
                <Input
                  placeholder="Apellidos"
                  value={draft.guestLastName}
                  onChange={(event) => saveDraft({ ...draft, guestLastName: event.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  placeholder="Email"
                  value={draft.guestEmail}
                  onChange={(event) => saveDraft({ ...draft, guestEmail: event.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Teléfono</label>
                <Input
                  placeholder="Teléfono"
                  value={draft.guestPhone}
                  onChange={(event) => saveDraft({ ...draft, guestPhone: event.target.value })}
                />
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="p-5 space-y-4">
          <h3 className="text-lg font-semibold">Detalles</h3>
          <div>
            <label className="text-sm font-medium mb-1 block">Notas</label>
            <Textarea
              placeholder="Solicitudes especiales o notas internas"
              value={draft.notes}
              onChange={(event) => saveDraft({ ...draft, notes: event.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descuento (%)</label>
            <Input
              type="number"
              min={0}
              max={50}
              value={draft.discount}
              onChange={(event) =>
                saveDraft({ ...draft, discount: Number(event.target.value) })
              }
              placeholder="Descuento (%)"
            />
          </div>

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
          <Button onClick={handleCreateReservation} disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear reserva"}
          </Button>
        )}
      </div>
    </div>
  );
}
