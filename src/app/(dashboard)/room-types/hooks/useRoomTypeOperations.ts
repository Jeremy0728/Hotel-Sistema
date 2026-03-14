import { useState, useMemo } from 'react';
import { tiposHabitacionApi } from '@/apis/tipos-habitacion.api';
import toast from 'react-hot-toast';

interface RoomType {
  id: number;
  name: string;
  description?: string;
  base_price?: string;
  max_occupancy: number;
  amenities?: Record<string, unknown>;
  is_active: boolean;
}

interface UseRoomTypeOperationsProps {
  roomTypes: RoomType[];
  refreshRoomTypes: () => void;
}

export function useRoomTypeOperations({
  roomTypes,
  refreshRoomTypes,
}: UseRoomTypeOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);

  const filteredRoomTypes = useMemo(() => {
    const query = search.toLowerCase();
    return roomTypes.filter((type) => {
      const matchesSearch =
        type.name.toLowerCase().includes(query) ||
        (type.description ?? '').toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? type.is_active
          : !type.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [roomTypes, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingType(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (roomType: RoomType) => {
    setEditingType(roomType);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingType(null);
  };

  const handleAddRoomType = async (roomTypeData: any) => {
    try {
      await tiposHabitacionApi.crear({
        name: roomTypeData.name,
        description: roomTypeData.description || undefined,
        max_occupancy: roomTypeData.maxGuests,
        amenities: roomTypeData.amenities,
        is_active: roomTypeData.status === 'active',
      });
      toast.success('Tipo de habitación creado exitosamente');
      refreshRoomTypes();
    } catch (error) {
      console.error('Error al crear tipo de habitación:', error);
      toast.error('Error al crear tipo de habitación');
      throw error;
    }
  };

  const handleUpdateRoomType = async (id: number, roomTypeData: any) => {
    try {
      await tiposHabitacionApi.actualizar(id, {
        name: roomTypeData.name,
        description: roomTypeData.description || undefined,
        max_occupancy: roomTypeData.maxGuests,
        amenities: roomTypeData.amenities,
        is_active: roomTypeData.status === 'active',
      });
      toast.success('Tipo de habitación actualizado exitosamente');
      refreshRoomTypes();
    } catch (error) {
      console.error('Error al actualizar tipo de habitación:', error);
      toast.error('Error al actualizar tipo de habitación');
      throw error;
    }
  };

  const handleRemoveRoomType = async (id: number) => {
    try {
      await tiposHabitacionApi.eliminar(id);
      toast.success('Tipo de habitación eliminado exitosamente');
      refreshRoomTypes();
    } catch (error) {
      console.error('Error al eliminar tipo de habitación:', error);
      toast.error('Error al eliminar tipo de habitación');
      throw error;
    }
  };

  const handleSubmit = async (values: any) => {
    const amenities = values.amenities
      ? values.amenities
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

    if (editingType) {
      await handleUpdateRoomType(editingType.id, { ...values, amenities });
    } else {
      await handleAddRoomType({
        ...values,
        amenities,
      });
    }

    handleCloseDialog();
  };

  const handleOpenDelete = (roomType: RoomType) => {
    setDeleteTarget(roomType);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await handleRemoveRoomType(deleteTarget.id);
    }
    handleCloseDelete();
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    editingType,
    deleteTarget,
    filteredRoomTypes,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSubmit,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
