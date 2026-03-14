import { useState, useMemo, useCallback } from 'react';
import { habitacionesApi } from '@/apis/habitaciones.api';
import toast from 'react-hot-toast';

type Priority = "alta" | "media" | "baja";

interface Room {
  id: number;
  number: string;
  room_type_id: number;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
  notes?: string;
  is_active: boolean;
  roomType?: {
    id: number;
    name: string;
    description?: string;
    base_price?: string;
    max_occupancy: number;
    amenities?: Record<string, any>;
  };
}

type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";

interface UseHousekeepingOperationsProps {
  rooms: Room[];
  refreshRooms: () => void;
  initialStatusFilter?: RoomStatus | "all";
  initialFloorFilter?: number | "all";
  initialViewMode?: "floor" | "list";
}

export function useHousekeepingOperations({
  rooms,
  refreshRooms,
  initialStatusFilter = "cleaning",
  initialFloorFilter = "all",
  initialViewMode = "floor",
}: UseHousekeepingOperationsProps) {
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">(initialStatusFilter);
  const [floorFilter, setFloorFilter] = useState<number | "all">(initialFloorFilter);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [viewMode, setViewMode] = useState<"floor" | "list">(initialViewMode);
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [priorities, setPriorities] = useState<Record<number, Priority>>({});

  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort(),
    [rooms]
  );

  const housekeepingRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesStatus =
        statusFilter === "all" ? true : room.status === statusFilter;
      const matchesFloor =
        floorFilter === "all" ? true : room.floor === floorFilter;
      const priority = priorities[room.id] ?? "media";
      const matchesPriority =
        priorityFilter === "all" ? true : priority === priorityFilter;
      return matchesStatus && matchesFloor && matchesPriority;
    });
  }, [rooms, statusFilter, floorFilter, priorityFilter, priorities]);

  const groupedByFloor = useMemo(() => {
    return floors.map((floor) => ({
      floor,
      rooms: housekeepingRooms.filter((room) => room.floor === floor),
    }));
  }, [floors, housekeepingRooms]);

  const handleAssign = useCallback((roomId: number, staff: string) => {
    setAssignments((prev) => ({ ...prev, [roomId]: staff }));
  }, []);

  const handlePriority = useCallback((roomId: number, priority: Priority) => {
    setPriorities((prev) => ({ ...prev, [roomId]: priority }));
  }, []);

  const updateRoomStatus = useCallback(async (roomId: number, status: RoomStatus) => {
    try {
      await habitacionesApi.actualizar(roomId, { status });
      toast.success('Estado de habitación actualizado');
      refreshRooms();
    } catch (error) {
      console.error('Error al actualizar estado de habitación:', error);
      toast.error('Error al actualizar estado de habitación');
      throw error;
    }
  }, [refreshRooms]);

  const handleMarkClean = useCallback(async (roomId: number) => {
    await updateRoomStatus(roomId, "available");
  }, [updateRoomStatus]);

  const handleMarkCleaning = useCallback(async (roomId: number) => {
    await updateRoomStatus(roomId, "cleaning");
  }, [updateRoomStatus]);

  const handleMarkMaintenance = useCallback(async (roomId: number) => {
    await updateRoomStatus(roomId, "maintenance");
  }, [updateRoomStatus]);

  const handleBlock = useCallback(async (roomId: number) => {
    await updateRoomStatus(roomId, "out_of_service");
  }, [updateRoomStatus]);

  return {
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
    handleMarkCleaning,
    handleMarkMaintenance,
    handleBlock,
    updateRoomStatus,
  };
}
