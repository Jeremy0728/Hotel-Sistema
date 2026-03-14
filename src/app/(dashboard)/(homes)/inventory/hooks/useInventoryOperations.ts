import { useState, useMemo } from 'react';
import { productosApi } from '@/apis/productos.api';
import { categoriasProductosApi } from '@/apis/categorias-productos.api';
import { ubicacionesInventarioApi } from '@/apis/ubicaciones-inventario.api';
import { inventarioApi } from '@/apis/inventario.api';
import toast from 'react-hot-toast';
import type {
  InventoryProduct,
  ProductCategory,
  InventoryLocation,
  InventoryItem,
  InventoryLocationType,
} from '@/types/inventory';

interface UseInventoryOperationsProps {
  products: InventoryProduct[];
  categories: ProductCategory[];
  locations: InventoryLocation[];
  inventory: InventoryItem[];
  refreshProducts: () => void;
  refreshCategories: () => void;
  refreshLocations: () => void;
  refreshInventory: () => void;
}

export function useInventoryOperations({
  products,
  categories,
  locations,
  inventory,
  refreshProducts,
  refreshCategories,
  refreshLocations,
  refreshInventory,
}: UseInventoryOperationsProps) {
  const [activeTab, setActiveTab] = useState('products');

  // Product filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');

  // Category filters
  const [categorySearch, setCategorySearch] = useState('');

  // Location filters
  const [locationSearch, setLocationSearch] = useState('');

  // Stock filters
  const [stockLocationId, setStockLocationId] = useState(locations[0]?.id?.toString() ?? '');

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);

  // Editing states
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingLocation, setEditingLocation] = useState<InventoryLocation | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);

  // Filtered products
  const filteredProducts = useMemo(() => {
    const query = productSearch.toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        (product.sku || '').toLowerCase().includes(query);
      const matchesCategory =
        productCategoryFilter === 'all'
          ? true
          : product.category_id === Number(productCategoryFilter);
      const matchesStatus =
        productStatusFilter === 'all'
          ? true
          : productStatusFilter === 'active'
          ? product.is_active
          : !product.is_active;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const query = categorySearch.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, categorySearch]);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    const query = locationSearch.toLowerCase();
    return locations.filter((location) =>
      location.name.toLowerCase().includes(query)
    );
  }, [locations, locationSearch]);

  // Stock items
  const stockItems = useMemo(() => {
    if (!stockLocationId) return [];
    return inventory.filter((item) => item.location_id === Number(stockLocationId));
  }, [inventory, stockLocationId]);

  // Product operations
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  const handleOpenEditProduct = (product: InventoryProduct) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await productosApi.actualizar(editingProduct.id, {
          name: values.name,
          description: values.description || undefined,
          category_id: parseInt(values.categoryId, 10),
          price: values.price.toString(),
          cost: values.cost ? values.cost.toString() : undefined,
          sku: values.sku || undefined,
          unit: 'unidad',
          is_active: values.status === 'active',
        });
        toast.success('Producto actualizado exitosamente');
      } else {
        await productosApi.crear({
          name: values.name,
          description: values.description || undefined,
          category_id: parseInt(values.categoryId, 10),
          price: values.price.toString(),
          cost: values.cost ? values.cost.toString() : undefined,
          sku: values.sku || undefined,
          unit: 'unidad',
          is_active: values.status === 'active',
        });
        toast.success('Producto creado exitosamente');
      }
      refreshProducts();
      handleCloseProductDialog();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error('Error al guardar producto');
      throw error;
    }
  };

  // Category operations
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleOpenEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await categoriasProductosApi.actualizar(editingCategory.id, {
          name: values.name,
          description: values.description || undefined,
          is_active: values.status === 'active',
        });
        toast.success('Categoría actualizada exitosamente');
      } else {
        await categoriasProductosApi.crear({
          name: values.name,
          description: values.description || undefined,
          is_active: values.status === 'active',
        });
        toast.success('Categoría creada exitosamente');
      }
      refreshCategories();
      handleCloseCategoryDialog();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      toast.error('Error al guardar categoría');
      throw error;
    }
  };

  // Location operations
  const handleOpenCreateLocation = () => {
    setEditingLocation(null);
    setLocationDialogOpen(true);
  };

  const handleOpenEditLocation = (location: InventoryLocation) => {
    setEditingLocation(location);
    setLocationDialogOpen(true);
  };

  const handleCloseLocationDialog = () => {
    setLocationDialogOpen(false);
    setEditingLocation(null);
  };

  const handleLocationSubmit = async (values: any) => {
    try {
      // Mapear tipos de la aplicación a tipos de la API
      const locationTypeMap: Record<InventoryLocationType, "almacen" | "minibar" | "cocina" | "bar" | "otro"> = {
        storage: 'almacen',
        minibar: 'minibar',
        restaurant: 'cocina',
        reception: 'bar',
        warehouse: 'otro',
      };
      
      const mappedType = locationTypeMap[values.type as InventoryLocationType] || 'otro';
      
      if (editingLocation) {
        await ubicacionesInventarioApi.actualizar(editingLocation.id, {
          name: values.name,
          location_type: mappedType,
          is_active: values.status === 'active',
          room_id: values.roomId ? parseInt(values.roomId) : null,
        });
        toast.success('Ubicación actualizada exitosamente');
      } else {
        await ubicacionesInventarioApi.crear({
          name: values.name,
          location_type: mappedType,
          is_active: values.status === 'active',
          room_id: values.roomId ? parseInt(values.roomId) : null,
        });
        toast.success('Ubicación creada exitosamente');
      }
      refreshLocations();
      handleCloseLocationDialog();
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
      toast.error('Error al guardar ubicación');
      throw error;
    }
  };

  // Stock operations
  const handleOpenAdjustStock = (item: InventoryItem) => {
    setAdjustingItem(item);
    setStockDialogOpen(true);
  };

  const handleCloseStockDialog = () => {
    setStockDialogOpen(false);
    setAdjustingItem(null);
  };

  const handleAdjustStock = async (values: any) => {
    try {
      if (adjustingItem) {
        await inventarioApi.actualizar(adjustingItem.id, {
          quantity: values.stock,
          min_stock: values.minStock,
        });
        toast.success('Stock actualizado exitosamente');
        refreshInventory();
      }
      handleCloseStockDialog();
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      toast.error('Error al ajustar stock');
      throw error;
    }
  };

  return {
    activeTab,
    setActiveTab,
    // Product state
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
    // Category state
    categorySearch,
    setCategorySearch,
    filteredCategories,
    categoryDialogOpen,
    editingCategory,
    handleOpenCreateCategory,
    handleOpenEditCategory,
    handleCloseCategoryDialog,
    handleCategorySubmit,
    // Location state
    locationSearch,
    setLocationSearch,
    filteredLocations,
    locationDialogOpen,
    editingLocation,
    handleOpenCreateLocation,
    handleOpenEditLocation,
    handleCloseLocationDialog,
    handleLocationSubmit,
    // Stock state
    stockLocationId,
    setStockLocationId,
    stockItems,
    stockDialogOpen,
    adjustingItem,
    handleOpenAdjustStock,
    handleCloseStockDialog,
    handleAdjustStock,
  };
}
