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
import type { PaymentMethod } from "@/types/hotel";
import type { PaymentMethodValues } from "@/lib/hotel-schemas";
import PaymentMethodForm from "./payment-method-form";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

export default function PaymentMethodsPage() {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return paymentMethods.filter((method) => {
      const matchesSearch = method.name.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" ? true : method.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentMethods, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingMethod(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setDialogOpen(true);
  };

  const handleSubmit = (values: PaymentMethodValues) => {
    if (editingMethod) {
      updatePaymentMethod(editingMethod.id, values);
    } else {
      addPaymentMethod({
        id: `pm-${Date.now()}`,
        ...values,
      });
    }
    setDialogOpen(false);
    setEditingMethod(null);
  };

  const defaultValues: PaymentMethodValues = editingMethod
    ? {
        name: editingMethod.name,
        type: editingMethod.type,
        status: editingMethod.status,
      }
    : {
        name: "",
        type: "cash",
        status: "active",
      };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Metodos de pago</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Configuracion de metodos disponibles
            </p>
          </div>
          <Button onClick={handleOpenCreate}>Agregar metodo</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Buscar metodo"
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
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>{method.type}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full",
                        method.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-700"
                      )}
                    >
                      {method.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(method)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "Editar metodo" : "Nuevo metodo"}
            </DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editingMethod ? "Guardar cambios" : "Crear metodo"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
