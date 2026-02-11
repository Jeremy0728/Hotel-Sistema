"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";
import type { RoomType } from "@/types/hotel";
import type { RoomTypeFormValues } from "@/lib/hotel-schemas";
import RoomTypeForm from "./room-type-form";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

const formatRate = (value: number) => `S/ ${value}`;

export default function RoomTypesPage() {
  const { roomTypes, addRoomType, updateRoomType, removeRoomType } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return roomTypes.filter((type) => {
      const matchesSearch =
        type.name.toLowerCase().includes(query) ||
        (type.description ?? "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" ? true : type.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [roomTypes, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingType(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (roomType: RoomType) => {
    setEditingType(roomType);
    setDialogOpen(true);
  };

  const handleSubmit = (values: RoomTypeFormValues) => {
    const amenities = values.amenities
      ? values.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    if (editingType) {
      updateRoomType(editingType.id, { ...values, amenities });
    } else {
      addRoomType({
        id: `type-${Date.now()}`,
        ...values,
        amenities,
      });
    }

    setDialogOpen(false);
    setEditingType(null);
  };

  const defaultValues: RoomTypeFormValues = editingType
    ? {
        name: editingType.name,
        description: editingType.description ?? "",
        maxGuests: editingType.maxGuests,
        rateHour: editingType.rateHour,
        rateDay: editingType.rateDay,
        rateWeek: editingType.rateWeek,
        rateMonth: editingType.rateMonth,
        amenities: editingType.amenities.join(", "),
        status: editingType.status,
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
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tipos de habitacion</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Configura tarifas, capacidad y amenidades
            </p>
          </div>
          <Button onClick={handleOpenCreate}>Agregar tipo</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Buscar por nombre o descripcion"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin tipos registrados"
          description="No hay tipos de habitacion para mostrar."
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
              {filtered.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="text-sm text-neutral-500 dark:text-neutral-300">
                    {type.description || "-"}
                  </TableCell>
                  <TableCell>{type.maxGuests} pax</TableCell>
                  <TableCell className="text-xs text-neutral-500 dark:text-neutral-300">
                    <div>Hora: {formatRate(type.rateHour)}</div>
                    <div>Dia: {formatRate(type.rateDay)}</div>
                    <div>Semana: {formatRate(type.rateWeek)}</div>
                    <div>Mes: {formatRate(type.rateMonth)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {type.amenities.length ? (
                        type.amenities.map((amenity) => (
                          <Badge key={amenity} className="rounded-full" variant="secondary">
                            {amenity}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full",
                        type.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-700"
                      )}
                    >
                      {type.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(type)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(type)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Editar tipo" : "Nuevo tipo"}
            </DialogTitle>
          </DialogHeader>
          <RoomTypeForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editingType ? "Guardar cambios" : "Crear tipo"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminacion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Vas a eliminar el tipo "{deleteTarget?.name}". Esta accion no se puede
            deshacer.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  removeRoomType(deleteTarget.id);
                }
                setDeleteTarget(null);
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
