"use client";

import { useMemo, useState } from "react";
import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const notificationTypes = ["operativas", "sistema", "sap"] as const;

type NotificationType = (typeof notificationTypes)[number];
type NotificationStatus = "unread" | "read" | "resolved";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  link?: string;
  time: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "operativas",
    title: "Reserva sin pago",
    message: "RSV-240102 pendiente de cobro",
    status: "unread",
    link: "/reservations",
    time: "Hace 5 min",
  },
  {
    id: "n2",
    type: "operativas",
    title: "Habitación por limpiar",
    message: "Habitación 201 en estado limpieza",
    status: "read",
    link: "/rooms?view=housekeeping",
    time: "Hace 12 min",
  },
  {
    id: "n3",
    type: "sistema",
    title: "Actualización aplicada",
    message: "Se actualizó el módulo de reservas",
    status: "read",
    link: "/dashboard",
    time: "Hoy 08:20",
  },
  {
    id: "n4",
    type: "sap",
    title: "Error de sincronización",
    message: "Pagos con SAP no sincronizados",
    status: "unread",
    link: "/invoices",
    time: "Hoy 07:40",
  },
  {
    id: "n5",
    type: "sap",
    title: "SAP OK",
    message: "Sincronización completada",
    status: "resolved",
    link: "/invoices",
    time: "Ayer 19:10",
  },
];

const statusLabel: Record<NotificationStatus, string> = {
  unread: "No leído",
  read: "Leído",
  resolved: "Resuelto",
};

const statusVariant: Record<NotificationStatus, "warning" | "info" | "success"> = {
  unread: "warning",
  read: "info",
  resolved: "success",
};

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [digestEnabled, setDigestEnabled] = useState(false);
  const [mutedTypes, setMutedTypes] = useState<NotificationType[]>([]);

  const handleMarkResolved = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "resolved" } : item
      )
    );
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "unread" ? "read" : item.status }
          : item
      )
    );
  };

  const toggleMute = (type: NotificationType) => {
    setMutedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const grouped = useMemo(() => {
    return notificationTypes.reduce((acc, type) => {
      acc[type] = notifications.filter((item) => item.type === type);
      return acc;
    }, {} as Record<NotificationType, NotificationItem[]>);
  }, [notifications]);

  return (
    <>
      <DashboardBreadcrumb title="Centro de notificaciones" text="Notificaciones" />

      <div className="space-y-6">
        <Card className="p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Bandeja de notificaciones</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Operativas, sistema y SAP en un solo lugar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500 dark:text-neutral-300">
              Digest diario
            </span>
            <Switch checked={digestEnabled} onCheckedChange={setDigestEnabled} />
          </div>
        </Card>

        <Tabs defaultValue="operativas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="operativas">Operativas</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="sap">SAP</TabsTrigger>
          </TabsList>

          {notificationTypes.map((type) => (
            <TabsContent key={type} value={type} className="space-y-3">
              {grouped[type].length === 0 ? (
                <Card className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-300">
                  No hay notificaciones en esta bandeja.
                </Card>
              ) : (
                grouped[type].map((item) => {
                  const muted = mutedTypes.includes(item.type);
                  return (
                    <Card
                      key={item.id}
                      className={`p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between ${
                        muted ? "opacity-50" : ""
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant={statusVariant[item.status]}>
                            {statusLabel[item.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-300">
                          {item.message}
                        </p>
                        <span className="text-xs text-neutral-400">{item.time}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.link ? (
                          <Button size="sm" asChild>
                            <Link href={item.link}>Ir a</Link>
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkRead(item.id)}
                        >
                          Marcar leído
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkResolved(item.id)}
                        >
                          Marcar resuelto
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMute(item.type)}
                        >
                          Silenciar tipo
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
