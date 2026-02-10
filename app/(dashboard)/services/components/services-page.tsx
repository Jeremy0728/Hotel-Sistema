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
import type { Service } from "@/types/hotel";
import type { ServiceBookingFormValues, ServiceFormValues } from "@/lib/hotel-schemas";
import ServiceForm from "./service-form";
import ServiceBookingForm from "./service-booking-form";
import Link from "next/link";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

export default function ServicesPage() {
  const {
    services,
    guests,
    addService,
    updateService,
    removeService,
    addServiceBooking,
  } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(query) ||
        (service.category ?? "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" ? true : service.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleOpenBooking = (service?: Service) => {
    setBookingService(service ?? null);
    setBookingOpen(true);
  };

  const handleSubmit = (values: ServiceFormValues) => {
    if (editingService) {
      updateService(editingService.id, values);
    } else {
      addService({
        id: `srv-${Date.now()}`,
        ...values,
      });
    }
    setFormOpen(false);
    setEditingService(null);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const defaultServiceValues: ServiceFormValues = editingService
    ? {
        name: editingService.name,
        category: editingService.category ?? "",
        description: editingService.description ?? "",
        price: editingService.price,
        durationMinutes: editingService.durationMinutes,
        status: editingService.status,
      }
    : {
        name: "",
        category: "",
        description: "",
        price: 0,
        durationMinutes: 30,
        status: "active",
      };

  const defaultBookingValues: ServiceBookingFormValues = {
    serviceId: bookingService?.id ?? services[0]?.id ?? "",
    guestId: guests[0]?.id ?? "",
    date: todayStr,
    time: "10:00",
    status: "scheduled",
    notes: "",
  };

  const handleBookingSubmit = (values: ServiceBookingFormValues) => {
    const service = services.find((item) => item.id === values.serviceId);
    const guest = guests.find((item) => item.id === values.guestId);
    if (!service || !guest) return;

    addServiceBooking({
      id: `sb-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.name,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`,
      date: values.date,
      time: values.time,
      status: values.status,
      price: service.price,
      notes: values.notes,
    });

    setBookingOpen(false);
    setBookingService(null);
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

      {filtered.length === 0 ? (
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
              {filtered.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category || "-"}</TableCell>
                  <TableCell>S/ {service.price}</TableCell>
                  <TableCell>{service.durationMinutes} min</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full",
                        service.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-700"
                      )}
                    >
                      {service.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(service)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleOpenBooking(service)}>
                        Reservar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(service)}>
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar servicio" : "Nuevo servicio"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            defaultValues={defaultServiceValues}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            submitLabel={editingService ? "Guardar cambios" : "Crear servicio"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservar servicio</DialogTitle>
          </DialogHeader>
          <ServiceBookingForm
            services={services}
            guests={guests}
            defaultValues={defaultBookingValues}
            onSubmit={handleBookingSubmit}
            onCancel={() => setBookingOpen(false)}
            submitLabel="Crear reserva"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminacion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Vas a eliminar el servicio "{deleteTarget?.name}".
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  removeService(deleteTarget.id);
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
