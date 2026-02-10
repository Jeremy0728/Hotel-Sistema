"use client";

import { useMemo, useState } from "react";
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
import type { Guest } from "@/types/hotel";
import GuestForm from "./guest-form";
import type { GuestFormValues } from "@/lib/hotel-schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";

const pageSizes = [10, 25, 50];

export default function GuestsPage() {
  const { guests, addGuest, updateGuest } = useHotelData();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [documentFilter, setDocumentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const nationalities = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.nationality))),
    [guests]
  );
  const documentTypes = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.documentType))),
    [guests]
  );

  const filtered = guests.filter((guest) => {
    const query = search.toLowerCase();
    const fullName = `${guest.firstName} ${guest.lastName} ${guest.secondLastName ?? ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      guest.documentNumber.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query);
    const matchesNationality =
      nationalityFilter === "all" ? true : guest.nationality === nationalityFilter;
    const matchesDocument =
      documentFilter === "all" ? true : guest.documentType === documentFilter;
    return matchesSearch && matchesNationality && matchesDocument;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingGuest(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormOpen(true);
  };

  const handleSubmit = (values: GuestFormValues) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, {
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
    } else {
      addGuest({
        id: `guest-${Date.now()}`,
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
    }
    setFormOpen(false);
  };

  const defaultValues: GuestFormValues = editingGuest
    ? {
        firstName: editingGuest.firstName,
        lastName: editingGuest.lastName,
        secondLastName: editingGuest.secondLastName ?? "",
        birthDate: editingGuest.birthDate ?? "",
        documentType: editingGuest.documentType,
        documentNumber: editingGuest.documentNumber,
        email: editingGuest.email,
        phone: editingGuest.phone,
        nationality: editingGuest.nationality,
        country: editingGuest.country ?? "",
        city: editingGuest.city ?? "",
        address: editingGuest.address ?? "",
      }
    : {
        firstName: "",
        lastName: "",
        secondLastName: "",
        birthDate: "",
        documentType: "",
        documentNumber: "",
        email: "",
        phone: "",
        nationality: "",
        country: "",
        city: "",
        address: "",
      };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Huéspedes</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Base de datos de huéspedes y contactos
            </p>
          </div>
          <Button onClick={handleOpenCreate}>Agregar huésped</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Buscar por nombre, documento o email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Nacionalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {nationalities.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={documentFilter} onValueChange={setDocumentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {documentTypes.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filas" />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin huéspedes"
          description="No hay huéspedes para mostrar con los filtros actuales."
          action={<Button onClick={handleOpenCreate}>Agregar huésped</Button>}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Nacionalidad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((guest) => (
                    <TableRow
                      key={guest.id}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/guests/${guest.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/guests/${guest.id}`);
                        }
                      }}
                    >
                      <TableCell className="font-medium">
                        {guest.firstName} {guest.lastName} {guest.secondLastName}
                      </TableCell>
                      <TableCell>
                        {guest.documentType} {guest.documentNumber}
                      </TableCell>
                      <TableCell>{guest.email || "—"}</TableCell>
                      <TableCell>{guest.phone}</TableCell>
                      <TableCell>{guest.nationality}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/guests/${guest.id}`} onClick={(event) => event.stopPropagation()}>
                              Ver perfil
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenEdit(guest);
                            }}
                          >
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="grid gap-3 md:hidden">
            {paginated.map((guest) => (
              <Card key={guest.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {guest.firstName} {guest.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-300">
                      {guest.documentType} {guest.documentNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/guests/${guest.id}`}>Ver</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(guest)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-2">
                  {guest.email || "Sin email"} · {guest.phone}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
                  {guest.nationality}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGuest ? "Editar huésped" : "Nuevo huésped"}
            </DialogTitle>
          </DialogHeader>
          <GuestForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            submitLabel={editingGuest ? "Guardar cambios" : "Crear huésped"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
