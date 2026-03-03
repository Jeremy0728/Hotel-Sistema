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
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/hotel/status-badge";
import type { ReservationStatus } from "@/types/hotel";

const paymentOptions = ["Efectivo", "Tarjeta", "Transferencia", "Mixto"] as const;

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  roomNumber: string;
  nights: number;
  checkOut: string;
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

interface CheckOutForm {
  date: string;
  time: string;
  paymentMethod: string;
  manualCharge: number;
  discount: number;
  notes: string;
}

interface ExtraOption {
  id: string;
  label: string;
  amount: number;
}

interface CheckOutDetailsCardProps {
  selectedReservation: Reservation | null;
  selectedGuest?: Guest;
  selectedRoom?: Room;
  form: CheckOutForm;
  setForm: (form: CheckOutForm) => void;
  extras: string[];
  extraOptions: readonly ExtraOption[];
  onToggleExtra: (id: string) => void;
  baseTotal: number;
  extrasTotal: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  error: string | null;
  success: string | null;
  processing: boolean;
  canComplete: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CheckOutDetailsCard({
  selectedReservation,
  selectedGuest,
  selectedRoom,
  form,
  setForm,
  extras,
  extraOptions,
  onToggleExtra,
  baseTotal,
  extrasTotal,
  subtotal,
  discountAmount,
  total,
  error,
  success,
  processing,
  canComplete,
  onComplete,
  onCancel,
}: CheckOutDetailsCardProps) {
  return (
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
            <div>Huésped: {selectedReservation.guestName}</div>
            <div>Habitación: #{selectedReservation.roomNumber}</div>
            <div>Noches: {selectedReservation.nights}</div>
            <div>Check-out programado: {selectedReservation.checkOut}</div>
          </div>

          <Card className="p-3 bg-neutral-50 dark:bg-slate-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Contacto</div>
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
              value={form.paymentMethod}
              onValueChange={(value) => setForm({ ...form, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Método de pago" />
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
              onChange={(e) => setForm({ ...form, manualCharge: Number(e.target.value) })}
            />
            <Input
              type="number"
              min={0}
              max={50}
              placeholder="Descuento (%)"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
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
                    onCheckedChange={() => onToggleExtra(extra.id)}
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
              {processing ? "Procesando..." : "Completar check-out"}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-sm text-neutral-500 dark:text-neutral-300">
          Selecciona una reserva para cerrar la estadía.
        </div>
      )}
    </Card>
  );
}
