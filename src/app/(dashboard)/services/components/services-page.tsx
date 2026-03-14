"use client";

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
import { useServices } from "@/hooks/useServices";
import { useServiceOperations } from "../hooks/useServiceOperations";
import { cn } from "@/lib/utils";
import type { ServiceFormValues } from "@/lib/hotel-schemas";
import ServiceForm from "./service-form";
import Link from "next/link";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

export default function ServicesPage() {
  // Obtener datos desde hook useServices
  const { services: apiServices, isLoading: servicesLoading, refreshServices } = useServices({ limit: 100 });

  // Hook de operaciones de servicios
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    formOpen,
    editingService,
    deleteTarget,
    filteredServices,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  } = useServiceOperations({
    services: apiServices,
    refreshServices,
  });

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  const defaultServiceValues: ServiceFormValues = editingService
    ? {
        name: editingService.name,
        category: editingService.category,
        description: editingService.description ?? "",
        price: parseFloat(editingService.price),
        durationMinutes: editingService.duration_minutes ?? 30,
        status: editingService.is_active ? "active" : "inactive",
      }
    : {
        name: "",
        category: "",
        description: "",
        price: 0,
        durationMinutes: 30,
        status: "active",
      };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Catalogo de servicios</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Servicios adicionales del hotel
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/services/schedule">Agenda de servicios</Link>
            </Button>
            <Button onClick={handleOpenCreate}>Agregar servicio</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Buscar por nombre o categoria"
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

      {filteredServices.length === 0 ? (
        <EmptyState
          title="Sin servicios"
          description="No hay servicios registrados."
          action={<Button onClick={handleOpenCreate}>Agregar servicio</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Duracion</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category || "-"}</TableCell>
                  <TableCell>S/ {service.price}</TableCell>
                  <TableCell>{service.duration_minutes ?? '-'} min</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full",
                        service.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-700"
                      )}
                    >
                      {service.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(service)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleOpenDelete(service)}>
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

      <Dialog open={formOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar servicio" : "Nuevo servicio"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            defaultValues={defaultServiceValues}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            submitLabel={editingService ? "Guardar cambios" : "Crear servicio"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={handleCloseDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminacion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Vas a eliminar el servicio "{deleteTarget?.name}".
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
