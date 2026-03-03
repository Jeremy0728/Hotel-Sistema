import { useState, useMemo } from 'react';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
}

type Permission = {
  key: string;
  label: string;
};

type PermissionGroup = {
  module: string;
  permissions: Permission[];
};

interface UseRoleOperationsProps {
  roles: Role[];
  permissionTree: PermissionGroup[];
}

export function useRoleOperations({ roles, permissionTree }: UseRoleOperationsProps) {
  const [search, setSearch] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
    roles[0]?.id || null
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const selectedRole = useMemo(() => {
    return roles.find((role) => role.id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  // Filtrar árbol de permisos
  const filteredTree = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return permissionTree;
    return permissionTree
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter((perm) =>
          `${group.module} ${perm.label}`.toLowerCase().includes(normalized)
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [search, permissionTree]);

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleGroup = (group: PermissionGroup) => {
    const keys = group.permissions.map((perm) => perm.key);
    const hasAll = keys.every((key) => selectedPermissions.includes(key));
    if (hasAll) {
      setSelectedPermissions((prev) => prev.filter((item) => !keys.includes(item)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...keys])));
    }
  };

  return {
    search,
    setSearch,
    selectedRoleId,
    setSelectedRoleId,
    selectedRole,
    selectedPermissions,
    setSelectedPermissions,
    filteredTree,
    togglePermission,
    toggleGroup,
  };
}
