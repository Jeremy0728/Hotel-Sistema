"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/hotel/empty-state";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Room, RoomStatus } from "@/types/hotel";
import RoomCard from "./room-card";
import RoomForm from "./room-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { RoomFormValues } from "@/lib/hotel-schemas";

const statusOptions: { value: RoomStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "available", label: "Disponible" },
  { value: "occupied", label: "Ocupada" },
  { value: "cleaning", label: "Limpieza" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "out_of_service", label: "Fuera de servicio" },
];

const validStatuses = new Set<RoomStatus>([
  "available",
  "occupied",
  "cleaning",
  "maintenance",
  "out_of_service",
]);

export default function RoomsPage() {
  const { rooms, roomTypes, addRoom, updateRoom } = useHotelData();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const viewParam = searchParams.get("view");
  const statusParam = searchParams.get("status");
  const hasParamFilter = statusParam && validStatuses.has(statusParam as RoomStatus);

  useEffect(() => {
    const isHousekeeping = viewParam === "housekeeping";
    if (hasParamFilter) {
      setStatusFilter(statusParam as RoomStatus);
      return;
    }

    if (isHousekeeping) {
      setStatusFilter("cleaning");
      setTypeFilter("all");
      setFloorFilter("all");
      setSearch("");
      return;
    }

    setStatusFilter("all");
    setTypeFilter("all");
    setFloorFilter("all");
    setSearch("");
  }, [viewParam, statusParam, hasParamFilter]);

  const roomTypeOptions = useMemo(() => {
    const types = [...roomTypes.map((type) => type.name), ...rooms.map((room) => room.type)];
    return Array.from(new Set(types));
  }, [roomTypes, rooms]);
  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort(),
    [rooms]
  );

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : room.status === statusFilter;
    const matchesType = typeFilter === "all" ? true : room.type === typeFilter;
    const matchesFloor =
      floorFilter === "all" ? true : room.floor === floorFilter;
    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedRoom) return;
    setEditingRoom(selectedRoom);
    setFormOpen(true);
  };

  const handleSubmit = (values: RoomFormValues) => {
    if (editingRoom) {
      updateRoom(editingRoom.id, values);
    } else {
      addRoom({
        id: `room-${Date.now()}`,
        number: values.number,
        type: values.type,
        floor: values.floor,
        status: values.status,
        notes: values.notes,
      });
    }
    setFormOpen(false);
    setEditingRoom(null);
  };

  const defaultFormValues: RoomFormValues = editingRoom
    ? {
        number: editingRoom.number,
        type: editingRoom.type,
        floor: editingRoom.floor,
        status: editingRoom.status,
        notes: editingRoom.notes ?? "",
      }
    : {
        number: "",
        type: "",
        floor: 1,
        status: "available",
        notes: "",
      };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Habitaciones</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Gestiona disponibilidad, tipos y estados
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/room-types">Tipos de habitacion</Link>
            </Button>
            <Button onClick={handleOpenCreate}>Agregar habitacion</Button>
          </div>
        </div>

        {hasParamFilter ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 dark:border-slate-700 px-3 py-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-300">
              Filtro activo: {statusOptions.find((opt) => opt.value === statusParam)?.label ?? "Estado"}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rooms">Quitar filtro</Link>
            </Button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Buscar por número o tipo"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {roomTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
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
        </div>
      </Card>

      {filteredRooms.length === 0 ? (
        <EmptyState
          title="Sin habitaciones"
          description="No hay habitaciones que coincidan con los filtros actuales."
          action={<Button onClick={handleOpenCreate}>Agregar habitacion</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => setSelectedRoom(room)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de habitación</DialogTitle>
          </DialogHeader>
          {selectedRoom ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-300">
                    Habitación #{selectedRoom.number}
                  </p>
                  <h3 className="text-lg font-semibold">{selectedRoom.type}</h3>
                </div>
                <StatusBadge type="room" status={selectedRoom.status} />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                Piso {selectedRoom.floor}
              </div>
              {selectedRoom.notes ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                  {selectedRoom.notes}
                </p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedRoom(null)}
                >
                  Cerrar
                </Button>
                <Button onClick={handleOpenEdit}>Editar</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? "Editar habitación" : "Nueva habitación"}
            </DialogTitle>
          </DialogHeader>
          <RoomForm
            defaultValues={defaultFormValues}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            submitLabel={editingRoom ? "Guardar cambios" : "Crear habitación"}
            typeOptions={roomTypeOptions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
