import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import PaymentMethodsPage from "@/app/(dashboard)/payment-methods/components/payment-methods-page";

export default function PaymentMethodsRoute() {
  return (
    <>
      <DashboardBreadcrumb title="Metodos de pago" text="Pagos" />
      <PaymentMethodsPage />
    </>
  );
}
