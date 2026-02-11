import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import HotelAnalytics from "./components/hotel-analytics";

const Analytics = () => {
  return (
    <>
      <DashboardBreadcrumb title="Analytics PMS" text="Analytics" />
      <HotelAnalytics />
    </>
  );
};

export default Analytics;
