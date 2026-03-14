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
import { useGuest } from "@/hooks/useGuests";
import { useReservations } from "@/hooks/useReservations";
import type { GuestFormValues } from "@/lib/hotel-schemas";
import GuestForm from "./guest-form";
import Link from "next/link";
import { huespedesApi } from "@/apis/huespedes.api";
import toast from "react-hot-toast";

interface GuestProfilePageProps {
  guestId: string;
}

const formatDate = (value?: string) => value || "-";

export default function GuestProfilePage({ guestId }: GuestProfilePageProps) {
  const guestIdNum = parseInt(guestId, 10);
  const { guest, isLoading: guestLoading, refreshGuest } = useGuest(guestIdNum);
  const { reservations, isLoading: reservationsLoading } = useReservations({ guest_id: guestIdNum });
  
  const [editOpen, setEditOpen] = useState(false);
  const [prefEditing, setPrefEditing] = useState(false);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const guestReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      // Incluir si es el huésped principal
      if (reservation.guest_id === guestIdNum) return true;
      
      // Incluir si está en la lista de huéspedes adicionales
      if (reservation.reservationGuests) {
        return reservation.reservationGuests.some(
          (rg) => rg.guest_id === guestIdNum
        );
      }
      
      return false;
    });
  }, [reservations, guestIdNum]);

  const [preferencesText, setPreferencesText] = useState(() => {
    if (!guest) return "{}";
    const initial = guest.preferences ?? {};
    return JSON.stringify(initial, null, 2);
  });

  useEffect(() => {
    if (!guest) return;
    const initial = guest.preferences ?? {};
    const newText = JSON.stringify(initial, null, 2);
    setPreferencesText(newText);
    setPrefEditing(false);
    setPrefError(null);
    setPrefSuccess(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest?.id]);

  if (guestLoading || reservationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando perfil...</p>
        </div>
      </div>
    );
  }

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
    a.check_in_date < b.check_in_date ? 1 : -1
  );
  const upcoming = guestReservations.filter((item) => item.check_in_date >= todayStr);
  const past = guestReservations.filter((item) => item.check_out_date < todayStr);
  const totalSpent = guestReservations
    .filter((item) => item.status !== "cancelled")
    .reduce((sum, item) => sum + parseFloat(item.total_amount || "0"), 0);
  const frequent = guestReservations.length >= 3;

  const handleSubmit = async (values: GuestFormValues) => {
    try {
      await huespedesApi.actualizar(guest.id, {
        nombres: values.firstName,
        apellido_paterno: values.lastName,
        apellido_materno: values.secondLastName || undefined,
        document_type_id: values.documentType ? parseInt(values.documentType, 10) : undefined,
        document_number: values.documentNumber || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        country_id: values.nationality ? parseInt(values.nationality, 10) : undefined,
        city: values.city || undefined,
        address: values.address || undefined,
        date_of_birth: values.birthDate || undefined,
      });
      toast.success('Huésped actualizado exitosamente');
      refreshGuest();
      setEditOpen(false);
    } catch (error) {
      console.error('Error al actualizar huésped:', error);
      toast.error('Error al actualizar huésped');
    }
  };

  const defaultValues: GuestFormValues = {
    firstName: guest.nombres,
    lastName: guest.apellido_paterno,
    secondLastName: guest.apellido_materno ?? "",
    birthDate: guest.date_of_birth ?? "",
    documentType: guest.document_type_id?.toString() ?? "",
    documentNumber: guest.document_number ?? "",
    email: guest.email ?? "",
    phone: guest.phone ?? "",
    nationality: guest.country_id?.toString() ?? "",
    country: guest.country?.name ?? "",
    city: guest.city ?? "",
    address: guest.address ?? "",
  };

  const handleSavePreferences = async () => {
    setPrefError(null);
    setPrefSuccess(null);
    try {
      const parsed = preferencesText.trim() ? JSON.parse(preferencesText) : {};
      await huespedesApi.actualizar(guest.id, { preferences: parsed });
      setPrefSuccess("Preferencias guardadas.");
      setPrefEditing(false);
      refreshGuest();
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
                {guest.nombres} {guest.apellido_paterno} {guest.apellido_materno}
              </h2>
              {frequent ? (
                <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                  Frecuente
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Documento: {guest.documentType?.name || guest.document_type} {guest.document_number}
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
              <div>Nombre: {guest.nombres}</div>
              <div>Apellido: {guest.apellido_paterno} {guest.apellido_materno}</div>
              <div>Documento: {guest.documentType?.name || guest.document_type} {guest.document_number}</div>
              <div>Email: {guest.email || "-"}</div>
              <div>Telefono: {guest.phone || "-"}</div>
              <div>Fecha nacimiento: {formatDate(guest.date_of_birth)}</div>
              <div>Nacionalidad: {guest.country?.nationality || "-"}</div>
              <div>Pais: {guest.country?.name || "-"}</div>
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
                  {reservationsSorted.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.confirmation_code}</TableCell>
                      <TableCell>#{reservation.room?.number || '-'}</TableCell>
                      <TableCell>{reservation.check_in_date}</TableCell>
                      <TableCell>{reservation.check_out_date}</TableCell>
                      <TableCell>S/ {reservation.total_amount}</TableCell>
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
