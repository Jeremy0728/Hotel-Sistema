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
import type { InventoryProduct, ProductCategory } from "@/types/inventory";

const productStatusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

const statusBadgeClass = (active: boolean) =>
  active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-700";

interface InventoryProductsTabProps {
  productSearch: string;
  setProductSearch: (value: string) => void;
  productCategoryFilter: string;
  setProductCategoryFilter: (value: string) => void;
  productStatusFilter: string;
  setProductStatusFilter: (value: string) => void;
  filteredProducts: InventoryProduct[];
  categories: ProductCategory[];
  onOpenCreateProduct: () => void;
  onOpenEditProduct: (product: InventoryProduct) => void;
}

export default function InventoryProductsTab({
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  productStatusFilter,
  setProductStatusFilter,
  filteredProducts,
  categories,
  onOpenCreateProduct,
  onOpenEditProduct,
}: InventoryProductsTabProps) {
  return (
    <>
      <Card className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Buscar producto o SKU"
            value={productSearch}
            onChange={(event) => setProductSearch(event.target.value)}
          />
          <Select
            value={productCategoryFilter}
            onValueChange={setProductCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={productStatusFilter}
            onValueChange={setProductStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {productStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Sin productos"
          description="No hay productos que coincidan con los filtros actuales."
          action={<Button onClick={onOpenCreateProduct}>Agregar producto</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Margen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Inventario</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const price = parseFloat(product.price);
                const cost = product.cost ? parseFloat(product.cost) : 0;
                const margin =
                  price > 0
                    ? Math.round(((price - cost) / price) * 100)
                    : 0;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>{product.category?.name || "Sin categoría"}</TableCell>
                    <TableCell>S/ {price.toFixed(2)}</TableCell>
                    <TableCell>S/ {cost.toFixed(2)}</TableCell>
                    <TableCell>{margin}%</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-full",
                          statusBadgeClass(product.is_active)
                        )}
                      >
                        {product.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-full",
                          "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        Requiere
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenEditProduct(product)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
