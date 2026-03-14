"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { useRoomTypeOperations } from "../hooks/useRoomTypeOperations";
import RoomTypeFiltersCard from "./room-type-filters-card";
import RoomTypeTableRow from "./room-type-table-row";
import RoomTypeForm from "./room-type-form";
import type { RoomTypeFormValues } from "@/lib/hotel-schemas";

export default function RoomTypesPage() {
  // Obtener datos desde hook useRoomTypes
  const { roomTypes: apiRoomTypes, isLoading: roomTypesLoading, refreshRoomTypes } = useRoomTypes({ limit: 100 });

  // Hook de operaciones de tipos de habitación
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    editingType,
    deleteTarget,
    filteredRoomTypes,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSubmit,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  } = useRoomTypeOperations({
    roomTypes: apiRoomTypes,
    refreshRoomTypes,
  });

  if (roomTypesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando tipos de habitación...</p>
        </div>
      </div>
    );
  }

  const defaultValues: RoomTypeFormValues = editingType
    ? {
        name: editingType.name,
        description: editingType.description ?? "",
        maxGuests: editingType.max_occupancy,
        rateHour: 0,
        rateDay: editingType.base_price ? parseFloat(editingType.base_price) : 0,
        rateWeek: 0,
        rateMonth: 0,
        amenities: editingType.amenities ? Object.values(editingType.amenities).join(", ") : "",
        status: editingType.is_active ? "active" : "inactive",
      }
    : {
        name: "",
        description: "",
        maxGuests: 1,
        rateHour: 0,
        rateDay: 0,
        rateWeek: 0,
        rateMonth: 0,
        amenities: "",
        status: "active",
      };

  return (
    <div className="space-y-6">
      <RoomTypeFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenCreate={handleOpenCreate}
      />

      {filteredRoomTypes.length === 0 ? (
        <EmptyState
          title="Sin tipos registrados"
          description="No hay tipos de habitación para mostrar."
          action={<Button onClick={handleOpenCreate}>Agregar tipo</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Precios</TableHead>
                <TableHead>Amenidades</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoomTypes.map((type) => (
                <RoomTypeTableRow
                  key={type.id}
                  roomType={type}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Editar tipo" : "Nuevo tipo"}
            </DialogTitle>
          </DialogHeader>
          <RoomTypeForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            submitLabel={editingType ? "Guardar cambios" : "Crear tipo"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={handleCloseDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminacion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Vas a eliminar el tipo "{deleteTarget?.name}". Esta accion no se puede
            deshacer.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={handleCloseDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
