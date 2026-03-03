"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useReservations } from "@/hooks/useReservations";
import { useRooms } from "@/hooks/useRooms";
import { useGuests } from "@/hooks/useGuests";
import { useCheckInOperations } from "../hooks/useCheckInOperations";
import CheckInFiltersCard from "./checkin-filters-card";
import CheckInTableRow from "./checkin-table-row";
import CheckInDetailsCard from "./checkin-details-card";
import type { ReservationStatus } from "@/types/hotel";

export default function CheckInPage() {
  // Obtener datos desde hooks individuales
  const { reservations: apiReservations, isLoading: reservationsLoading, mutate: refreshReservations } = useReservations({ limit: 100 });
  const { rooms: apiRooms } = useRooms({ limit: 100 });
  const { guests: apiGuests } = useGuests({ limit: 100 });

  // Transformar reservaciones de API a formato local
  const transformedReservations = useMemo(
    () =>
      apiReservations.map((res) => ({
        id: String(res.id),
        code: res.confirmation_code,
        guestId: String(res.guest_id),
        guestName: res.guest
          ? `${res.guest.nombres} ${res.guest.apellido_paterno} ${res.guest.apellido_materno || ""}`
          : "Huésped",
        roomId: String(res.room_id),
        roomNumber: res.room?.number || String(res.room_id),
        status: (res.status === "checked_in" ? "checkin" :
                 res.status === "checked_out" ? "checkout" :
                 res.status) as ReservationStatus,
        checkIn: res.check_in_date,
        checkOut: res.check_out_date,
        nights: Math.ceil(
          (new Date(res.check_out_date).getTime() - new Date(res.check_in_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      })),
    [apiReservations]
  );

  // Hook de operaciones de check-in
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedId,
    form,
    setForm,
    processing,
    error,
    success,
    todayStr,
    filteredReservations,
    selectedReservation,
    selectedGuest,
    selectedRoom,
    canComplete,
    handleSelect,
    handleComplete,
    handleCancel,
  } = useCheckInOperations({
    reservations: transformedReservations,
    guests: apiGuests,
    rooms: apiRooms,
    onSuccess: refreshReservations,
  });

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
      <CheckInFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        todayStr={todayStr}
      />

      {filteredReservations.length === 0 ? (
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
                {filteredReservations.map((reservation) => (
                  <CheckInTableRow
                    key={reservation.id}
                    reservation={reservation}
                    isSelected={reservation.id === selectedId}
                    onSelect={handleSelect}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>

          <CheckInDetailsCard
            selectedReservation={selectedReservation}
            selectedGuest={selectedGuest}
            selectedRoom={selectedRoom}
            form={form}
            setForm={setForm}
            error={error}
            success={success}
            processing={processing}
            canComplete={canComplete}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
