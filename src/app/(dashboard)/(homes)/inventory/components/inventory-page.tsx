"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/hotel/empty-state";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useInventoryLocations } from "@/hooks/useInventoryLocations";
import { useInventory } from "@/hooks/useInventory";
import { useInventoryOperations } from "../hooks/useInventoryOperations";
import type {
  CategoryFormValues,
  LocationFormValues,
  ProductFormValues,
  StockAdjustValues,
} from "@/lib/hotel-schemas";
import InventoryProductForm from "./inventory-product-form";
import InventoryCategoryForm from "./inventory-category-form";
import InventoryLocationForm from "./inventory-location-form";
import InventoryStockAdjustForm from "./inventory-stock-adjust-form";

const productStatusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

const locationTypeLabels: Record<string, string> = {
  reception: "Recepcion",
  minibar: "Minibar",
  storage: "Almacen",
  restaurant: "Restaurante",
};

const statusBadgeClass = (active: boolean) =>
  active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-700";

export default function InventoryPage() {
  // Obtener datos desde hooks individuales
  const { products: apiProducts, isLoading: productsLoading } = useProducts({ limit: 100 });
  const { categories: apiCategories, isLoading: categoriesLoading } = useProductCategories({ limit: 100 });
  const { locations: apiLocations, isLoading: locationsLoading } = useInventoryLocations({ limit: 100 });
  const { inventory: apiInventory, isLoading: inventoryLoading } = useInventory({ limit: 100 });

  // Funciones para operaciones CRUD (TODO: implementar con APIs reales)
  const handleAddProduct = async (product: any) => {
    // TODO: Llamar a productosApi.crear
    console.log("Add product:", product);
  };

  const handleUpdateProduct = async (id: number, updates: any) => {
    // TODO: Llamar a productosApi.actualizar
    console.log("Update product:", id, updates);
  };

  const handleAddCategory = async (category: any) => {
    // TODO: Llamar a categoriasProductosApi.crear
    console.log("Add category:", category);
  };

  const handleUpdateCategory = async (id: number, updates: any) => {
    // TODO: Llamar a categoriasProductosApi.actualizar
    console.log("Update category:", id, updates);
  };

  const handleAddLocation = async (location: any) => {
    // TODO: Llamar a ubicacionesInventarioApi.crear
    console.log("Add location:", location);
  };

  const handleUpdateLocation = async (id: number, updates: any) => {
    // TODO: Llamar a ubicacionesInventarioApi.actualizar
    console.log("Update location:", id, updates);
  };

  const handleUpdateInventory = async (id: number, updates: any) => {
    // TODO: Llamar a inventarioApi.actualizar
    console.log("Update inventory:", id, updates);
  };

  // Hook de operaciones de inventario
  const {
    activeTab,
    setActiveTab,
    productSearch,
    setProductSearch,
    productCategoryFilter,
    setProductCategoryFilter,
    productStatusFilter,
    setProductStatusFilter,
    filteredProducts,
    productDialogOpen,
    editingProduct,
    handleOpenCreateProduct,
    handleOpenEditProduct,
    handleCloseProductDialog,
    handleProductSubmit,
    categorySearch,
    setCategorySearch,
    filteredCategories,
    categoryDialogOpen,
    editingCategory,
    handleOpenCreateCategory,
    handleOpenEditCategory,
    handleCloseCategoryDialog,
    handleCategorySubmit,
    locationSearch,
    setLocationSearch,
    filteredLocations,
    locationDialogOpen,
    editingLocation,
    handleOpenCreateLocation,
    handleOpenEditLocation,
    handleCloseLocationDialog,
    handleLocationSubmit,
    stockLocationId,
    setStockLocationId,
    stockItems,
    stockDialogOpen,
    adjustingItem,
    handleOpenAdjustStock,
    handleCloseStockDialog,
    handleAdjustStock,
  } = useInventoryOperations({
    products: apiProducts,
    categories: apiCategories,
    locations: apiLocations,
    inventory: apiInventory,
    onAddProduct: handleAddProduct,
    onUpdateProduct: handleUpdateProduct,
    onAddCategory: handleAddCategory,
    onUpdateCategory: handleUpdateCategory,
    onAddLocation: handleAddLocation,
    onUpdateLocation: handleUpdateLocation,
    onUpdateInventory: handleUpdateInventory,
  });

  if (productsLoading || categoriesLoading || locationsLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  const productDefaultValues: ProductFormValues = editingProduct
    ? {
        name: editingProduct.name,
        sku: editingProduct.sku || "",
        categoryId: String(editingProduct.category_id),
        price: parseFloat(editingProduct.price),
        cost: editingProduct.cost ? parseFloat(editingProduct.cost) : 0,
        status: editingProduct.is_active ? "active" : "inactive",
        trackStock: true,
        description: editingProduct.description ?? "",
      }
    : {
        name: "",
        sku: "",
        categoryId: apiCategories[0]?.id?.toString() ?? "",
        price: 0,
        cost: 0,
        status: "active",
        trackStock: true,
        description: "",
      };

  const categoryDefaultValues: CategoryFormValues = editingCategory
    ? {
        name: editingCategory.name,
        description: editingCategory.description ?? "",
        status: editingCategory.is_active ? "active" : "inactive",
      }
    : {
        name: "",
        description: "",
        status: "active",
      };

  const locationDefaultValues: LocationFormValues = editingLocation
    ? {
        name: editingLocation.name,
        type: editingLocation.type as any,
        roomId: editingLocation.room_id?.toString() ?? "",
        status: editingLocation.is_active ? "active" : "inactive",
      }
    : {
        name: "",
        type: "storage",
        roomId: "",
        status: "active",
      };

  const stockDefaultValues: StockAdjustValues = adjustingItem
    ? {
        stock: adjustingItem.quantity,
        minStock: adjustingItem.min_stock ?? 0,
      }
    : {
        stock: 0,
        minStock: 0,
      };

  const selectedLocation = apiLocations.find((loc) => loc.id === Number(stockLocationId));

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Inventario</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Control de productos, categorias, ubicaciones y stock
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeTab === "products" ? (
              <Button onClick={handleOpenCreateProduct}>Agregar producto</Button>
            ) : null}
            {activeTab === "categories" ? (
              <Button onClick={handleOpenCreateCategory}>Agregar categoria</Button>
            ) : null}
            {activeTab === "locations" ? (
              <Button onClick={handleOpenCreateLocation}>Agregar ubicacion</Button>
            ) : null}
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
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
                  {apiCategories.map((category) => (
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
              action={<Button onClick={handleOpenCreateProduct}>Agregar producto</Button>}
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
                    const category = apiCategories.find(c => c.id === product.category_id);
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.sku || "-"}</TableCell>
                        <TableCell>{category?.name || "Sin categoría"}</TableCell>
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
                            onClick={() => handleOpenEditProduct(product)}
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
        </TabsContent>

        <TabsContent value="categories">
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
              action={<Button onClick={handleOpenCreateCategory}>Agregar categoria</Button>}
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
                    const count = apiProducts.filter(
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
                            onClick={() => handleOpenEditCategory(category)}
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
        </TabsContent>

        <TabsContent value="locations">
          <Card className="p-4 flex flex-col gap-4">
            <Input
              placeholder="Buscar ubicacion"
              value={locationSearch}
              onChange={(event) => setLocationSearch(event.target.value)}
            />
          </Card>

          {filteredLocations.length === 0 ? (
            <EmptyState
              title="Sin ubicaciones"
              description="No hay ubicaciones registradas."
              action={<Button onClick={handleOpenCreateLocation}>Agregar ubicacion</Button>}
            />
          ) : (
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ubicacion</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Habitacion</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        {location.name}
                      </TableCell>
                      <TableCell>
                        {locationTypeLabels[location.type] ?? location.type}
                      </TableCell>
                      <TableCell>
                        {location.room_id ? `#${location.room_id}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-full",
                            statusBadgeClass(location.is_active)
                          )}
                        >
                          {location.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEditLocation(location)}
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
        </TabsContent>

        <TabsContent value="stock">
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
                  {apiLocations.map((location) => (
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
                    ? `${locationTypeLabels[selectedLocation.type] ?? selectedLocation.type}`
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
                    const product = apiProducts.find(p => p.id === item.product_id);
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
                            onClick={() => handleOpenAdjustStock(item)}
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
        </TabsContent>
      </Tabs>

      <Dialog open={productDialogOpen} onOpenChange={handleCloseProductDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
          </DialogHeader>
          <InventoryProductForm
            defaultValues={productDefaultValues}
            categories={apiCategories as any}
            onSubmit={handleProductSubmit}
            onCancel={handleCloseProductDialog}
            submitLabel={editingProduct ? "Guardar cambios" : "Crear producto"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={handleCloseCategoryDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar categoria" : "Nueva categoria"}
            </DialogTitle>
          </DialogHeader>
          <InventoryCategoryForm
            defaultValues={categoryDefaultValues}
            onSubmit={handleCategorySubmit}
            onCancel={handleCloseCategoryDialog}
            submitLabel={editingCategory ? "Guardar cambios" : "Crear categoria"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={locationDialogOpen} onOpenChange={handleCloseLocationDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Editar ubicacion" : "Nueva ubicacion"}
            </DialogTitle>
          </DialogHeader>
          <InventoryLocationForm
            defaultValues={locationDefaultValues}
            rooms={[]}
            onSubmit={handleLocationSubmit}
            onCancel={handleCloseLocationDialog}
            submitLabel={editingLocation ? "Guardar cambios" : "Crear ubicacion"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={stockDialogOpen} onOpenChange={handleCloseStockDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar stock</DialogTitle>
          </DialogHeader>
          <InventoryStockAdjustForm
            defaultValues={stockDefaultValues}
            onSubmit={handleAdjustStock}
            onCancel={handleCloseStockDialog}
            submitLabel="Actualizar stock"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
