import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RoomOpsTile from "@/app/(dashboard)/rooms/components/room-ops-tile";
import { RefreshCw } from "lucide-react";
import type { RoomStatus } from "@/types/hotel";

interface RoomSnapshot {
  room: {
    id: string;
    number: string;
    type: string;
    floor: number;
    status: RoomStatus;
    notes?: string;
  };
  activeReservation?: {
    guestName: string;
    adults?: number;
    children?: number;
  };
  arrivalReservation?: {
    guestName: string;
    adults?: number;
    children?: number;
  };
  departureReservation?: {
    guestName: string;
  };
  hasPendingPayment: boolean;
  hasAlert: boolean;
}

interface FloorSummary {
  floor: number;
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
}

interface FloorCounts {
  all: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  out_of_service: number;
}

interface RoomsFloorViewCardProps {
  statusFilter: RoomStatus | "all";
  setStatusFilter: (status: RoomStatus | "all") => void;
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;
  floorCounts: FloorCounts;
  floorSummaries: FloorSummary[];
  filteredRoomsLoading: boolean;
  visibleRooms: RoomSnapshot[];
  quickAction: (snapshot: RoomSnapshot) => { label: string; execute: () => void };
  contextLine: (snapshot: RoomSnapshot) => string;
  displayName: (name: string) => string;
  paxLabel: (reservation?: { adults?: number; children?: number }) => string;
}

export default function RoomsFloorViewCard({
  statusFilter,
  setStatusFilter,
  selectedFloor,
  setSelectedFloor,
  floorCounts,
  floorSummaries,
  filteredRoomsLoading,
  visibleRooms,
  quickAction,
  contextLine,
  displayName,
  paxLabel,
}: RoomsFloorViewCardProps) {
  const router = useRouter();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Habitaciones por piso</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Vista operativa en tiempo real
          </p>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/rooms">Abrir vista completa</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <Button
          size="sm"
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
        >
          Todo ({floorCounts.all})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "available" ? "default" : "outline"}
          onClick={() => setStatusFilter("available")}
        >
          Disponible ({floorCounts.available})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "occupied" ? "default" : "outline"}
          onClick={() => setStatusFilter("occupied")}
        >
          Ocupada ({floorCounts.occupied})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "cleaning" ? "default" : "outline"}
          onClick={() => setStatusFilter("cleaning")}
        >
          Limpieza ({floorCounts.cleaning})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "maintenance" ? "default" : "outline"}
          onClick={() => setStatusFilter("maintenance")}
        >
          Mant. ({floorCounts.maintenance})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "out_of_service" ? "default" : "outline"}
          onClick={() => setStatusFilter("out_of_service")}
        >
          F/S ({floorCounts.out_of_service})
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {floorSummaries.map((summary) => (
          <button
            key={summary.floor}
            type="button"
            onClick={() => setSelectedFloor(summary.floor)}
            className={`min-w-[168px] rounded-lg border px-3 py-2 text-left transition ${
              selectedFloor === summary.floor
                ? "border-primary bg-primary/10"
                : "border-neutral-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            }`}
          >
            <p className="text-sm font-semibold">Piso {summary.floor}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              D:{summary.available} O:{summary.occupied} L:{summary.cleaning}
            </p>
          </button>
        ))}
      </div>

      {filteredRoomsLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-2">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-primary" />
            <p className="text-xs text-neutral-500">Actualizando...</p>
          </div>
        </div>
      ) : visibleRooms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
          No hay habitaciones para los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleRooms.map((snapshot) => {
            const action = quickAction(snapshot);
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
                context={contextLine(snapshot)}
                hasPendingPayment={snapshot.hasPendingPayment}
                hasAlert={snapshot.hasAlert}
                quickLabel={action.label}
                onView={() => router.push(`/rooms?floor=${selectedFloor}`)}
                onQuick={action.execute}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
}
