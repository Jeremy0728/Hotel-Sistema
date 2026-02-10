"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Card } from "@/components/ui/card";
import { useHotelData } from "@/contexts/HotelDataContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OccupancyChartCard() {
  const { occupancyTrend } = useHotelData();

  const series: ApexOptions["series"] = [
    {
      name: "Ocupación",
      data: occupancyTrend.map((point) => point.value),
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 260,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      colors: ["#3B82F6"],
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: occupancyTrend.map((point) => point.label),
      labels: { style: { fontSize: "12px" } },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}%`,
        style: { fontSize: "12px" },
      },
      min: 0,
      max: 100,
    },
    tooltip: { enabled: true },
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Ocupación (7 días)</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Porcentaje de ocupación diaria
          </p>
        </div>
      </div>
      <div className="-m-3">
        <Chart options={options} series={series} type="area" height={260} />
      </div>
    </Card>
  );
}
