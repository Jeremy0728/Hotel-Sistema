"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmptyState from "@/components/hotel/empty-state";
import { useRooms } from "@/hooks/useRooms";
import { useRoomConfigOperations } from "../hooks/useRoomConfigOperations";
import RoomConfigFiltersCard from "./room-config-filters-card";
import RoomDetailDialog from "./room-detail-dialog";
import RoomCard from "./room-card";
import RoomForm from "./room-form";
import type { RoomFormValues } from "@/lib/hotel-schemas";

export default function RoomsConfigPage() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const statusParam = searchParams.get("status");

  // Obtener datos desde hook useRooms
  const { rooms: apiRooms, isLoading: roomsLoading } = useRooms({ limit: 100 });

  // TODO: Obtener tipos de habitación desde API cuando esté disponible
  const roomTypes: any[] = [];

  // Funciones para agregar y actualizar habitaciones (TODO: implementar con API real)
  const handleAddRoom = async (room: any) => {
    // TODO: Llamar a habitacionesApi.crear
    console.log("Add room:", room);
  };

  const handleUpdateRoom = async (id: number, updates: any) => {
    // TODO: Llamar a habitacionesApi.actualizar
    console.log("Update room:", id, updates);
  };

  // Hook de operaciones de configuración de habitaciones
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    floorFilter,
    setFloorFilter,
    selectedRoom,
    formOpen,
    editingRoom,
    roomTypeOptions,
    floors,
    filteredRooms,
    hasParamFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handleSelectRoom,
    handleCloseDetail,
  } = useRoomConfigOperations({
    rooms: apiRooms,
    roomTypes,
    statusParam,
    viewParam,
    onAddRoom: handleAddRoom,
    onUpdateRoom: handleUpdateRoom,
  });

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

  const defaultFormValues: RoomFormValues = editingRoom
    ? {
        number: editingRoom.number,
        type: editingRoom.roomType?.name || "",
        floor: editingRoom.floor,
        status: editingRoom.status as any,
        notes: editingRoom.notes ?? "",
      }
    : {
        number: "",
        type: "",
        floor: floors[0] ?? 1,
        status: "available",
        notes: "",
      };

  return (
    <div className="space-y-6">
      <RoomConfigFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
        roomTypeOptions={roomTypeOptions}
        floors={floors}
        hasParamFilter={hasParamFilter}
        statusParam={statusParam}
        onOpenCreate={handleOpenCreate}
      />

      {filteredRooms.length === 0 ? (
        <EmptyState
          title="Sin habitaciones"
          description="No hay habitaciones que coincidan con los filtros actuales."
          action={<Button onClick={handleOpenCreate}>Agregar habitación</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room as any} onClick={() => handleSelectRoom(room)} />
          ))}
        </div>
      )}

      <RoomDetailDialog
        room={selectedRoom}
        open={Boolean(selectedRoom)}
        onClose={handleCloseDetail}
        onEdit={handleOpenEdit}
      />

      <Dialog open={formOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? "Editar habitación" : "Nueva habitación"}
            </DialogTitle>
          </DialogHeader>
          <RoomForm
            defaultValues={defaultFormValues}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            submitLabel={editingRoom ? "Guardar cambios" : "Crear habitación"}
            typeOptions={roomTypeOptions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
