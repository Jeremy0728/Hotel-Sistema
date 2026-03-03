import { useState, useMemo } from 'react';

interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  document_type: string;
  document_number: string;
  nationality?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface UseGuestOperationsProps {
  guests: Guest[];
  onAddGuest?: (guest: Omit<Guest, 'id'>) => Promise<void>;
  onUpdateGuest?: (id: number, updates: Partial<Guest>) => Promise<void>;
}

export function useGuestOperations({
  guests,
  onAddGuest,
  onUpdateGuest,
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
    () => Array.from(new Set(guests.map((guest) => guest.nationality).filter(Boolean))),
    [guests]
  );

  const documentTypes = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.document_type))),
    [guests]
  );

  // Filtrar huéspedes
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const query = search.toLowerCase();
      const fullName = `${guest.first_name} ${guest.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(query) ||
        guest.document_number.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query);
      const matchesNationality =
        nationalityFilter === 'all' ? true : guest.nationality === nationalityFilter;
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

  const handleSubmit = async (values: any) => {
    if (editingGuest && onUpdateGuest) {
      await onUpdateGuest(editingGuest.id, {
        first_name: values.firstName,
        last_name: values.lastName,
        document_type: values.documentType,
        document_number: values.documentNumber,
        email: values.email || '',
        phone: values.phone,
        nationality: values.nationality,
        country: values.country,
        city: values.city,
        address: values.address,
        date_of_birth: values.birthDate,
      });
    } else if (onAddGuest) {
      await onAddGuest({
        first_name: values.firstName,
        last_name: values.lastName,
        document_type: values.documentType,
        document_number: values.documentNumber,
        email: values.email || '',
        phone: values.phone,
        nationality: values.nationality,
        country: values.country,
        city: values.city,
        address: values.address,
        date_of_birth: values.birthDate,
      });
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
