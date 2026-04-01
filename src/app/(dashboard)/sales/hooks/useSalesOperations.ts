import { useState, useMemo } from 'react';
import type { Sale, PaymentStatus } from '@/types/sale';

interface UseSalesOperationsProps {
  sales: Sale[];
}

export function useSalesOperations({ sales }: UseSalesOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  // Filtrar ventas
  const filteredSales = useMemo(() => {
    const query = search.toLowerCase();
    return sales.filter((sale) => {
      const guestName = sale.guest 
        ? `${sale.guest.nombres} ${sale.guest.apellido_paterno} ${sale.guest.apellido_materno || ''}`.toLowerCase() 
        : '';
      const matchesSearch =
        (sale.sale_number || '').toLowerCase().includes(query) ||
        guestName.includes(query) ||
        (sale.reservation?.confirmation_code || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' ? true : sale.payment_status === statusFilter;
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
