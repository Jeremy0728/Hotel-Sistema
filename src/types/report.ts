import { SaleItems } from "./saleItems";
import { PurchaseInterface } from "./purchase";
export interface dataReportCompras {
    purchases: PurchaseInterface[];
    totalPurchases: number;
    totalAmount: number;
    topPurchaseProduct: string
}
export interface dataReportVentas {
    sales: SaleItems[];
    totalSales: number;
    totalRevenue: number;
    salesGrowth: number;
    averageOrderValue: number;
    topSellingProduct: string
}
export interface Report {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}
export interface ResponseReportVentas {
    count?: number;
    message: string;
    data: dataReportVentas;
}

export interface ResponseReportCompras {
    count?: number;
    message: string;
    data: dataReportCompras;
}

export interface filtersReportToVentas {
    productId: number | null;
    startDate: string ;
    endDate: string ;
    userId: string | null;
}

export interface formDataReportVentas {
    salesData: SaleItems[];
    metricsData: {
        totalSales: number;
        totalRevenue: number;
        salesGrowth: number;
        averageOrderValue: number;
        topSellingProduct: string
    };
    chartData: {
        timeSeriesData: {time: string, value: number}[];
        productSalesData: {label: string, value: number, color: string}[];
        monthlySalesData: {time: string, value: number}[];
    };
}

export interface ReportFiltersProps {
    filters:filtersReportToVentas;
    onFiltersChange: (filters: filtersReportToVentas) => void;
    type: 'sales' | 'purchases';
}