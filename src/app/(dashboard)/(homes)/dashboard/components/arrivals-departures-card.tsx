import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReservationStatus } from "@/types/hotel";

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  roomNumber: string;
  status: ReservationStatus;
}

interface Invoice {
  reservationCode?: string;
  balance: number;
  total: number;
}

interface ArrivalsDeparturesCardProps {
  arrivalsToday: Reservation[];
  departuresToday: Reservation[];
  invoiceByReservation: Map<string, Invoice>;
  hotelSettings: {
    checkInTime: string;
    checkOutTime: string;
  };
  paymentMeta: (invoice?: Invoice) => { label: string; variant: "success" | "warning" | "info" };
  reservationStatusLabel: (status: ReservationStatus) => string;
  completeCheckIn: (reservationId: string) => Promise<void>;
  completeCheckOut: (reservationId: string) => Promise<void>;
}

export default function ArrivalsDeparturesCard({
  arrivalsToday,
  departuresToday,
  invoiceByReservation,
  hotelSettings,
  paymentMeta,
  reservationStatusLabel,
  completeCheckIn,
  completeCheckOut,
}: ArrivalsDeparturesCardProps) {
  const router = useRouter();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-semibold">Hoy</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Llegadas y salidas ordenadas para recepcion
          </p>
        </div>
      </div>

      <Tabs defaultValue="arrivals" className="w-full">
        <TabsList className="grid w-full h-auto grid-cols-2">
          <TabsTrigger value="arrivals">Llegadas ({arrivalsToday.length})</TabsTrigger>
          <TabsTrigger value="departures">Salidas ({departuresToday.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="arrivals" className="space-y-2 mt-3">
          {arrivalsToday.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
              No hay llegadas hoy.
            </div>
          ) : (
            arrivalsToday.slice(0, 6).map((reservation) => {
              const payment = paymentMeta(invoiceByReservation.get(reservation.code));
              return (
                <div
                  key={reservation.id}
                  className="rounded-lg border border-neutral-200 p-3 dark:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{reservation.guestName}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">
                        Hab. #{reservation.roomNumber} · {hotelSettings.checkInTime} · {reservationStatusLabel(reservation.status)}
                      </p>
                    </div>
                    <Badge variant={payment.variant}>{payment.label}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/reservations/${reservation.id}`)}
                    >
                      Ver reserva
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => completeCheckIn(reservation.id)}
                      disabled={
                        reservation.status !== "pending" && reservation.status !== "confirmed"
                      }
                    >
                      Check-in rapido
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="departures" className="space-y-2 mt-3">
          {departuresToday.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
              No hay salidas hoy.
            </div>
          ) : (
            departuresToday.slice(0, 6).map((reservation) => {
              const payment = paymentMeta(invoiceByReservation.get(reservation.code));
              return (
                <div
                  key={reservation.id}
                  className="rounded-lg border border-neutral-200 p-3 dark:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{reservation.guestName}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">
                        Hab. #{reservation.roomNumber} · {hotelSettings.checkOutTime} · {reservationStatusLabel(reservation.status)}
                      </p>
                    </div>
                    <Badge variant={payment.variant}>{payment.label}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/reservations/${reservation.id}`)}
                    >
                      Ver reserva
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => completeCheckOut(reservation.id)}
                      disabled={reservation.status !== "checkin"}
                    >
                      Check-out rapido
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
