"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useGuests } from "@/hooks/useGuests";
import { useGuestOperations } from "../hooks/useGuestOperations";
import GuestFiltersCard from "./guest-filters-card";
import GuestTableRow from "./guest-table-row";
import GuestMobileCard from "./guest-mobile-card";
import GuestForm from "./guest-form";
import type { GuestFormValues } from "@/lib/hotel-schemas";

export default function GuestsPage() {
  // Obtener datos desde hook useGuests
  const { guests: apiGuests, isLoading: guestsLoading } = useGuests({ limit: 100 });

  // Funciones para agregar y actualizar huéspedes (TODO: implementar con API real)
  const handleAddGuest = async (guest: any) => {
    // TODO: Llamar a huespedesApi.crear
    console.log("Add guest:", guest);
  };

  const handleUpdateGuest = async (id: number, updates: any) => {
    // TODO: Llamar a huespedesApi.actualizar
    console.log("Update guest:", id, updates);
  };

  // Hook de operaciones de huéspedes
  const {
    search,
    setSearch,
    nationalityFilter,
    setNationalityFilter,
    documentFilter,
    setDocumentFilter,
    pageSize,
    setPageSize,
    formOpen,
    editingGuest,
    nationalities,
    documentTypes,
    filteredGuests,
    paginatedGuests,
    totalPages,
    currentPage,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handlePreviousPage,
    handleNextPage,
  } = useGuestOperations({
    guests: apiGuests,
    onAddGuest: handleAddGuest,
    onUpdateGuest: handleUpdateGuest,
  });

  if (guestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando huéspedes...</p>
        </div>
      </div>
    );
  }

  const defaultValues: GuestFormValues = editingGuest
    ? {
        firstName: editingGuest.first_name,
        lastName: editingGuest.last_name,
        secondLastName: "",
        birthDate: editingGuest.date_of_birth ?? "",
        documentType: editingGuest.document_type,
        documentNumber: editingGuest.document_number,
        email: editingGuest.email,
        phone: editingGuest.phone,
        nationality: editingGuest.nationality ?? "",
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
      <GuestFiltersCard
        search={search}
        setSearch={setSearch}
        nationalityFilter={nationalityFilter}
        setNationalityFilter={setNationalityFilter}
        documentFilter={documentFilter}
        setDocumentFilter={setDocumentFilter}
        pageSize={pageSize}
        setPageSize={setPageSize}
        nationalities={nationalities}
        documentTypes={documentTypes}
        onOpenCreate={handleOpenCreate}
      />

      {filteredGuests.length === 0 ? (
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
                  {paginatedGuests.map((guest) => (
                    <GuestTableRow
                      key={guest.id}
                      guest={guest}
                      onEdit={handleOpenEdit}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="grid gap-3 md:hidden">
            {paginatedGuests.map((guest) => (
              <GuestMobileCard
                key={guest.id}
                guest={guest}
                onEdit={handleOpenEdit}
              />
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
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={formOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGuest ? "Editar huésped" : "Nuevo huésped"}
            </DialogTitle>
          </DialogHeader>
          <GuestForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            submitLabel={editingGuest ? "Guardar cambios" : "Crear huésped"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
