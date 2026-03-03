"use client";

import { LoaderCircle, AlertCircle } from "lucide-react";
import EmptyState from "@/components/hotel/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRooms } from "@/hooks/useRooms";
import { useReservations } from "@/hooks/useReservations";
import { useInvoices } from "@/hooks/useInvoices";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import { useRoomOperations } from "../hooks/useRoomOperations";
import { displayName, paxLabel, getContextLine } from "../utils/room-helpers";
import RoomFiltersCard from "./room-filters-card";
import RoomDetailsSheet from "./room-details-sheet";
import RoomOpsTile from "./room-ops-tile";

export default function RoomsPage() {
  // Obtener datos desde hooks individuales
  const { reservations } = useReservations({ limit: 100 });
  const { invoices } = useInvoices({ limit: 100 });
  const { settings: hotelSettings } = useHotelSettings();

  const {
    rooms: apiRooms,
    isLoading: roomsLoading,
    isError: roomsError,
    error: roomsErrorData,
    refreshRooms,
    updateRoomStatus,
  } = useRooms({ limit: 100 });

  // Transformar habitaciones de API a formato local
  const transformedRooms = apiRooms.map((room) => ({
    id: String(room.id),
    number: room.number,
    type: room.roomType?.name || "Standard",
    floor: room.floor,
    status: room.status,
    notes: room.notes,
  }));

  // Transformar reservations de API a formato local
  const transformedReservations = reservations.map((res) => ({
    id: String(res.id),
    code: res.confirmation_code,
    confirmation_code: res.confirmation_code,
    guestId: String(res.guest_id),
    guestName: res.huesped 
      ? `${res.huesped.nombres} ${res.huesped.apellido_paterno}` 
      : "Huésped",
    roomId: String(res.room_id),
    roomNumber: res.habitacion?.number || "",
    status: res.status === "checked_in" ? "checkin" as const : 
            res.status === "checked_out" ? "checkout" as const :
            res.status as "pending" | "confirmed" | "cancelled",
    checkIn: res.check_in_date,
    checkOut: res.check_out_date,
    nights: Math.ceil(
      (new Date(res.check_out_date).getTime() - new Date(res.check_in_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    ),
    total: parseFloat(res.total_price),
    adults: res.adults,
    children: res.children,
    notes: res.special_requests,
    createdAt: res.check_in_date,
  }));

  // Funciones CRUD temporales (TODO: implementar con APIs reales)
  const updateRoom = async (roomId: string, updates: Partial<{ status: string; notes?: string }>) => {
    if (updates.status) {
      await updateRoomStatus(Number(roomId), updates.status);
    }
    // TODO: Implementar actualización de notas cuando la API lo soporte
  };

  const completeCheckIn = async (reservationId: string) => {
    // TODO: Implementar con API real
    console.log("Check-in:", reservationId);
  };

  const completeCheckOut = async (reservationId: string) => {
    // TODO: Implementar con API real
    console.log("Check-out:", reservationId);
  };

  const {
    selectedFloor,
    setSelectedFloor,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedRoomId,
    drawerNotes,
    setDrawerNotes,
    floorSummaries,
    roomsByFloor,
    selectedSnapshot,
    counts,
    getQuickAction,
    openRoomDetails,
    closeRoomDetails,
  } = useRoomOperations({
    rooms: transformedRooms,
    reservations: transformedReservations,
    invoices,
    completeCheckIn,
    completeCheckOut,
    updateRoom,
  });

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-neutral-500">Cargando habitaciones...</p>
        </div>
      </div>
    );
  }

  if (roomsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h3 className="text-lg font-semibold">Error al cargar habitaciones</h3>
            <p className="text-sm text-neutral-500">
              {roomsErrorData?.msg || 'No se pudieron cargar las habitaciones. Por favor, intenta de nuevo.'}
            </p>
            <Button onClick={refreshRooms} variant="outline">
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RoomFiltersCard
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        floorSummaries={floorSummaries}
        counts={counts}
      />

      {roomsByFloor.length === 0 ? (
        <EmptyState
          title="Sin habitaciones para mostrar"
          description="Ajusta piso, estado o busqueda para continuar."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roomsByFloor.map((snapshot) => {
            const action = getQuickAction(snapshot);
            const guest =
              snapshot.activeReservation?.guestName ??
              snapshot.arrivalReservation?.guestName ??
              snapshot.departureReservation?.guestName;

            return (
              <RoomOpsTile
                key={snapshot.room.id}
                room={snapshot.room}
                guestName={guest ? displayName(guest) : undefined}
                paxLabel={paxLabel(snapshot.activeReservation ?? snapshot.arrivalReservation)}
                context={getContextLine(snapshot, hotelSettings.checkInTime, hotelSettings.checkOutTime)}
                hasPendingPayment={snapshot.hasPendingPayment}
                hasAlert={snapshot.hasAlert}
                quickLabel={action.label}
                onView={() => openRoomDetails(snapshot.room.id, snapshot.room.notes ?? "")}
                onQuick={action.execute}
              />
            );
          })}
        </div>
      )}

      <RoomDetailsSheet
        open={Boolean(selectedRoomId && selectedSnapshot)}
        onOpenChange={(open) => {
          if (!open) closeRoomDetails();
        }}
        selectedSnapshot={selectedSnapshot}
        drawerNotes={drawerNotes}
        setDrawerNotes={setDrawerNotes}
        updateRoom={updateRoom}
      />
    </div>
  );
}
