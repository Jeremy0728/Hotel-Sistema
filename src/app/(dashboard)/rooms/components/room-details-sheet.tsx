"use client";

import { useRouter } from "next/navigation";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";
import StatusBadge from "@/components/hotel/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Reservation, Room, RoomSnapshot } from "@/types/hotel";
import { paxLabel } from "../utils/room-helpers";

interface RoomDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSnapshot: RoomSnapshot | null;
  drawerNotes: string;
  setDrawerNotes: (notes: string) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
}

export default function RoomDetailsSheet({
  open,
  onOpenChange,
  selectedSnapshot,
  drawerNotes,
  setDrawerNotes,
  updateRoom,
}: RoomDetailsSheetProps) {
  const router = useRouter();

  if (!selectedSnapshot) return null;

  const selectedReservation =
    selectedSnapshot.activeReservation ??
    selectedSnapshot.arrivalReservation ??
    selectedSnapshot.departureReservation ??
    selectedSnapshot.roomReservations[0];

  const reservationHistory = selectedSnapshot.roomReservations.filter(
    (reservation) => reservation.id !== selectedReservation?.id
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-neutral-200 p-4 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 p-3 dark:border-slate-700">
            <div>
              <SheetTitle>Habitacion #{selectedSnapshot.room.number}</SheetTitle>
              <SheetDescription>
                {selectedSnapshot.room.type} - Piso {selectedSnapshot.room.floor}
              </SheetDescription>
            </div>
            <StatusBadge type="room" status={selectedSnapshot.room.status} />
          </div>
        </SheetHeader>

        <div className="space-y-4 p-4">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3">
              <TabsTrigger value="current">Reserva actual</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
              <TabsTrigger value="housekeeping">Notas HK</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-3">
              {selectedReservation ? (
                <>
                  <Card className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{selectedReservation.guestName}</p>
                        <p className="text-neutral-500 dark:text-neutral-300">
                          Reserva {selectedReservation.code}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-300">
                          Check-in {selectedReservation.checkIn} - Check-out{" "}
                          {selectedReservation.checkOut}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-300">
                          {paxLabel(selectedReservation)}
                        </p>
                      </div>
                      <StatusBadge type="reservation" status={selectedReservation.status} />
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Facturacion</p>
                      {selectedSnapshot.pendingInvoice ? (
                        <InvoiceStatusBadge status={selectedSnapshot.pendingInvoice.status} />
                      ) : null}
                    </div>
                    <Separator className="my-2" />
                    {selectedSnapshot.pendingInvoice ? (
                      <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                        <p>Documento: {selectedSnapshot.pendingInvoice.number}</p>
                        <p>Total: S/ {selectedSnapshot.pendingInvoice.total}</p>
                        <p className="font-semibold text-rose-600">
                          Saldo pendiente: S/{" "}
                          {selectedSnapshot.pendingInvoice.balance}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-emerald-600">
                        Sin pagos pendientes para esta habitacion.
                      </p>
                    )}
                  </Card>
                </>
              ) : (
                <Card className="p-4 text-sm text-neutral-500 dark:text-neutral-300">
                  No hay reserva activa para esta habitacion.
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-2">
              {reservationHistory.length === 0 ? (
                <Card className="p-4 text-sm text-neutral-500 dark:text-neutral-300">
                  Sin historial registrado.
                </Card>
              ) : (
                reservationHistory.map((reservation) => (
                  <Card key={reservation.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm">
                        <p className="font-semibold">{reservation.guestName}</p>
                        <p className="text-neutral-500 dark:text-neutral-300">
                          {reservation.code} - {reservation.checkIn} a {reservation.checkOut}
                        </p>
                      </div>
                      <StatusBadge type="reservation" status={reservation.status} />
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="housekeeping" className="space-y-3">
              <Card className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Estado operativo</p>
                  <StatusBadge type="room" status={selectedSnapshot.room.status} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      updateRoom(selectedSnapshot.room.id, { status: "available" })
                    }
                  >
                    Marcar lista
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateRoom(selectedSnapshot.room.id, { status: "cleaning" })
                    }
                  >
                    En limpieza
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateRoom(selectedSnapshot.room.id, { status: "maintenance" })
                    }
                  >
                    Mantenimiento
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateRoom(selectedSnapshot.room.id, { status: "out_of_service" })
                    }
                  >
                    Fuera servicio
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Notas HK</p>
                  <Textarea
                    rows={5}
                    value={drawerNotes}
                    onChange={(event) => setDrawerNotes(event.target.value)}
                    placeholder="Notas internas de limpieza/mantenimiento"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDrawerNotes(selectedSnapshot.room.notes ?? "")}
                    >
                      Revertir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateRoom(selectedSnapshot.room.id, { notes: drawerNotes.trim() })
                      }
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="border-t border-neutral-200 p-4 dark:border-slate-800">
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={() => router.push("/reservations")}>
              Ver reservas
            </Button>
            <Button variant="outline" onClick={() => router.push("/invoices")}>
              Cobrar
            </Button>
            <Button onClick={() => router.push("/operaciones/habitaciones/configuracion")}>
              Ir a configuracion
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
