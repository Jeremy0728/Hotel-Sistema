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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";
import type {
  InventoryItem,
  InventoryLocation,
  Product,
  ProductCategory,
} from "@/types/hotel";
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
  const {
    rooms,
    categories,
    products,
    locations,
    inventory,
    addProduct,
    updateProduct,
    addCategory,
    updateCategory,
    addLocation,
    updateLocation,
    updateInventoryItem,
  } = useHotelData();

  const [activeTab, setActiveTab] = useState("products");

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStatusFilter, setProductStatusFilter] = useState("all");

  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [stockLocationId, setStockLocationId] = useState(
    locations[0]?.id ?? ""
  );

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(
    null
  );
  const [editingLocation, setEditingLocation] =
    useState<InventoryLocation | null>(null);
  const [adjustingItem, setAdjustingItem] =
    useState<InventoryItem | null>(null);

  const filteredProducts = useMemo(() => {
    const query = productSearch.toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesCategory =
        productCategoryFilter === "all"
          ? true
          : product.categoryId === productCategoryFilter;
      const matchesStatus =
        productStatusFilter === "all"
          ? true
          : product.status === productStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter]);

  const filteredCategories = useMemo(() => {
    const query = categorySearch.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, categorySearch]);

  const filteredLocations = useMemo(() => {
    const query = locationSearch.toLowerCase();
    return locations.filter((location) =>
      location.name.toLowerCase().includes(query)
    );
  }, [locations, locationSearch]);

  const stockItems = useMemo(() => {
    if (!stockLocationId) return [];
    return inventory.filter((item) => item.locationId === stockLocationId);
  }, [inventory, stockLocationId]);

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleProductSubmit = (values: ProductFormValues) => {
    const category = categories.find((item) => item.id === values.categoryId);
    const categoryName = category ? category.name : "Sin categoria";

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...values,
        categoryName,
      });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        ...values,
        categoryName,
      });
    }

    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  const productDefaultValues: ProductFormValues = editingProduct
    ? {
        name: editingProduct.name,
        sku: editingProduct.sku,
        categoryId: editingProduct.categoryId,
        price: editingProduct.price,
        cost: editingProduct.cost,
        status: editingProduct.status,
        trackStock: editingProduct.trackStock,
        description: editingProduct.description ?? "",
      }
    : {
        name: "",
        sku: "",
        categoryId: categories[0]?.id ?? "",
        price: 0,
        cost: 0,
        status: "active",
        trackStock: true,
        description: "",
      };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const openEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, values);
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        ...values,
      });
    }

    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const categoryDefaultValues: CategoryFormValues = editingCategory
    ? {
        name: editingCategory.name,
        description: editingCategory.description ?? "",
        status: editingCategory.status,
      }
    : {
        name: "",
        description: "",
        status: "active",
      };

  const openCreateLocation = () => {
    setEditingLocation(null);
    setLocationDialogOpen(true);
  };

  const openEditLocation = (location: InventoryLocation) => {
    setEditingLocation(location);
    setLocationDialogOpen(true);
  };

  const handleLocationSubmit = (values: LocationFormValues) => {
    const room = rooms.find((item) => item.id === values.roomId);
    const roomNumber = room?.number;

    const payload = {
      ...values,
      roomId: values.type === "minibar" ? values.roomId : undefined,
      roomNumber: values.type === "minibar" ? roomNumber : undefined,
    };

    if (editingLocation) {
      updateLocation(editingLocation.id, payload);
    } else {
      addLocation({
        id: `loc-${Date.now()}`,
        ...payload,
      });
    }

    if (!stockLocationId && locations.length === 0) {
      setStockLocationId(editingLocation?.id ?? "");
    }

    setLocationDialogOpen(false);
    setEditingLocation(null);
  };

  const locationDefaultValues: LocationFormValues = editingLocation
    ? {
        name: editingLocation.name,
        type: editingLocation.type,
        roomId: editingLocation.roomId ?? "",
        status: editingLocation.status,
      }
    : {
        name: "",
        type: "storage",
        roomId: "",
        status: "active",
      };

  const openAdjustStock = (item: InventoryItem) => {
    setAdjustingItem(item);
    setStockDialogOpen(true);
  };

  const handleAdjustStock = (values: StockAdjustValues) => {
    if (!adjustingItem) return;
    updateInventoryItem(adjustingItem.id, values);
    setStockDialogOpen(false);
    setAdjustingItem(null);
  };

  const stockDefaultValues: StockAdjustValues = adjustingItem
    ? {
        stock: adjustingItem.stock,
        minStock: adjustingItem.minStock,
      }
    : {
        stock: 0,
        minStock: 0,
      };

  const selectedLocation = locations.find((loc) => loc.id === stockLocationId);

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
              <Button onClick={openCreateProduct}>Agregar producto</Button>
            ) : null}
            {activeTab === "categories" ? (
              <Button onClick={openCreateCategory}>Agregar categoria</Button>
            ) : null}
            {activeTab === "locations" ? (
              <Button onClick={openCreateLocation}>Agregar ubicacion</Button>
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
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
              action={<Button onClick={openCreateProduct}>Agregar producto</Button>}
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
                    const margin =
                      product.price > 0
                        ? Math.round(
                            ((product.price - product.cost) / product.price) * 100
                          )
                        : 0;
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.categoryName}</TableCell>
                        <TableCell>S/ {product.price}</TableCell>
                        <TableCell>S/ {product.cost}</TableCell>
                        <TableCell>{margin}%</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "rounded-full",
                              statusBadgeClass(product.status === "active")
                            )}
                          >
                            {product.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "rounded-full",
                              product.trackStock
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-neutral-200 text-neutral-700"
                            )}
                          >
                            {product.trackStock ? "Requiere" : "No aplica"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditProduct(product)}
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
              action={<Button onClick={openCreateCategory}>Agregar categoria</Button>}
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
                      (product) => product.categoryId === category.id
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
                              statusBadgeClass(category.status === "active")
                            )}
                          >
                            {category.status === "active" ? "Activa" : "Inactiva"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditCategory(category)}
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
              action={<Button onClick={openCreateLocation}>Agregar ubicacion</Button>}
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
                        {location.roomNumber ? `#${location.roomNumber}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-full",
                            statusBadgeClass(location.status === "active")
                          )}
                        >
                          {location.status === "active" ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditLocation(location)}
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
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
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
                  {stockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-full",
                            item.stock <= item.minStock
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {item.stock <= item.minStock ? "Bajo" : "OK"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openAdjustStock(item)}
                        >
                          Ajustar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
          </DialogHeader>
          <InventoryProductForm
            defaultValues={productDefaultValues}
            categories={categories}
            onSubmit={handleProductSubmit}
            onCancel={() => setProductDialogOpen(false)}
            submitLabel={editingProduct ? "Guardar cambios" : "Crear producto"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar categoria" : "Nueva categoria"}
            </DialogTitle>
          </DialogHeader>
          <InventoryCategoryForm
            defaultValues={categoryDefaultValues}
            onSubmit={handleCategorySubmit}
            onCancel={() => setCategoryDialogOpen(false)}
            submitLabel={editingCategory ? "Guardar cambios" : "Crear categoria"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Editar ubicacion" : "Nueva ubicacion"}
            </DialogTitle>
          </DialogHeader>
          <InventoryLocationForm
            defaultValues={locationDefaultValues}
            rooms={rooms}
            onSubmit={handleLocationSubmit}
            onCancel={() => setLocationDialogOpen(false)}
            submitLabel={editingLocation ? "Guardar cambios" : "Crear ubicacion"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar stock</DialogTitle>
          </DialogHeader>
          <InventoryStockAdjustForm
            defaultValues={stockDefaultValues}
            onSubmit={handleAdjustStock}
            onCancel={() => setStockDialogOpen(false)}
            submitLabel="Actualizar stock"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
