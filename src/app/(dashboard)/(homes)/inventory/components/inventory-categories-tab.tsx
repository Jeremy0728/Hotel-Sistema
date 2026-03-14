import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/hotel/empty-state";
import { cn } from "@/lib/utils";
import type { InventoryProduct, ProductCategory } from "@/types/inventory";

const statusBadgeClass = (active: boolean) =>
  active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-700";

interface InventoryCategoriesTabProps {
  categorySearch: string;
  setCategorySearch: (value: string) => void;
  filteredCategories: ProductCategory[];
  products: InventoryProduct[];
  onOpenCreateCategory: () => void;
  onOpenEditCategory: (category: ProductCategory) => void;
}

export default function InventoryCategoriesTab({
  categorySearch,
  setCategorySearch,
  filteredCategories,
  products,
  onOpenCreateCategory,
  onOpenEditCategory,
}: InventoryCategoriesTabProps) {
  return (
    <>
      <Card className="p-4 flex flex-col gap-4">
        <Input
          placeholder="Buscar categoria"
          value={categorySearch}
          onChange={(event) => setCategorySearch(event.target.value)}
        />
      </Card>

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="Sin categorias"
          description="No hay categorias disponibles."
          action={<Button onClick={onOpenCreateCategory}>Agregar categoria</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => {
                const count = products.filter(
                  (product) => product.category_id === category.id
                ).length;
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{count}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-full",
                          statusBadgeClass(category.is_active)
                        )}
                      >
                        {category.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenEditCategory(category)}
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
