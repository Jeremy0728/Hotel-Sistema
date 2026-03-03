import { useState, useMemo } from 'react';

interface Invoice {
  id: number;
  invoice_number: string;
  reservation_id?: number;
  guest_id?: number;
  issue_date: string;
  due_date: string;
  status: string;
  subtotal: string;
  tax: string;
  total: string;
  paid_amount: string;
  balance: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  is_active: boolean;
}

interface UseInvoiceOperationsProps {
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  onAddPayment?: (invoiceId: number, payment: any) => Promise<void>;
}

export function useInvoiceOperations({
  invoices,
  paymentMethods,
  onAddPayment,
}: UseInvoiceOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Filtrar facturas
  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();
    return invoices.filter((invoice) => {
      const matchesSearch =
        (invoice.invoice_number || '').toLowerCase().includes(query) ||
        String(invoice.guest_id || '').toLowerCase().includes(query) ||
        String(invoice.reservation_id || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' ? true : invoice.status === statusFilter;
      const matchesFrom = dateFrom ? (invoice.issue_date || '') >= dateFrom : true;
      const matchesTo = dateTo ? (invoice.issue_date || '') <= dateTo : true;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [invoices, search, statusFilter, dateFrom, dateTo]);

  // Métricas
  const totalBilled = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);
  }, [invoices]);

  const totalPending = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + parseFloat(invoice.balance), 0);
  }, [invoices]);

  const totalOverdue = useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + parseFloat(invoice.balance), 0);
  }, [invoices]);

  const handleOpenPayment = (invoice: Invoice) => {
    setActiveInvoice(invoice);
    setPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setPaymentOpen(false);
    setActiveInvoice(null);
  };

  const handlePaymentSubmit = async (values: any) => {
    if (!activeInvoice || !onAddPayment) return;
    await onAddPayment(activeInvoice.id, values);
    handleClosePayment();
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    activeInvoice,
    paymentOpen,
    filteredInvoices,
    totalBilled,
    totalPending,
    totalOverdue,
    handleOpenPayment,
    handleClosePayment,
    handlePaymentSubmit,
  };
}
