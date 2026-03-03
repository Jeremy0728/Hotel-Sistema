import MetricCard from "@/components/hotel/metric-card";
import { CircleDollarSign, AlertTriangle, Wallet } from "lucide-react";

interface InvoiceMetricsProps {
  totalBilled: number;
  totalPending: number;
  totalOverdue: number;
}

export default function InvoiceMetrics({
  totalBilled,
  totalPending,
  totalOverdue,
}: InvoiceMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Total facturado"
        value={`S/ ${totalBilled.toFixed(2)}`}
        description="Incluye impuestos"
        icon={CircleDollarSign}
      />
      <MetricCard
        title="Pendiente de cobro"
        value={`S/ ${totalPending.toFixed(2)}`}
        description="Balance total"
        icon={Wallet}
        accentClassName="bg-yellow-100 text-yellow-700"
      />
      <MetricCard
        title="Vencido"
        value={`S/ ${totalOverdue.toFixed(2)}`}
        description="Facturas vencidas"
        icon={AlertTriangle}
        accentClassName="bg-red-100 text-red-700"
      />
    </div>
  );
}
