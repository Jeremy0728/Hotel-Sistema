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
import type { ServiceBookingFormValues } from "@/lib/hotel-schemas";
import ServiceBookingForm from "./service-booking-form";
import Link from "next/link";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "scheduled", label: "Programado" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
];

const statusClasses: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-neutral-200 text-neutral-700",
};

export default function ServiceSchedule() {
  const {
    services,
    guests,
    serviceBookings,
    addServiceBooking,
    updateServiceBooking,
  } = useHotelData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  const filtered = useMemo(() => {
    return serviceBookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" ? true : booking.status === statusFilter;
      const matchesDate = dateFilter ? booking.date === dateFilter : true;
      return matchesStatus && matchesDate;
    });
  }, [serviceBookings, statusFilter, dateFilter]);

  const todayStr = new Date().toISOString().split("T")[0];

  const defaultBookingValues: ServiceBookingFormValues = {
    serviceId: services[0]?.id ?? "",
    guestId: guests[0]?.id ?? "",
    date: dateFilter || todayStr,
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
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Agenda de servicios</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Programacion de servicios para huespedes
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/services">Volver a catalogo</Link>
            </Button>
            <Button onClick={() => setBookingOpen(true)}>Reservar servicio</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
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
          title="Sin reservas"
          description="No hay servicios programados con estos filtros."
          action={<Button onClick={() => setBookingOpen(true)}>Reservar servicio</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Huesped</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.serviceName}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>S/ {booking.price}</TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-full", statusClasses[booking.status])}>
                      {booking.status === "scheduled"
                        ? "Programado"
                        : booking.status === "completed"
                        ? "Completado"
                        : "Cancelado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateServiceBooking(booking.id, { status: "completed" })}
                        disabled={booking.status !== "scheduled"}
                      >
                        Completar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateServiceBooking(booking.id, { status: "cancelled" })}
                        disabled={booking.status === "cancelled"}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

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
    </div>
  );
}
