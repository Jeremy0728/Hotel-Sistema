import { useState, useMemo } from 'react';
import { serviciosAdicionalesApi } from '@/apis/servicios-adicionales.api';
import toast from 'react-hot-toast';

interface Service {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes?: number;
  category: string;
  is_active: boolean;
}

interface UseServiceOperationsProps {
  services: Service[];
  refreshServices: () => void;
}

export function useServiceOperations({
  services,
  refreshServices,
}: UseServiceOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  // Filtrar servicios
  const filteredServices = useMemo(() => {
    const query = search.toLowerCase();
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? service.is_active
          : !service.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingService(null);
  };

  const handleAddService = async (serviceData: any) => {
    try {
      await serviciosAdicionalesApi.crear({
        name: serviceData.name,
        description: serviceData.description || undefined,
        price: serviceData.price.toString(),
        duration_minutes: serviceData.durationMinutes,
        category: serviceData.category,
        is_active: serviceData.status === 'active',
      });
      toast.success('Servicio creado exitosamente');
      refreshServices();
    } catch (error) {
      console.error('Error al crear servicio:', error);
      toast.error('Error al crear servicio');
      throw error;
    }
  };

  const handleUpdateService = async (id: number, serviceData: any) => {
    try {
      await serviciosAdicionalesApi.actualizar(id, {
        name: serviceData.name,
        description: serviceData.description || undefined,
        price: serviceData.price.toString(),
        duration_minutes: serviceData.durationMinutes,
        category: serviceData.category,
        is_active: serviceData.status === 'active',
      });
      toast.success('Servicio actualizado exitosamente');
      refreshServices();
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      toast.error('Error al actualizar servicio');
      throw error;
    }
  };

  const handleRemoveService = async (id: number) => {
    try {
      await serviciosAdicionalesApi.eliminar(id);
      toast.success('Servicio eliminado exitosamente');
      refreshServices();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      toast.error('Error al eliminar servicio');
      throw error;
    }
  };

  const handleSubmit = async (values: any) => {
    if (editingService) {
      await handleUpdateService(editingService.id, values);
    } else {
      await handleAddService(values);
    }
    handleCloseForm();
  };

  const handleOpenDelete = (service: Service) => {
    setDeleteTarget(service);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await handleRemoveService(deleteTarget.id);
    }
    handleCloseDelete();
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    formOpen,
    editingService,
    deleteTarget,
    filteredServices,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
