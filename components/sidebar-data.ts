import { Building2, House } from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Hotel",
          url: "/dashboard",
          circleColor: "bg-primary",
        },
      ],
    },
    {
      label: "Hotel",
    },
    {
      title: "Operaciones",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Habitaciones",
          url: "/rooms",
          circleColor: "bg-green-500",
        },
        {
          title: "Tipos de habitacion",
          url: "/room-types",
          circleColor: "bg-emerald-500",
        },
        {
          title: "Huéspedes",
          url: "/guests",
          circleColor: "bg-blue-500",
        },
        {
          title: "Reservas",
          url: "/reservations",
          circleColor: "bg-yellow-500",
        },
        {
          title: "Calendario",
          url: "/reservations/calendar",
          circleColor: "bg-cyan-500",
        },
        {
          title: "Inventario",
          url: "/inventory",
          circleColor: "bg-purple-500",
        },
        {
          title: "Punto de venta",
          url: "/pos",
          circleColor: "bg-amber-500",
        },
        {
          title: "Ventas",
          url: "/sales",
          circleColor: "bg-emerald-500",
        },
        {
          title: "Servicios",
          url: "/services",
          circleColor: "bg-cyan-500",
        },
        {
          title: "Agenda servicios",
          url: "/services/schedule",
          circleColor: "bg-blue-500",
        },
        {
          title: "Clientes corporativos",
          url: "/corporate-clients",
          circleColor: "bg-slate-600",
        },
        {
          title: "Check-in",
          url: "/checkin",
          circleColor: "bg-emerald-600",
        },
        {
          title: "Check-out",
          url: "/checkout",
          circleColor: "bg-orange-500",
        },
      ],
    },
    {
      title: "Administracion",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Configuracion del hotel",
          url: "/hotel-settings",
          circleColor: "bg-blue-500",
        },
        {
          title: "Plan y modulos",
          url: "/plan-modules",
          circleColor: "bg-slate-600",
        },
      ],
    },
    {
      title: "Finanzas",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Facturacion",
          url: "/invoices",
          circleColor: "bg-emerald-600",
        },
        {
          title: "Metodos de pago",
          url: "/payment-methods",
          circleColor: "bg-yellow-500",
        },
      ],
    },
  ],
};
