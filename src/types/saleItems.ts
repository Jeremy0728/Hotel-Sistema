import { Product } from "./product";

export interface SaleItems {
    id?: number;
    sale_id?: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    createdAt?: string;
    updatedAt?: string;
    user_name?: string;
    product?: Product;
}
