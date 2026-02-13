import { SaleItems } from "./saleItems";
export interface Sale {
    id?: number;
    invoice_number: string;
    date: Date;
    user_id: number;
    status: string;
    cancellation_reason: string;  
}

export interface ResponseSale {
    data: Sale[];
    count?: number;
    message: string;
}

export interface ResponseSaleById {
    data: Sale;
    count?: number;
    message: string;
}

export interface SaleDataSend {
   saleItems: SaleItems[];
}
