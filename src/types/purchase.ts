import { Product } from "./product";

export interface PurchaseInterface {
    id?: number;
    product_id: number;
    product?: Product;
    quantity: number;
    purchase_price: number;
    user_id?: number;
    user_name?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ResponsePurchase {
    data: PurchaseInterface;
    message: string;
}
