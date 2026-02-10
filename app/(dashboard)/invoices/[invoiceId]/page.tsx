import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import InvoiceDetail from "@/app/(dashboard)/invoices/components/invoice-detail";

interface InvoiceDetailPageProps {
  params: {
    invoiceId: string;
  };
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  return (
    <>
      <DashboardBreadcrumb title="Detalle de factura" text="Factura" />
      <InvoiceDetail invoiceId={params.invoiceId} />
    </>
  );
}
