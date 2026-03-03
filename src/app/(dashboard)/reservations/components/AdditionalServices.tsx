"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdditionalServices() {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-base font-semibold">Servicios adicionales</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-300">
        Sin servicios asociados. (Pendiente de integracion)
      </p>
      <Button variant="ghost">Agregar servicio</Button>
    </Card>
  );
}
