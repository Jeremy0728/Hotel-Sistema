import { useState, useMemo } from 'react';

interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface UsePaymentMethodOperationsProps {
  paymentMethods: PaymentMethod[];
  onAddMethod?: (method: any) => Promise<void>;
  onUpdateMethod?: (id: number, updates: any) => Promise<void>;
}

export function usePaymentMethodOperations({
  paymentMethods,
  onAddMethod,
  onUpdateMethod,
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

  const handleSubmit = async (values: any) => {
    if (editingMethod && onUpdateMethod) {
      await onUpdateMethod(editingMethod.id, values);
    } else if (onAddMethod) {
      await onAddMethod(values);
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
