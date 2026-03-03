"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { usePaymentMethodOperations } from "../hooks/usePaymentMethodOperations";
import type { PaymentMethodValues } from "@/lib/hotel-schemas";
import PaymentMethodForm from "./payment-method-form";
import PaymentMethodFiltersCard from "./payment-method-filters-card";
import PaymentMethodTableRow from "./payment-method-table-row";

export default function PaymentMethodsPage() {
  // Obtener datos desde hooks individuales
  const { paymentMethods: apiPaymentMethods, isLoading: methodsLoading } = usePaymentMethods({ limit: 100 });

  // Funciones para operaciones CRUD (TODO: implementar con APIs reales)
  const handleAddMethod = async (method: any) => {
    // TODO: Llamar a metodosPagoApi.crear
    console.log("Add method:", method);
  };

  const handleUpdateMethod = async (id: number, updates: any) => {
    // TODO: Llamar a metodosPagoApi.actualizar
    console.log("Update method:", id, updates);
  };

  // Hook de operaciones de métodos de pago
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    editingMethod,
    filteredMethods,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSubmit,
  } = usePaymentMethodOperations({
    paymentMethods: apiPaymentMethods,
    onAddMethod: handleAddMethod,
    onUpdateMethod: handleUpdateMethod,
  });

  if (methodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando métodos de pago...</p>
        </div>
      </div>
    );
  }

  const defaultValues: PaymentMethodValues = editingMethod
    ? {
        name: editingMethod.name,
        type: "cash",
        status: editingMethod.is_active ? "active" : "inactive",
      }
    : {
        name: "",
        type: "cash",
        status: "active",
      };

  return (
    <div className="space-y-6">
      <PaymentMethodFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenCreate={handleOpenCreate}
      />

      {filteredMethods.length === 0 ? (
        <EmptyState
          title="Sin metodos"
          description="No hay metodos de pago registrados."
          action={<Button onClick={handleOpenCreate}>Agregar metodo</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metodo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMethods.map((method) => (
                <PaymentMethodTableRow
                  key={method.id}
                  method={method}
                  onEdit={handleOpenEdit}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "Editar metodo" : "Nuevo metodo"}
            </DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            submitLabel={editingMethod ? "Guardar cambios" : "Crear metodo"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
