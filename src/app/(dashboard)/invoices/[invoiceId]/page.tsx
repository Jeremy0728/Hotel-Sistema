import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import InvoiceDetail from "@/app/(dashboard)/invoices/components/invoice-detail";

interface InvoiceDetailPageProps {
  params: {
    invoiceId: string;
  };
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
 const { invoiceId } = await params;
  return (
    <>
      <DashboardBreadcrumb title="Detalle de factura" text="Factura" />
      <InvoiceDetail invoiceId={invoiceId} />
    </>
  );
}
