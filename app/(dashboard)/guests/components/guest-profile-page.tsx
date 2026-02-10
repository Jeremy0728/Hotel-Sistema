"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/hotel/empty-state";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Guest, Reservation } from "@/types/hotel";
import type { GuestFormValues } from "@/lib/hotel-schemas";
import GuestForm from "./guest-form";
import Link from "next/link";

interface GuestProfilePageProps {
  guestId: string;
}

const formatDate = (value?: string) => value || "-";

export default function GuestProfilePage({ guestId }: GuestProfilePageProps) {
  const { guests, reservations, updateGuest } = useHotelData();
  const [editOpen, setEditOpen] = useState(false);
  const [prefEditing, setPrefEditing] = useState(false);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null);

  const guest = useMemo(() => guests.find((item) => item.id === guestId), [guests, guestId]);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const guestReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (reservation.guestId === guestId) return true;
      return reservation.additionalGuestIds?.includes(guestId) ?? false;
    });
  }, [reservations, guestId]);

  const [preferencesText, setPreferencesText] = useState("{}");

  useEffect(() => {
    if (!guest) return;
    const initial = guest.preferences ?? {};
    setPreferencesText(JSON.stringify(initial, null, 2));
    setPrefEditing(false);
    setPrefError(null);
    setPrefSuccess(null);
  }, [guest?.id]);

  if (!guest) {
    return (
      <EmptyState
        title="Huesped no encontrado"
        description="No se encontro el perfil solicitado."
        action={
          <Button asChild>
            <Link href="/guests">Volver a huespedes</Link>
          </Button>
        }
      />
    );
  }

  const reservationsSorted = [...guestReservations].sort((a, b) =>
    a.checkIn < b.checkIn ? 1 : -1
  );
  const upcoming = guestReservations.filter((item) => item.checkIn >= todayStr);
  const past = guestReservations.filter((item) => item.checkOut < todayStr);
  const totalSpent = guestReservations
    .filter((item) => item.status !== "cancelled")
    .reduce((sum, item) => sum + item.total, 0);
  const frequent = guestReservations.length >= 3;

  const handleSubmit = (values: GuestFormValues) => {
    updateGuest(guest.id, {
      firstName: values.firstName,
      lastName: values.lastName,
      secondLastName: values.secondLastName,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      email: values.email || "",
      phone: values.phone,
      nationality: values.nationality,
      country: values.country,
      city: values.city,
      address: values.address,
      birthDate: values.birthDate,
    });
    setEditOpen(false);
  };

  const defaultValues: GuestFormValues = {
    firstName: guest.firstName,
    lastName: guest.lastName,
    secondLastName: guest.secondLastName ?? "",
    birthDate: guest.birthDate ?? "",
    documentType: guest.documentType,
    documentNumber: guest.documentNumber,
    email: guest.email,
    phone: guest.phone,
    nationality: guest.nationality,
    country: guest.country ?? "",
    city: guest.city ?? "",
    address: guest.address ?? "",
  };

  const handleSavePreferences = () => {
    setPrefError(null);
    setPrefSuccess(null);
    try {
      const parsed = preferencesText.trim() ? JSON.parse(preferencesText) : {};
      updateGuest(guest.id, { preferences: parsed });
      setPrefSuccess("Preferencias guardadas.");
      setPrefEditing(false);
    } catch (error) {
      setPrefError("JSON invalido. Revisa el formato.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {guest.firstName} {guest.lastName} {guest.secondLastName}
              </h2>
              {frequent ? (
                <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                  Frecuente
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Documento: {guest.documentType} {guest.documentNumber}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-300">
            <div>Reservas: {guestReservations.length}</div>
            <div>Proximas: {upcoming.length}</div>
            <div>Pasadas: {past.length}</div>
            <div>Total: S/ {totalSpent}</div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informacion personal</TabsTrigger>
          <TabsTrigger value="reservations">Historial de reservas</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Informacion personal</h3>
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                Editar
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <div>Nombre: {guest.firstName}</div>
              <div>Apellido: {guest.lastName} {guest.secondLastName}</div>
              <div>Documento: {guest.documentType} {guest.documentNumber}</div>
              <div>Email: {guest.email || "-"}</div>
              <div>Telefono: {guest.phone}</div>
              <div>Fecha nacimiento: {formatDate(guest.birthDate)}</div>
              <div>Nacionalidad: {guest.nationality}</div>
              <div>Pais: {guest.country || "-"}</div>
              <div>Ciudad: {guest.city || "-"}</div>
              <div>Direccion: {guest.address || "-"}</div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Historial de reservas</h3>
              <Button size="sm" variant="outline" asChild>
                <Link href="/reservations">Ver reservas</Link>
              </Button>
            </div>
            {reservationsSorted.length === 0 ? (
              <EmptyState
                title="Sin reservas"
                description="Este huesped aun no tiene reservas."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Habitacion</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservationsSorted.map((reservation: Reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.code}</TableCell>
                      <TableCell>#{reservation.roomNumber}</TableCell>
                      <TableCell>{reservation.checkIn}</TableCell>
                      <TableCell>{reservation.checkOut}</TableCell>
                      <TableCell>S/ {reservation.total}</TableCell>
                      <TableCell>
                        <StatusBadge type="reservation" status={reservation.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Preferencias</h3>
              {!prefEditing ? (
                <Button size="sm" variant="outline" onClick={() => setPrefEditing(true)}>
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setPrefEditing(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSavePreferences}>
                    Guardar
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              value={preferencesText}
              onChange={(event) => setPreferencesText(event.target.value)}
              className="min-h-[180px] font-mono text-xs"
              readOnly={!prefEditing}
            />
            {prefError ? <p className="text-sm text-red-500">{prefError}</p> : null}
            {prefSuccess ? <p className="text-sm text-emerald-600">{prefSuccess}</p> : null}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar huesped</DialogTitle>
          </DialogHeader>
          <GuestForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => setEditOpen(false)}
            submitLabel="Guardar cambios"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
