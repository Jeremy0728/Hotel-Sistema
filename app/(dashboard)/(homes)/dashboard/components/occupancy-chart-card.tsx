"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHotelData } from "@/contexts/HotelDataContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OccupancyChartCard() {
  const { occupancyTrend } = useHotelData();
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const { labels, values } = useMemo(() => {
    const base = occupancyTrend.map((point) => point.value);
    const avg = base.reduce((sum, value) => sum + value, 0) / base.length;
    const days = range === "7d" ? 7 : 30;
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));

    if (days === 7 && occupancyTrend.length === 7) {
      return {
        labels: occupancyTrend.map((point) => point.label),
        values: base,
      };
    }

    const labels = Array.from({ length: days }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
      }).format(date);
    });

    const values = Array.from({ length: days }, (_, index) => {
      const baseIndex = index % base.length;
      const wave = Math.sin((index / days) * Math.PI * 2) * 6;
      const blended = avg + wave + (base[baseIndex] - avg) * 0.5;
      return Math.min(100, Math.max(40, Math.round(blended)));
    });

    return { labels, values };
  }, [occupancyTrend, range]);

  const average = useMemo(() => {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [values]);
  const current = values[values.length - 1] ?? 0;
  const delta = current - average;

  const series: ApexOptions["series"] = [
    {
      name: "Ocupación",
      data: values,
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
      categories: labels,
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
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${Math.round(value)}%`,
      },
    },
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">
            Ocupación ({range === "7d" ? "7 días" : "30 días"})
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Porcentaje de ocupación diaria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={range === "7d" ? "default" : "outline"}
            onClick={() => setRange("7d")}
          >
            7d
          </Button>
          <Button
            size="sm"
            variant={range === "30d" ? "default" : "outline"}
            onClick={() => setRange("30d")}
          >
            30d
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-300 mb-2">
        <span>Promedio: {average}%</span>
        <span>
          Ocupación vs promedio: {delta >= 0 ? "+" : ""}
          {delta}%
        </span>
      </div>
      <div className="-m-3">
        <Chart options={options} series={series} type="area" height={260} />
      </div>
    </Card>
  );
}
