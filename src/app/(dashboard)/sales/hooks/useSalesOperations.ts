import { useState, useMemo } from 'react';

type SaleStatus = 'completed' | 'cancelled' | 'pending';

interface Sale {
  id: number;
  sale_number: string;
  sale_date: string;
  customer_id?: number;
  reservation_id?: number;
  location_id: number;
  subtotal: string;
  tax: string;
  discount?: string;
  total: string;
  payment_method_id: number;
  status: SaleStatus;
  notes?: string;
  sold_by: number;
}

interface UseSalesOperationsProps {
  sales: Sale[];
}

export function useSalesOperations({ sales }: UseSalesOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SaleStatus | 'all'>('all');

  // Filtrar ventas
  const filteredSales = useMemo(() => {
    const query = search.toLowerCase();
    return sales.filter((sale) => {
      const matchesSearch =
        (sale.sale_number || '').toLowerCase().includes(query) ||
        String(sale.customer_id || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' ? true : sale.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredSales,
  };
}
