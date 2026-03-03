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
import StatusBadge from "@/components/hotel/status-badge";
import type { ReservationStatus } from "@/types/hotel";
import { useActiveTiposDocumento } from "@/hooks/useTiposDocumento";
import { useActiveMetodosPago } from "@/hooks/useMetodosPago";

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  roomNumber: string;
  nights: number;
  status: ReservationStatus;
}

interface Guest {
  email: string;
  phone: string;
}

interface Room {
  floor: number;
  roomType?: {
    name: string;
  };
}

interface CheckInForm {
  date: string;
  time: string;
  documentType: number;
  documentNumber: string;
  paymentMethod: number;
  deposit: number;
  notes: string;
}

interface CheckInDetailsCardProps {
  selectedReservation: Reservation | null;
  selectedGuest?: Guest;
  selectedRoom?: Room;
  form: CheckInForm;
  setForm: (form: CheckInForm) => void;
  error: string | null;
  success: string | null;
  processing: boolean;
  canComplete: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CheckInDetailsCard({
  selectedReservation,
  selectedGuest,
  selectedRoom,
  form,
  setForm,
  error,
  success,
  processing,
  canComplete,
  onComplete,
  onCancel,
}: CheckInDetailsCardProps) {
  console.log("🚀 ~ CheckInDetailsCard ~ form:", form)
  // Usar hooks personalizados para obtener datos
  const { documentTypes, isLoading: loadingDocTypes } = useActiveTiposDocumento();
  const { paymentMethods, isLoading: loadingPaymentMethods } = useActiveMetodosPago();

  return (
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
            <div>Huésped: {selectedReservation.guestName}</div>
            <div>Habitación: #{selectedReservation.roomNumber}</div>
            <div>Noches: {selectedReservation.nights}</div>
          </div>

          <Card className="p-3 bg-neutral-50 dark:bg-slate-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Contacto
            </div>
            <div className="text-sm">
              {selectedGuest?.email || "Sin email"} · {selectedGuest?.phone || "Sin teléfono"}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <Select
              value={form.documentType.toString()}
              onValueChange={(value) => setForm({ ...form, documentType: parseInt(value, 10) })}
              disabled={loadingDocTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingDocTypes ? "Cargando..." : "Tipo de documento"} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((docType) => (
                  <SelectItem key={docType.id} value={docType.id.toString()}>
                    {docType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Número de documento"
              value={form.documentNumber}
              onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
            />
            <Select
              value={form.paymentMethod.toString()}
              onValueChange={(value) => setForm({ ...form, paymentMethod: parseInt(value, 10) })}
              disabled={loadingPaymentMethods}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingPaymentMethods ? "Cargando..." : "Método de pago"} />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id.toString()}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              placeholder="Depósito (S/)"
              value={form.deposit}
              onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })}
            />
          </div>

          <Textarea
            placeholder="Notas internas"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Habitación actual: {selectedRoom?.roomType?.name || "N/A"} · Piso {selectedRoom?.floor ?? "-"}
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button onClick={onComplete} disabled={processing || !canComplete}>
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
  );
}
