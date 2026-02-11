"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";

const MAX_ITEMS = 5;

function formatTime(time?: string) {
  if (!time) return "--:--";
  return time;
}

function paymentMeta(balance?: number) {
  if (balance === undefined) {
    return { label: "Sin factura", variant: "info" as const };
  }
  if (balance > 0) {
    return { label: "Pendiente", variant: "warning" as const };
  }
  return { label: "Pagado", variant: "success" as const };
}

export default function ShiftCenter() {
  const {
    reservations,
    invoices,
    hotelSettings,
    completeCheckIn,
    completeCheckOut,
  } = useHotelData();
  const todayStr = new Date().toISOString().split("T")[0];

  const arrivals = reservations
    .filter(
      (reservation) =>
        reservation.checkIn === todayStr &&
        (reservation.status === "pending" || reservation.status === "confirmed")
    )
    .slice(0, MAX_ITEMS);

  const departures = reservations
    .filter(
      (reservation) =>
        reservation.checkOut === todayStr && reservation.status === "checkin"
    )
    .slice(0, MAX_ITEMS);

  const findInvoiceBalance = (code?: string) => {
    if (!code) return undefined;
    const invoice = invoices.find((entry) => entry.reservationCode === code);
    return invoice?.balance;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Llegadas hoy</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              {arrivals.length} programadas
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {arrivals.map((reservation) => {
            const payment = paymentMeta(findInvoiceBalance(reservation.code));
            return (
              <div
                key={reservation.id}
                className="flex flex-col gap-3 rounded-lg border border-neutral-200 dark:border-slate-700 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{reservation.guestName}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-300">
                      Habitación #{reservation.roomNumber}
                    </p>
                  </div>
                  <StatusBadge type="reservation" status={reservation.status} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-300">
                  <span>Hora: {formatTime(hotelSettings.checkInTime)}</span>
                  <Badge variant={payment.variant}>{payment.label}</Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => completeCheckIn(reservation.id)}
                  >
                    Check-in rápido
                  </Button>
                </div>
              </div>
            );
          })}
          {arrivals.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-300 text-center">
              No hay llegadas para hoy.
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Salidas hoy</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              {departures.length} programadas
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {departures.map((reservation) => {
            const payment = paymentMeta(findInvoiceBalance(reservation.code));
            return (
              <div
                key={reservation.id}
                className="flex flex-col gap-3 rounded-lg border border-neutral-200 dark:border-slate-700 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{reservation.guestName}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-300">
                      Habitación #{reservation.roomNumber}
                    </p>
                  </div>
                  <Badge
                    variant={payment.variant}
                    className={cn(payment.variant === "warning" && "animate-pulse")}
                  >
                    {payment.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-300">
                  <span>Hora: {formatTime(hotelSettings.checkOutTime)}</span>
                  <StatusBadge type="reservation" status={reservation.status} />
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => completeCheckOut(reservation.id)}
                  >
                    Check-out rápido
                  </Button>
                </div>
              </div>
            );
          })}
          {departures.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-300 text-center">
              No hay salidas para hoy.
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
