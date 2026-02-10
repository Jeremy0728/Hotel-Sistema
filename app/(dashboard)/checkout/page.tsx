import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import CheckOutModule from "@/app/(dashboard)/checkout/components/checkout-page";

export default function CheckOutPage() {
  return (
    <>
      <DashboardBreadcrumb title="Check-out" text="Check-out" />
      <CheckOutModule />
    </>
  );
}
