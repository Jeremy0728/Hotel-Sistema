import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Room } from "@/types/hotel";
import { roomNumeric, staffPool } from "../utils/dashboard-helpers";

interface RoomSnapshot {
  room: Room;
  activeReservation?: any;
  arrivalReservation?: any;
  departureReservation?: any;
  hasPendingPayment: boolean;
  hasAlert: boolean;
}

interface UseDashboardActionsProps {
  rooms: Room[];
  selectedFloor: number;
  hotelSettings: {
    checkInTime: string;
    checkOutTime: string;
  };
  completeCheckIn: (reservationId: string) => Promise<void>;
  completeCheckOut: (reservationId: string) => Promise<void>;
  updateRoom: (roomId: string, updates: Partial<{ status: string; notes?: string }>) => Promise<void>;
}

export function useDashboardActions({
  rooms,
  selectedFloor,
  hotelSettings,
  completeCheckIn,
  completeCheckOut,
  updateRoom,
}: UseDashboardActionsProps) {
  const router = useRouter();

  // Acción rápida para cada habitación
  const quickAction = (snapshot: RoomSnapshot) => {
    if (snapshot.arrivalReservation && snapshot.room.status === "available") {
      return {
        label: "Check-in rapido",
        execute: () => completeCheckIn(snapshot.arrivalReservation!.id),
      };
    }

    if (snapshot.departureReservation) {
      return {
        label: "Check-out rapido",
        execute: () => completeCheckOut(snapshot.departureReservation!.id),
      };
    }

    if (snapshot.room.status === "cleaning") {
      return {
        label: "Marcar lista",
        execute: () => updateRoom(snapshot.room.id, { status: "available" }),
      };
    }

    if (snapshot.room.status === "maintenance" || snapshot.room.status === "out_of_service") {
      return {
        label: "Reactivar",
        execute: () => updateRoom(snapshot.room.id, { status: "available" }),
      };
    }

    return {
      label: "Detalle",
      execute: () => router.push(`/rooms?floor=${selectedFloor}`),
    };
  };

  // Línea de contexto para cada habitación
  const contextLine = (snapshot: RoomSnapshot) => {
    if (snapshot.departureReservation) return `Sale ${hotelSettings.checkOutTime}`;
    if (snapshot.arrivalReservation) return `Llega ${hotelSettings.checkInTime}`;
    if (snapshot.room.status === "cleaning") return "Pendiente de limpieza";
    if (snapshot.room.status === "maintenance") return "Revision tecnica";
    if (snapshot.room.status === "out_of_service") return "Fuera de servicio";
    if (snapshot.room.status === "occupied") return "Huesped alojado";
    return "Lista";
  };

  // Cola de housekeeping
  const housekeepingQueue = useMemo(() => {
    const priority = {
      out_of_service: 1,
      maintenance: 2,
      cleaning: 3,
      occupied: 4,
      available: 5,
    } as const;

    return rooms
      .filter((room) => ["cleaning", "maintenance", "out_of_service"].includes(room.status))
      .sort((a, b) => {
        const aPriority = priority[a.status];
        const bPriority = priority[b.status];
        if (aPriority !== bPriority) return aPriority - bPriority;
        if (a.floor !== b.floor) return a.floor - b.floor;
        return roomNumeric(a.number) - roomNumeric(b.number);
      })
      .slice(0, 5)
      .map((room, index) => ({ room, assignedTo: staffPool[index % staffPool.length] }));
  }, [rooms]);

  return {
    quickAction,
    contextLine,
    housekeepingQueue,
  };
}
