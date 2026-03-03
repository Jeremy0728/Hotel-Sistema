"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useReservations } from "@/hooks/useReservations";
import { useRooms } from "@/hooks/useRooms";
import { useGuests } from "@/hooks/useGuests";
import { useInvoices } from "@/hooks/useInvoices";
import { useReservationOperations } from "../hooks/useReservationOperations";
import ReservationFiltersCard from "./reservation-filters-card";
import ReservationTableRow from "./reservation-table-row";
import ReservationMobileCard from "./reservation-mobile-card";
import type { ReservationStatus } from "@/types/hotel";

export default function ReservationsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const paymentParam = searchParams.get("payment");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  // Obtener datos desde hooks individuales
  const { reservations: apiReservations, isLoading: reservationsLoading } = useReservations({ limit: 100 });
  const { rooms: apiRooms } = useRooms({ limit: 100 });
  const { guests: apiGuests } = useGuests({ limit: 100 });
  const { invoices: apiInvoices } = useInvoices({ limit: 100 });

  // Transformar reservaciones de API a formato local
  const transformedReservations = useMemo(
    () =>
      apiReservations.map((res) => ({
        id: String(res.id),
        code: res.confirmation_code,
        guestId: String(res.guest_id),
        guestName: res.guest
          ? `${res.guest.first_name} ${res.guest.last_name}`
          : "Huésped",
        roomId: String(res.room_id),
        roomNumber: String(res.room_id), // TODO: Obtener número real de habitación
        status: (res.status === "checked_in" ? "checkin" :
                 res.status === "checked_out" ? "checkout" :
                 res.status) as ReservationStatus,
        checkIn: res.check_in_date,
        checkOut: res.check_out_date,
        nights: Math.ceil(
          (new Date(res.check_out_date).getTime() - new Date(res.check_in_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        total: parseFloat(res.total_price),
        channel: "direct", // TODO: Agregar campo booking_source a la API
      })),
    [apiReservations]
  );

  // Transformar facturas de API a formato local
  const transformedInvoices = useMemo(
    () =>
      apiInvoices.map((inv) => ({
        id: String(inv.id),
        reservationCode: inv.reservation_id ? String(inv.reservation_id) : "",
        balance: parseFloat(inv.total) - parseFloat(inv.paid || "0"),
      })),
    [apiInvoices]
  );

  // Opciones para filtros
  const guestOptions = useMemo(
    () =>
      apiGuests.map((guest) => ({
        value: String(guest.id),
        label: `${guest.first_name} ${guest.last_name}`,
      })),
    [apiGuests]
  );

  const roomOptions = useMemo(
    () =>
      apiRooms.map((room) => ({
        value: String(room.id),
        label: `#${room.number}`,
      })),
    [apiRooms]
  );

  // Funciones CRUD temporales (TODO: implementar con APIs reales)
  const updateReservation = async (id: string, updates: Partial<{ status: ReservationStatus }>) => {
    console.log("Update reservation:", id, updates);
    // TODO: Implementar con API real
  };

  const completeCheckIn = async (id: string) => {
    console.log("Check-in:", id);
    // TODO: Implementar con API real
  };

  const completeCheckOut = async (id: string) => {
    console.log("Check-out:", id);
    // TODO: Implementar con API real
  };

  // Hook de operaciones de reservas
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    guestFilter,
    setGuestFilter,
    roomFilter,
    setRoomFilter,
    channelFilter,
    setChannelFilter,
    paymentFilter,
    setPaymentFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filteredReservations,
    applyView,
    handleConfirm,
    handleCancel,
    handleCheckIn,
    handleCheckOut,
  } = useReservationOperations({
    reservations: transformedReservations,
    invoices: transformedInvoices,
    updateReservation,
    completeCheckIn,
    completeCheckOut,
  });

  // Aplicar filtros de URL al cargar
  useMemo(() => {
    if (statusParam) {
      setStatusFilter(statusParam as ReservationStatus | "all");
    }
    if (paymentParam) {
      setPaymentFilter(paymentParam);
    }
    if (fromParam) {
      setDateFrom(fromParam);
    }
    if (toParam) {
      setDateTo(toParam);
    }
  }, [statusParam, paymentParam, fromParam, toParam, setStatusFilter, setPaymentFilter, setDateFrom, setDateTo]);

  if (reservationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReservationFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        roomFilter={roomFilter}
        setRoomFilter={setRoomFilter}
        guestFilter={guestFilter}
        setGuestFilter={setGuestFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        roomOptions={roomOptions}
        guestOptions={guestOptions}
        applyView={applyView}
      />

      {filteredReservations.length === 0 ? (
        <EmptyState
          title="Sin reservas"
          description="No hay reservas para mostrar con los filtros actuales."
          action={
            <Button asChild>
              <Link href="/reservations/new">Crear reserva</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Card className="p-4 hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Noches</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <ReservationTableRow
                    key={reservation.id}
                    reservation={reservation}
                    onConfirm={handleConfirm}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    onCancel={handleCancel}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-3 md:hidden">
            {filteredReservations.map((reservation) => (
              <ReservationMobileCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
