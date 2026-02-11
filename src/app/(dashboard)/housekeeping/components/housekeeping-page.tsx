"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHotelData } from "@/contexts/HotelDataContext";
import StatusBadge from "@/components/hotel/status-badge";
import type { RoomStatus } from "@/types/hotel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Priority = "alta" | "media" | "baja";

const priorityStyles: Record<Priority, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-yellow-100 text-yellow-700",
  baja: "bg-emerald-100 text-emerald-700",
};

const statusOptions: { value: RoomStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "cleaning", label: "En limpieza" },
  { value: "occupied", label: "Sucia" },
  { value: "available", label: "Limpia" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "out_of_service", label: "Fuera de servicio" },
];

const staffOptions = ["Ana", "Carlos", "Brenda", "Luis"];

export default function HousekeepingPage() {
  const { rooms, updateRoom } = useHotelData();
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">(
    "cleaning"
  );
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [viewMode, setViewMode] = useState<"floor" | "list">("floor");
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [priorities, setPriorities] = useState<Record<string, Priority>>({});

  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort(),
    [rooms]
  );

  const housekeepingRooms = rooms.filter((room) => {
    const matchesStatus =
      statusFilter === "all" ? true : room.status === statusFilter;
    const matchesFloor =
      floorFilter === "all" ? true : room.floor === floorFilter;
    const priority = priorities[room.id] ?? "media";
    const matchesPriority =
      priorityFilter === "all" ? true : priority === priorityFilter;
    return matchesStatus && matchesFloor && matchesPriority;
  });

  const groupedByFloor = useMemo(() => {
    return floors.map((floor) => ({
      floor,
      rooms: housekeepingRooms.filter((room) => room.floor === floor),
    }));
  }, [floors, housekeepingRooms]);

  const handleAssign = (roomId: string, staff: string) => {
    setAssignments((prev) => ({ ...prev, [roomId]: staff }));
  };

  const handlePriority = (roomId: string, priority: Priority) => {
    setPriorities((prev) => ({ ...prev, [roomId]: priority }));
  };

  const handleMarkClean = (roomId: string) => {
    updateRoom(roomId, { status: "available" });
  };

  const handleBlock = (roomId: string) => {
    updateRoom(roomId, { status: "out_of_service" });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Housekeeping</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Asignación de tareas y estado de habitaciones
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={viewMode === "floor" ? "default" : "outline"}
              onClick={() => setViewMode("floor")}
            >
              Vista por piso
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              Vista lista
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as RoomStatus | "all")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={floorFilter === "all" ? "all" : String(floorFilter)}
            onValueChange={(value) =>
              setFloorFilter(value === "all" ? "all" : Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Piso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {floors.map((floor) => (
                <SelectItem key={floor} value={String(floor)}>
                  Piso {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as Priority | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Badge variant="info">
              Fuera de servicio: {rooms.filter((room) => room.status === "out_of_service").length}
            </Badge>
          </div>
        </div>
      </Card>

      {viewMode === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {housekeepingRooms.map((room) => {
            const priority = priorities[room.id] ?? "media";
            return (
              <Card key={room.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">Habitación #{room.number}</p>
                    <p className="text-sm text-neutral-500">Piso {room.floor}</p>
                  </div>
                  <StatusBadge type="room" status={room.status} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("rounded-full", priorityStyles[priority])}>
                    Prioridad {priority}
                  </Badge>
                  <Badge variant="outline">
                    Responsable: {assignments[room.id] ?? "Sin asignar"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={assignments[room.id] ?? "all"}
                    onValueChange={(value) =>
                      handleAssign(room.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Sin asignar</SelectItem>
                      {staffOptions.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={priority}
                    onValueChange={(value) =>
                      handlePriority(room.id, value as Priority)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleMarkClean(room.id)}>
                    Marcar limpia
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBlock(room.id)}>
                    Bloquear
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByFloor.map((group) => (
            <Card key={group.floor} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Piso {group.floor}</h3>
                <span className="text-xs text-neutral-500">
                  {group.rooms.length} habitaciones
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {group.rooms.map((room) => {
                  const priority = priorities[room.id] ?? "media";
                  return (
                    <div
                      key={room.id}
                      className="rounded-lg border border-neutral-200 dark:border-slate-700 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">
                            Habitación #{room.number}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Responsable: {assignments[room.id] ?? "Sin asignar"}
                          </p>
                        </div>
                        <StatusBadge type="room" status={room.status} />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge className={cn("rounded-full", priorityStyles[priority])}>
                          Prioridad {priority}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkClean(room.id)}
                        >
                          Marcar limpia
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBlock(room.id)}
                        >
                          Bloquear
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {group.rooms.length === 0 ? (
                  <div className="text-sm text-neutral-500">
                    Sin habitaciones para este piso.
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
