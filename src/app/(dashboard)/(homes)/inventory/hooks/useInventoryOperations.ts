import { useState, useMemo } from 'react';

interface Product {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  price: string;
  cost?: string;
  sku?: string;
  is_active: boolean;
}

interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface InventoryLocation {
  id: number;
  name: string;
  type: string;
  room_id?: number;
  is_active: boolean;
}

interface InventoryItem {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  min_stock?: number;
  max_stock?: number;
}

interface UseInventoryOperationsProps {
  products: Product[];
  categories: ProductCategory[];
  locations: InventoryLocation[];
  inventory: InventoryItem[];
  onAddProduct?: (product: any) => Promise<void>;
  onUpdateProduct?: (id: number, updates: any) => Promise<void>;
  onAddCategory?: (category: any) => Promise<void>;
  onUpdateCategory?: (id: number, updates: any) => Promise<void>;
  onAddLocation?: (location: any) => Promise<void>;
  onUpdateLocation?: (id: number, updates: any) => Promise<void>;
  onUpdateInventory?: (id: number, updates: any) => Promise<void>;
}

export function useInventoryOperations({
  products,
  categories,
  locations,
  inventory,
  onAddProduct,
  onUpdateProduct,
  onAddCategory,
  onUpdateCategory,
  onAddLocation,
  onUpdateLocation,
  onUpdateInventory,
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (values: any) => {
    if (editingProduct && onUpdateProduct) {
      await onUpdateProduct(editingProduct.id, values);
    } else if (onAddProduct) {
      await onAddProduct(values);
    }
    handleCloseProductDialog();
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
    if (editingCategory && onUpdateCategory) {
      await onUpdateCategory(editingCategory.id, values);
    } else if (onAddCategory) {
      await onAddCategory(values);
    }
    handleCloseCategoryDialog();
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
    if (editingLocation && onUpdateLocation) {
      await onUpdateLocation(editingLocation.id, values);
    } else if (onAddLocation) {
      await onAddLocation(values);
    }
    handleCloseLocationDialog();
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
    if (adjustingItem && onUpdateInventory) {
      await onUpdateInventory(adjustingItem.id, values);
    }
    handleCloseStockDialog();
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
