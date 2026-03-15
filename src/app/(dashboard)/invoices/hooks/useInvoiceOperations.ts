import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { pagosApi } from '@/apis/pagos.api';
import type { Invoice, PaymentMethod } from '@/types/invoice';

interface PaymentFormData {
  amount: number;
  methodId?: string;
  date?: string;
  reference?: string;
  notes?: string;
}

interface UseInvoiceOperationsProps {
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  refreshInvoices: () => void;
}

export function useInvoiceOperations({
  invoices,
  refreshInvoices,
}: UseInvoiceOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Calcular balance de una factura
  const calculateBalance = (invoice: Invoice) => {
    const total = typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount;
    // Calcular el monto pagado a partir de all_related_payments con status 'completed'
    const paid = invoice.all_related_payments?.reduce((sum, payment) => {
      const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
      return sum + (payment.status === 'completed' ? amount : 0);
    }, 0) || 0;
    return total - paid;
  };

  // Filtrar facturas
  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();
    return invoices.filter((invoice) => {
      const guestName = invoice.guest ? `${invoice.guest.nombres} ${invoice.guest.apellido_paterno}`.toLowerCase() : '';
      const corporateName = invoice.corporateClient?.company_name?.toLowerCase() || '';
      const matchesSearch =
        (invoice.invoice_number || '').toLowerCase().includes(query) ||
        guestName.includes(query) ||
        corporateName.includes(query) ||
        (invoice.reservation?.confirmation_code || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' ? true : invoice.status === statusFilter;
      const matchesFrom = dateFrom ? (invoice.issue_date || '') >= dateFrom : true;
      const matchesTo = dateTo ? (invoice.issue_date || '') <= dateTo : true;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [invoices, search, statusFilter, dateFrom, dateTo]);

  // Métricas
  const totalBilled = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      const amount = typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount;
      return sum + amount;
    }, 0);
  }, [invoices]);

  const totalPending = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + calculateBalance(invoice), 0);
  }, [invoices]);

  // lógica para facturas vencidas cuando se agregue el campo due_date
  const totalOverdue = useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + calculateBalance(invoice), 0);
  }, [invoices]);

  const handleOpenPayment = (invoice: Invoice) => {
    setActiveInvoice(invoice);
    setPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setPaymentOpen(false);
    setActiveInvoice(null);
  };

  const handlePaymentSubmit = async (values: PaymentFormData) => {
    if (!activeInvoice) return;
    await handleAddPayment(activeInvoice.id, values);
    handleClosePayment();
  };

  // Función para agregar pago a una factura
  const handleAddPayment = async (invoiceId: number, paymentData: PaymentFormData) => {
    try {
      await pagosApi.crear({
        invoice_id: invoiceId,
        amount: paymentData.amount,
        payment_method_id: paymentData.methodId ? parseInt(paymentData.methodId) : undefined,
        payment_date: paymentData.date || new Date().toISOString(),
        status: 'completed',
        transaction_id: paymentData.reference || undefined,
        notes: paymentData.notes || undefined,
      });
      toast.success('Pago registrado exitosamente');
      refreshInvoices();
    } catch (error) {
      console.error('Error al registrar pago:', error);
      toast.error('Error al registrar pago');
      throw error;
    }
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
    calculateBalance,
    handleOpenPayment,
    handleClosePayment,
    handlePaymentSubmit,
    handleAddPayment,
  };
}
