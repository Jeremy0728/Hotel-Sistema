"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useInventoryLocations } from "@/hooks/useInventoryLocations";
import { useInventory } from "@/hooks/useInventory";
import { useRooms } from "@/hooks/useRooms";
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
import InventoryProductsTab from "./inventory-products-tab";
import InventoryCategoriesTab from "./inventory-categories-tab";
import InventoryLocationsTab from "./inventory-locations-tab";
import InventoryStockTab from "./inventory-stock-tab";


export default function InventoryPage() {
  // Obtener datos desde hooks individuales
  const { products: apiProducts, isLoading: productsLoading, refreshProducts } = useProducts({ limit: 100 });
  const { categories: apiCategories, isLoading: categoriesLoading, refreshCategories } = useProductCategories({ limit: 100 });
  const { locations: apiLocations, isLoading: locationsLoading, refreshLocations } = useInventoryLocations({ limit: 100 });
  const { inventory: apiInventory, isLoading: inventoryLoading, refreshInventory } = useInventory({ limit: 100 });
  const { rooms, isLoading: roomsLoading } = useRooms({ limit: 100 });

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
    refreshProducts,
    refreshCategories,
    refreshLocations,
    refreshInventory,
  });

  // Función para refrescar datos al cambiar de tab
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // Refrescar solo los datos del tab seleccionado
    switch (newTab) {
      case 'products':
        refreshProducts();
        break;
      case 'categories':
        refreshCategories();
        break;
      case 'locations':
        refreshLocations();
        break;
      case 'stock':
        refreshInventory();
        break;
    }
  };

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
        categoryId: editingProduct.category_id,
        price: parseFloat(editingProduct.price),
        cost: editingProduct.cost ? parseFloat(editingProduct.cost) : 0,
        status: editingProduct.is_active ? "active" : "inactive",
        trackStock: true,
        description: editingProduct.description ?? "",
      }
    : {
        name: "",
        sku: "",
        categoryId: apiCategories[0]?.id ?? "",
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
        type: editingLocation.location_type,
        roomId: editingLocation.room_id ?? undefined,
        status: editingLocation.is_active ? "active" : "inactive",
      }
    : {
        name: "",
        type: "storage",
        roomId: undefined,
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

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <InventoryProductsTab
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            productCategoryFilter={productCategoryFilter}
            setProductCategoryFilter={setProductCategoryFilter}
            productStatusFilter={productStatusFilter}
            setProductStatusFilter={setProductStatusFilter}
            filteredProducts={filteredProducts}
            categories={apiCategories}
            onOpenCreateProduct={handleOpenCreateProduct}
            onOpenEditProduct={handleOpenEditProduct}
          />
        </TabsContent>

        <TabsContent value="categories">
          <InventoryCategoriesTab
            categorySearch={categorySearch}
            setCategorySearch={setCategorySearch}
            filteredCategories={filteredCategories}
            products={apiProducts}
            onOpenCreateCategory={handleOpenCreateCategory}
            onOpenEditCategory={handleOpenEditCategory}
          />
        </TabsContent>

        <TabsContent value="locations">
          <InventoryLocationsTab
            locationSearch={locationSearch}
            setLocationSearch={setLocationSearch}
            filteredLocations={filteredLocations}
            onOpenCreateLocation={handleOpenCreateLocation}
            onOpenEditLocation={handleOpenEditLocation}
          />
        </TabsContent>

        <TabsContent value="stock">
          <InventoryStockTab
            stockLocationId={stockLocationId}
            setStockLocationId={setStockLocationId}
            locations={apiLocations}
            stockItems={stockItems}
            products={apiProducts}
            onOpenAdjustStock={handleOpenAdjustStock}
          />
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
            rooms={rooms}
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
