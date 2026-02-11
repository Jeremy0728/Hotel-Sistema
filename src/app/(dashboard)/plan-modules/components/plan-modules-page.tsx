"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";

const statusBadge = (status: string) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "available") return "bg-blue-100 text-blue-700";
  return "bg-neutral-200 text-neutral-700";
};

const statusLabel = (status: string) => {
  if (status === "active") return "Activo";
  if (status === "available") return "Disponible";
  return "No disponible";
};

export default function PlanModulesPage() {
  const { planInfo, planModules } = useHotelData();
  const needsUpgrade = planModules.some((module) => module.status !== "active");

  return (
    <div className="space-y-6">
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Plan actual</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Gestion de plan y modulos disponibles
            </p>
          </div>
          {needsUpgrade ? <Button>Solicitar upgrade</Button> : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Plan</p>
            <p className="text-lg font-semibold">{planInfo.name}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Precio</p>
            <p className="text-lg font-semibold">S/ {planInfo.price}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Renovacion</p>
            <p className="text-lg font-semibold">{planInfo.renewalDate}</p>
          </Card>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          {planModules.map((module) => (
            <div
              key={module.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b last:border-b-0 pb-4 last:pb-0"
            >
              <div>
                <p className="font-semibold">{module.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                  {module.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {module.requiredPlan ? (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Requiere: {module.requiredPlan}
                  </span>
                ) : null}
                <Badge className={cn("rounded-full", statusBadge(module.status))}>
                  {statusLabel(module.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
