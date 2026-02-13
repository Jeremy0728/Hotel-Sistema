
export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sale_price: number;
  current_stock: number;
  min_stock: number;
  is_active: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ResponseProduct {
    count?: number;
    message: string;
    data: Product[];
}

export interface ResponseProductById {
  data: Product;
  message: string;
}

//INTERFACES PARA EL VENTA DE PRODUCTOS
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface ExtendedProduct extends Product {
  original_stock?: number;
}
export interface CartSummaryProps {
  cart: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  getSubtotal: () => number;
  getIGV: () => number;
  idUser: number | string;
  refetch: () => void;
}
export interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
}
export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
}