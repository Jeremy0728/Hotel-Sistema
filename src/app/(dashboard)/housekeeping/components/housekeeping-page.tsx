"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { useHousekeepingOperations } from "../hooks/useHousekeepingOperations";
import HousekeepingFiltersCard from "./housekeeping-filters-card";
import HousekeepingRoomCard from "./housekeeping-room-card";
import HousekeepingFloorView from "./housekeeping-floor-view";
import type { RoomStatus } from "@/types/hotel";


export default function HousekeepingPage() {
  // Obtener datos desde hook useRooms
  const { rooms: apiRooms, isLoading: roomsLoading, refreshRooms } = useRooms({ limit: 100 });

  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const floorParam = searchParams.get("floor");
  const viewParam = searchParams.get("view");

  const initialStatusFilter: RoomStatus | "all" =
    statusParam === "all" || statusParam === "cleaning" || statusParam === "occupied" ||
    statusParam === "available" || statusParam === "maintenance" || statusParam === "out_of_service"
      ? (statusParam as RoomStatus | "all")
      : "cleaning";
  const parsedFloor = floorParam ? Number(floorParam) : NaN;
  const initialFloorFilter: number | "all" = Number.isNaN(parsedFloor)
    ? "all"
    : parsedFloor;
  const initialViewMode: "floor" | "list" =
    viewParam === "list" || viewParam === "floor" ? viewParam : "floor";

  // Hook de operaciones de housekeeping
  const {
    statusFilter,
    setStatusFilter,
    floorFilter,
    setFloorFilter,
    priorityFilter,
    setPriorityFilter,
    viewMode,
    setViewMode,
    assignments,
    priorities,
    floors,
    housekeepingRooms,
    groupedByFloor,
    handleAssign,
    handlePriority,
    handleMarkClean,
    handleBlock,
  } = useHousekeepingOperations({
    rooms: apiRooms,
    refreshRooms,
    initialStatusFilter,
    initialFloorFilter,
    initialViewMode,
  });

  const outOfServiceCount = useMemo(
    () => apiRooms.filter((room) => room.status === "out_of_service").length,
    [apiRooms]
  );

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando habitaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HousekeepingFiltersCard
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        floors={floors}
        outOfServiceCount={outOfServiceCount}
      />

      {viewMode === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {housekeepingRooms.map((room) => {
            const priority = priorities[room.id] ?? "media";
            return (
              <HousekeepingRoomCard
                key={room.id}
                room={room}
                priority={priority}
                assignment={assignments[room.id]}
                onAssign={handleAssign}
                onPriorityChange={handlePriority}
                onMarkClean={handleMarkClean}
                onBlock={handleBlock}
              />
            );
          })}
        </div>
      ) : (
        <HousekeepingFloorView
          groupedByFloor={groupedByFloor}
          priorities={priorities}
          assignments={assignments}
          onMarkClean={handleMarkClean}
          onBlock={handleBlock}
        />
      )}
    </div>
  );
}
