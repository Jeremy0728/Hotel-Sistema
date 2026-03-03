"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Guest, Reservation } from "@/types/hotel";

interface GuestManagementProps {
  reservation: Reservation;
  primaryGuest: Guest | undefined;
  onAddGuest: () => void;
  onSetPrimary: (guestId: string) => void;
  onRemoveGuest: (relationId: number) => void;
}

export default function GuestManagement({
  reservation,
  primaryGuest,
  onAddGuest,
  onSetPrimary,
  onRemoveGuest,
}: GuestManagementProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Huespedes</h3>
        <Button onClick={onAddGuest}>Agregar huesped</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {primaryGuest ? (
            <TableRow key={primaryGuest.id}>
              <TableCell className="font-medium">
                {primaryGuest.nombres} {primaryGuest.apellido_paterno} {primaryGuest.apellido_materno || ""}
              </TableCell>
              <TableCell>
                {typeof primaryGuest.documentType === 'object' && primaryGuest.documentType?.name 
                  ? primaryGuest.documentType.name 
                  : (primaryGuest.documentType || 'DNI')} {primaryGuest.documentNumber}
              </TableCell>
              <TableCell>{primaryGuest.email || "-"}</TableCell>
              <TableCell>{primaryGuest.phone}</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ) : null}
          {reservation.additionalGuests.map((reservationGuest: any) => (
            <TableRow key={reservationGuest.id}>
              <TableCell className="font-medium">
                {reservationGuest.guest.nombres} {reservationGuest.guest.apellido_paterno} {reservationGuest.guest.apellido_materno || ""}
              </TableCell>
              <TableCell>
                {typeof reservationGuest.guest.documentType === 'object' && reservationGuest.guest.documentType?.name 
                  ? reservationGuest.guest.documentType.name 
                  : (reservationGuest.guest.documentType || 'DNI')} {reservationGuest.guest.documentNumber}
              </TableCell>
              <TableCell>{reservationGuest.guest.email || "-"}</TableCell>
              <TableCell>{reservationGuest.guest.phone}</TableCell>
              <TableCell>Adicional</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onSetPrimary(String(reservationGuest.guest.id))}>
                    Principal
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onRemoveGuest(reservationGuest.id)}>
                    Quitar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {reservation.additionalGuests.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          No hay huespedes adicionales registrados.
        </p>
      ) : null}
    </Card>
  );
}
