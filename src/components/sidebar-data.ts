import {
  Banknote,
  Building2,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Recepción",
      url: "#",
      icon: UserRound,
      isActive: true,
      items: [
        {
          title: "Habitaciones",
          url: "/recepcion/habitaciones",
          circleColor: "bg-green-500",
        },
        {
          title: "Reservas",
          url: "/reservations",
          circleColor: "bg-yellow-500",
        },
        {
          title: "Check-in",
          url: "/checkin",
          circleColor: "bg-emerald-600",
          badgeKey: "checkins",
        },
        {
          title: "Check-out",
          url: "/checkout",
          circleColor: "bg-orange-500",
          badgeKey: "checkouts",
        },
        {
          title: "Huéspedes",
          url: "/guests",
          circleColor: "bg-blue-500",
        },
        {
          title: "Alertas",
          url: "/notification-alert",
          circleColor: "bg-red-500",
          badgeKey: "alerts",
        },
      ],
    },
    {
      title: "Operaciones",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Configuracion habitaciones",
          url: "/operaciones/habitaciones/configuracion",
          circleColor: "bg-green-500",
        },
        {
          title: "Tipos de habitacion",
          url: "/room-types",
          circleColor: "bg-blue-500",
        },
        {
          title: "Tarifas y reglas",
          url: "/services",
          circleColor: "bg-cyan-500",
        },
        {
          title: "Housekeeping",
          url: "/housekeeping",
          circleColor: "bg-amber-500",
        },
        {
          title: "Inventario",
          url: "/inventory",
          circleColor: "bg-purple-500",
        },
      ],
    },
    {
      title: "Finanzas",
      url: "#",
      icon: Banknote,
      isActive: true,
      items: [
        {
          title: "Facturas",
          url: "/invoices",
          circleColor: "bg-emerald-600",
        },
        {
          title: "Pagos",
          url: "/payment-methods",
          circleColor: "bg-yellow-500",
        },
        {
          title: "Ventas",
          url: "/sales",
          circleColor: "bg-emerald-500",
        },
        {
          title: "Reportes",
          url: "/analytics",
          circleColor: "bg-blue-500",
        },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "HQ Super-admin",
          url: "/hq",
          circleColor: "bg-indigo-500",
        },
        {
          title: "Usuarios",
          url: "/users-list",
          circleColor: "bg-slate-600",
        },
        {
          title: "Roles",
          url: "/roles",
          circleColor: "bg-slate-500",
        },
        {
          title: "Configuración",
          url: "/hotel-settings",
          circleColor: "bg-blue-500",
        },
      ],
    },
  ],
};
