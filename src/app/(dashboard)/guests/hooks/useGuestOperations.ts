import { useState, useMemo } from 'react';
import { huespedesApi } from '@/apis/huespedes.api';
import toast from 'react-hot-toast';

interface DocumentType {
  id: number;
  code: string;
  name: string;
}

interface Country {
  id: number;
  code: string;
  name: string;
  nationality: string;
}

interface Guest {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  document_type_id?: number;
  document_number?: string;
  document_type?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country_id?: number;
  documentType?: DocumentType;
  country?: Country;
}

interface UseGuestOperationsProps {
  guests: Guest[];
  refreshGuests: () => void;
}

export function useGuestOperations({
  guests,
  refreshGuests,
}: UseGuestOperationsProps) {
  const [search, setSearch] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Extraer opciones únicas de nacionalidades y tipos de documento
  const nationalities = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.country?.nationality).filter(Boolean))),
    [guests]
  );

  const documentTypes = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.document_type).filter(Boolean))),
    [guests]
  );

  // Filtrar huéspedes
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const query = search.toLowerCase();
      const fullName = `${guest.nombres} ${guest.apellido_paterno} ${guest.apellido_materno || ''}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) ||
        (guest.document_number && guest.document_number.toLowerCase().includes(query)) ||
        (guest.email && guest.email.toLowerCase().includes(query));
      const matchesNationality =
        nationalityFilter === 'all' ? true : guest.country?.nationality === nationalityFilter;
      const matchesDocument =
        documentFilter === 'all' ? true : guest.document_type === documentFilter;
      return matchesSearch && matchesNationality && matchesDocument;
    });
  }, [guests, search, nationalityFilter, documentFilter]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedGuests = useMemo(() => {
    return filteredGuests.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredGuests, currentPage, pageSize]);

  const handleOpenCreate = () => {
    setEditingGuest(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingGuest(null);
  };

  const handleAddGuest = async (guestData: Omit<Guest, 'id'>) => {
    try {
      await huespedesApi.crear(guestData);
      toast.success('Huésped creado exitosamente');
      refreshGuests();
    } catch (error) {
      console.error('Error al crear huésped:', error);
      toast.error('Error al crear huésped');
      throw error;
    }
  };

  const handleUpdateGuest = async (id: number, updates: Partial<Guest>) => {
    try {
      await huespedesApi.actualizar(id, updates);
      toast.success('Huésped actualizado exitosamente');
      refreshGuests();
    } catch (error) {
      console.error('Error al actualizar huésped:', error);
      toast.error('Error al actualizar huésped');
      throw error;
    }
  };

  const handleSubmit = async (values: any) => {
    const guestData = {
      nombres: values.firstName,
      apellido_paterno: values.lastName,
      apellido_materno: values.secondLastName || undefined,
      document_type_id: values.documentType ? parseInt(values.documentType, 10) : undefined,
      document_number: values.documentNumber || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      country_id: values.nationality ? parseInt(values.nationality, 10) : undefined,
      city: values.city || undefined,
      address: values.address || undefined,
      date_of_birth: values.birthDate || undefined,
    };

    if (editingGuest) {
      await handleUpdateGuest(editingGuest.id, guestData);
    } else {
      await handleAddGuest(guestData);
    }
    handleCloseForm();
  };

  const handlePreviousPage = () => {
    setPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setPage(Math.min(totalPages, currentPage + 1));
  };

  return {
    search,
    setSearch,
    nationalityFilter,
    setNationalityFilter,
    documentFilter,
    setDocumentFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    formOpen,
    editingGuest,
    nationalities,
    documentTypes,
    filteredGuests,
    paginatedGuests,
    totalPages,
    currentPage,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handlePreviousPage,
    handleNextPage,
  };
}
