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
import type { CorporateClient } from "@/types/hotel";
import type { CorporateClientValues } from "@/lib/hotel-schemas";
import CorporateClientForm from "./corporate-client-form";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

export default function CorporateClientsPage() {
  const { corporateClients, addCorporateClient, updateCorporateClient } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<CorporateClient | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return corporateClients.filter((client) => {
      const matchesSearch =
        client.companyName.toLowerCase().includes(query) ||
        client.contactName.toLowerCase().includes(query) ||
        client.taxId.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" ? true : client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [corporateClients, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (client: CorporateClient) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleSubmit = (values: CorporateClientValues) => {
    if (editingClient) {
      updateCorporateClient(editingClient.id, values);
    } else {
      addCorporateClient({
        id: `corp-${Date.now()}`,
        ...values,
      });
    }
    setDialogOpen(false);
    setEditingClient(null);
  };

  const defaultValues: CorporateClientValues = editingClient
    ? {
        companyName: editingClient.companyName,
        contactName: editingClient.contactName,
        contactEmail: editingClient.contactEmail,
        contactPhone: editingClient.contactPhone,
        taxId: editingClient.taxId,
        discount: editingClient.discount,
        paymentTerms: editingClient.paymentTerms,
        country: editingClient.country ?? "",
        status: editingClient.status,
      }
    : {
        companyName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        taxId: "",
        discount: 0,
        paymentTerms: 30,
        country: "",
        status: "active",
      };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Clientes corporativos</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Convenios empresariales y condiciones comerciales
            </p>
          </div>
          <Button onClick={handleOpenCreate}>Agregar cliente</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Buscar por empresa, contacto o RUC"
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
          title="Sin clientes corporativos"
          description="No hay clientes para mostrar."
          action={<Button onClick={handleOpenCreate}>Agregar cliente</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>RUC</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Terminos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.companyName}</TableCell>
                  <TableCell>
                    <div>{client.contactName}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-300">
                      {client.contactEmail} · {client.contactPhone}
                    </div>
                  </TableCell>
                  <TableCell>{client.taxId}</TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-full", "bg-blue-100 text-blue-700")}>
                      {client.discount}%
                    </Badge>
                  </TableCell>
                  <TableCell>{client.paymentTerms} dias</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full",
                        client.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-700"
                      )}
                    >
                      {client.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(client)}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Editar cliente" : "Nuevo cliente"}
            </DialogTitle>
          </DialogHeader>
          <CorporateClientForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editingClient ? "Guardar cambios" : "Crear cliente"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
