"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Permission = {
  key: string;
  label: string;
};

type PermissionGroup = {
  module: string;
  permissions: Permission[];
};

const permissionTree: PermissionGroup[] = [
  {
    module: "Reservas",
    permissions: [
      { key: "reservas.leer", label: "Leer" },
      { key: "reservas.crear", label: "Crear" },
      { key: "reservas.editar", label: "Editar" },
      { key: "reservas.eliminar", label: "Eliminar" },
    ],
  },
  {
    module: "Habitaciones",
    permissions: [
      { key: "habitaciones.leer", label: "Leer" },
      { key: "habitaciones.crear", label: "Crear" },
      { key: "habitaciones.editar", label: "Editar" },
      { key: "habitaciones.eliminar", label: "Eliminar" },
    ],
  },
  {
    module: "Finanzas",
    permissions: [
      { key: "facturas.leer", label: "Leer" },
      { key: "pagos.registrar", label: "Registrar pagos" },
      { key: "ventas.leer", label: "Ver ventas" },
      { key: "reportes.ver", label: "Ver reportes" },
    ],
  },
  {
    module: "Usuarios",
    permissions: [
      { key: "usuarios.leer", label: "Leer" },
      { key: "usuarios.crear", label: "Crear" },
      { key: "usuarios.editar", label: "Editar" },
      { key: "usuarios.eliminar", label: "Eliminar" },
    ],
  },
];

const auditLog = [
  { id: "a1", user: "Admin", action: "Editó permisos de Recepción", time: "Hoy 10:12" },
  { id: "a2", user: "Super Admin", action: "Creó rol Housekeeping", time: "Ayer 18:40" },
  { id: "a3", user: "Admin", action: "Asignó rol Financiero a usuario Carla", time: "Ayer 15:22" },
];

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Recepción");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "reservas.leer",
    "reservas.crear",
    "reservas.editar",
    "habitaciones.leer",
  ]);

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
  }, [search]);

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

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Roles y permisos</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Controla acceso por módulo y acción
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Crear rol
            </Button>
            <Button size="sm">Guardar cambios</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="info">Rol activo: {selectedRole}</Badge>
          <Input
            placeholder="Buscar permiso o módulo"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-xs"
          />
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            {["Recepción", "Operaciones", "Finanzas", "Admin", "Housekeeping"].map(
              (role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </Button>
              )
            )}
          </div>
          <div className="lg:col-span-2 space-y-4">
            {filteredTree.map((group) => {
              const groupSelected = group.permissions.every((perm) =>
                selectedPermissions.includes(perm.key)
              );
              return (
                <div
                  key={group.module}
                  className="rounded-lg border border-neutral-200 dark:border-slate-700 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={groupSelected}
                        onCheckedChange={() => toggleGroup(group)}
                      />
                      <span className="font-semibold">{group.module}</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {group.permissions.length} permisos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {group.permissions.map((perm) => (
                      <label
                        key={perm.key}
                        className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-slate-700 px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(perm.key)}
                          onCheckedChange={() => togglePermission(perm.key)}
                        />
                        {perm.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Auditoría reciente</h3>
          <Badge variant="secondary">Últimos 7 días</Badge>
        </div>
        <div className="space-y-2 text-sm">
          {auditLog.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-slate-700 px-3 py-2"
            >
              <div>
                <p className="font-medium">{entry.action}</p>
                <p className="text-xs text-neutral-500">{entry.user}</p>
              </div>
              <span className="text-xs text-neutral-500">{entry.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
