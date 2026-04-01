"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useSales } from "@/hooks/useSales";
import { useSalesOperations } from "../hooks/useSalesOperations";
import SalesFiltersCard from "./sales-filters-card";
import SalesTableRow from "./sales-table-row";

export default function SalesPage() {
  // Obtener datos desde hooks individuales
  const { sales: apiSales, isLoading: salesLoading } = useSales({ limit: 100 });
  console.log("🚀 ~ SalesPage ~ apiSales:", apiSales)

  // Hook de operaciones de ventas
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredSales,
  } = useSalesOperations({
    sales: apiSales,
  });

  if (salesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SalesFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredSales.length === 0 ? (
        <EmptyState
          title="Sin ventas"
          description="No hay ventas que coincidan con los filtros actuales."
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <SalesTableRow key={sale.id} sale={sale} />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
