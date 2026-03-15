import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { metodosPagoApi } from '@/apis/metodos-pago.api';
import type { PaymentMethod, PaymentMethodType } from '@/types/payment-method';

interface PaymentMethodFormValues {
  name: string;
  type: PaymentMethodType;
  status: 'active' | 'inactive';
}

interface UsePaymentMethodOperationsProps {
  paymentMethods: PaymentMethod[];
  refreshPaymentMethods: () => void;
}

export function usePaymentMethodOperations({
  paymentMethods,
  refreshPaymentMethods,
}: UsePaymentMethodOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  // Filtrar métodos de pago
  const filteredMethods = useMemo(() => {
    const query = search.toLowerCase();
    return paymentMethods.filter((method) => {
      const matchesSearch = (method.name || '').toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? method.is_active
          : !method.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [paymentMethods, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingMethod(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMethod(null);
  };

  const handleAddMethod = async (values: PaymentMethodFormValues) => {
    try {
      await metodosPagoApi.crear({
        name: values.name,
        type: values.type,
        is_active: values.status === 'active',
      });
      toast.success('Método de pago creado exitosamente');
      refreshPaymentMethods();
    } catch (error) {
      console.error('Error al crear método de pago:', error);
      toast.error('Error al crear método de pago');
      throw error;
    }
  };

  const handleUpdateMethod = async (id: number, values: PaymentMethodFormValues) => {
    try {
      await metodosPagoApi.actualizar(id, {
        name: values.name,
        type: values.type,
        is_active: values.status === 'active',
      });
      toast.success('Método de pago actualizado exitosamente');
      refreshPaymentMethods();
    } catch (error) {
      console.error('Error al actualizar método de pago:', error);
      toast.error('Error al actualizar método de pago');
      throw error;
    }
  };

  const handleSubmit = async (values: PaymentMethodFormValues) => {
    if (editingMethod) {
      await handleUpdateMethod(editingMethod.id, values);
    } else {
      await handleAddMethod(values);
    }
    handleCloseDialog();
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    editingMethod,
    filteredMethods,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSubmit,
  };
}
