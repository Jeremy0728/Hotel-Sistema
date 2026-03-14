import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/hotel/empty-state";
import { cn } from "@/lib/utils";
import type { InventoryLocation, InventoryItem, InventoryProduct, InventoryLocationType } from "@/types/inventory";

const locationTypeLabels: Record<InventoryLocationType, string> = {
  reception: "Recepcion",
  minibar: "Minibar",
  storage: "Almacen",
  restaurant: "Restaurante",
  warehouse: "Bodega",
};

interface InventoryStockTabProps {
  stockLocationId: string;
  setStockLocationId: (value: string) => void;
  locations: InventoryLocation[];
  stockItems: InventoryItem[];
  products: InventoryProduct[];
  onOpenAdjustStock: (item: InventoryItem) => void;
}

export default function InventoryStockTab({
  stockLocationId,
  setStockLocationId,
  locations,
  stockItems,
  products,
  onOpenAdjustStock,
}: InventoryStockTabProps) {
  const selectedLocation = locations.find((loc) => loc.id === Number(stockLocationId));

  return (
    <>
      <Card className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            value={stockLocationId}
            onValueChange={setStockLocationId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona ubicacion" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={String(location.id)}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            readOnly
            value={
              selectedLocation
                ? `${locationTypeLabels[selectedLocation.location_type] ?? selectedLocation.location_type}`
                : "Sin ubicacion"
            }
          />
        </div>
      </Card>

      {stockLocationId && stockItems.length === 0 ? (
        <EmptyState
          title="Sin stock"
          description="No hay productos asignados a esta ubicacion."
        />
      ) : null}

      {stockItems.length > 0 ? (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Minimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => {
                const product = products.find(p => p.id === item.product_id);
                const minStock = item.min_stock ?? 0;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {product?.name || "Producto desconocido"}
                    </TableCell>
                    <TableCell>{product?.sku || "-"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{minStock}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-full",
                          item.quantity <= minStock
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {item.quantity <= minStock ? "Bajo" : "OK"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenAdjustStock(item)}
                      >
                        Ajustar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : null}
    </>
  );
}
