"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHotelData } from "@/contexts/HotelDataContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type RangeMode = "day" | "week" | "month";
type DayWindow = 7 | 14 | 30;
type WeekWindow = 4 | 8 | 12;
type MonthWindow = 6 | 12;

interface OccupancyChartCardProps {
  compact?: boolean;
}

const DAY_OPTIONS: DayWindow[] = [7, 14, 30];
const WEEK_OPTIONS: WeekWindow[] = [4, 8, 12];
const MONTH_OPTIONS: MonthWindow[] = [6, 12];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfIsoWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay() || 7;
  if (day !== 1) next.setDate(next.getDate() - day + 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isoWeek(date: Date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function avg(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function dayLabel(date: Date, long = false) {
  return new Intl.DateTimeFormat("es-PE", long
    ? { day: "2-digit", month: "short" }
    : { weekday: "short" }).format(date);
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-PE", { month: "short" }).format(date);
}

export default function OccupancyChartCard({ compact = false }: OccupancyChartCardProps) {
  const { occupancyTrend } = useHotelData();

  const [mode, setMode] = useState<RangeMode>("day");
  const [dayWindow, setDayWindow] = useState<DayWindow>(7);
  const [weekWindow, setWeekWindow] = useState<WeekWindow>(8);
  const [monthWindow, setMonthWindow] = useState<MonthWindow>(12);

  const activeMode: RangeMode = compact ? "day" : mode;

  const dataset = useMemo(() => {
    const today = new Date();
    const baseValues = occupancyTrend.length
      ? occupancyTrend.map((point) => point.value)
      : [68, 71, 66, 73, 78, 75, 80];
    const baseAvg = avg(baseValues);

    const synth = (index: number, total: number) => {
      const safeTotal = Math.max(total, 1);
      const baseIndex = index % baseValues.length;
      const wave = Math.sin((index / safeTotal) * Math.PI * 2) * 6;
      const trend = ((index / Math.max(safeTotal - 1, 1)) - 0.5) * 2.5;
      const blend = baseAvg + wave + (baseValues[baseIndex] - baseAvg) * 0.55 + trend;
      return Math.round(clamp(blend, 40, 97));
    };

    const buildDaily = (start: Date, totalDays: number) => {
      return Array.from({ length: totalDays }, (_, index) => {
        const date = addDays(start, index);
        return { date, value: synth(index, totalDays) };
      });
    };

    if (activeMode === "day") {
      const window = compact ? 7 : dayWindow;
      const start = addDays(today, -(window - 1));
      const daily = buildDaily(start, window);
      const labels = daily.map((point) => dayLabel(point.date, window > 14));
      const values = daily.map((point) => point.value);
      return {
        labels,
        values,
        rawDailyValues: values,
        context: `Mostrando: ${window} dias`,
      };
    }

    if (activeMode === "week") {
      const weekCount = weekWindow;
      const currentWeekStart = startOfIsoWeek(today);
      const start = addDays(currentWeekStart, -((weekCount - 1) * 7));
      const daily = buildDaily(start, weekCount * 7);

      const weekMap = new Map<string, { label: string; values: number[] }>();
      daily.forEach((point) => {
        const weekStart = startOfIsoWeek(point.date);
        const key = weekStart.toISOString().split("T")[0];
        if (!weekMap.has(key)) {
          const weekNo = isoWeek(weekStart).toString().padStart(2, "0");
          weekMap.set(key, { label: `Sem ${weekNo}`, values: [] });
        }
        weekMap.get(key)!.values.push(point.value);
      });

      const grouped = Array.from(weekMap.values());
      const labels = grouped.map((item) => item.label);
      const values = grouped.map((item) => Math.round(avg(item.values)));
      return {
        labels,
        values,
        rawDailyValues: daily.map((point) => point.value),
        context: `Mostrando: ${weekCount} semanas`,
      };
    }

    const monthCount = monthWindow;
    const startMonth = new Date(today.getFullYear(), today.getMonth() - (monthCount - 1), 1);
    const totalDays = Math.floor((today.getTime() - startMonth.getTime()) / 86400000) + 1;
    const daily = buildDaily(startMonth, totalDays);

    const monthMap = new Map<string, { date: Date; values: number[] }>();
    daily.forEach((point) => {
      const key = `${point.date.getFullYear()}-${point.date.getMonth() + 1}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          date: new Date(point.date.getFullYear(), point.date.getMonth(), 1),
          values: [],
        });
      }
      monthMap.get(key)!.values.push(point.value);
    });

    const grouped = Array.from(monthMap.values());
    const labels = grouped.map((item) => monthLabel(item.date));
    const values = grouped.map((item) => Math.round(avg(item.values)));

    return {
      labels,
      values,
      rawDailyValues: daily.map((point) => point.value),
      context: `Mostrando: ${monthCount} meses`,
    };
  }, [occupancyTrend, activeMode, dayWindow, weekWindow, monthWindow, compact]);

  const average = useMemo(() => Math.round(avg(dataset.values)), [dataset.values]);
  const current = dataset.values[dataset.values.length - 1] ?? 0;
  const target = 75;
  const delta = current - average;

  const weekDelta = useMemo(() => {
    if (dataset.rawDailyValues.length >= 14) {
      const last7 = dataset.rawDailyValues.slice(-7);
      const prev7 = dataset.rawDailyValues.slice(-14, -7);
      return Math.round(avg(last7) - avg(prev7));
    }
    const prev = dataset.values[Math.max(0, dataset.values.length - 2)] ?? current;
    return current - prev;
  }, [dataset.rawDailyValues, dataset.values, current]);

  const series: ApexOptions["series"] = [
    {
      name: "Ocupacion",
      data: dataset.values,
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: compact ? 140 : 260,
      type: compact ? "line" : "area",
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
      type: compact ? "solid" : "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: compact ? 0.12 : 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: dataset.labels,
      labels: { show: !compact, style: { fontSize: "12px" } },
      axisBorder: { show: false },
      tickAmount: compact ? undefined : Math.min(10, dataset.labels.length),
    },
    yaxis: {
      show: !compact,
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
    annotations: {
      yaxis: compact
        ? []
        : [
            {
              y: target,
              borderColor: "#94A3B8",
              strokeDashArray: 4,
              label: {
                text: `Objetivo ${target}%`,
                style: { color: "#475569", background: "#E2E8F0" },
              },
            },
          ],
    },
  };

  const subOptions = activeMode === "day"
    ? DAY_OPTIONS
    : activeMode === "week"
      ? WEEK_OPTIONS
      : MONTH_OPTIONS;

  const activeSubValue = activeMode === "day"
    ? dayWindow
    : activeMode === "week"
      ? weekWindow
      : monthWindow;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold">Ocupacion</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">{dataset.context}</p>
        </div>

        {!compact ? (
          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex rounded-lg border border-neutral-200 p-1 dark:border-slate-700">
              <Button
                size="sm"
                variant={mode === "day" ? "default" : "ghost"}
                onClick={() => setMode("day")}
              >
                Dias
              </Button>
              <Button
                size="sm"
                variant={mode === "week" ? "default" : "ghost"}
                onClick={() => setMode("week")}
              >
                Semanas
              </Button>
              <Button
                size="sm"
                variant={mode === "month" ? "default" : "ghost"}
                onClick={() => setMode("month")}
              >
                Mes
              </Button>
            </div>

            <div className="inline-flex rounded-lg border border-neutral-200 p-1 dark:border-slate-700">
              {subOptions.map((value) => (
                <Button
                  key={`${activeMode}-${value}`}
                  size="sm"
                  variant={activeSubValue === value ? "default" : "ghost"}
                  onClick={() => {
                    if (activeMode === "day") setDayWindow(value as DayWindow);
                    else if (activeMode === "week") setWeekWindow(value as WeekWindow);
                    else setMonthWindow(value as MonthWindow);
                  }}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-300 mb-2">
        <span>Promedio {average}%</span>
        <span>Hoy {current}%</span>
        <span>
          Vs promedio {delta >= 0 ? "+" : ""}
          {delta}%
        </span>
        <span>
          Vs semana pasada {weekDelta >= 0 ? "+" : ""}
          {weekDelta}%
        </span>
      </div>

      <div className={compact ? "-m-1" : "-m-3"}>
        <Chart
          options={options}
          series={series}
          type={compact ? "line" : "area"}
          height={compact ? 140 : 260}
        />
      </div>
    </Card>
  );
}
