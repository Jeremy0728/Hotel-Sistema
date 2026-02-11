"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locationSchema, type LocationFormValues } from "@/lib/hotel-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Room } from "@/types/hotel";

interface LocationFormProps {
  defaultValues: LocationFormValues;
  rooms: Room[];
  onSubmit: (values: LocationFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}

const statusOptions = [
  { value: "active", label: "Activa" },
  { value: "inactive", label: "Inactiva" },
];

const typeOptions = [
  { value: "reception", label: "Recepcion" },
  { value: "minibar", label: "Minibar" },
  { value: "storage", label: "Almacen" },
  { value: "restaurant", label: "Restaurante" },
];

export default function InventoryLocationForm({
  defaultValues,
  rooms,
  onSubmit,
  onCancel,
  submitLabel,
}: LocationFormProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues,
  });

  const [selectedType, setSelectedType] = useState<LocationFormValues["type"]>(
    defaultValues.type
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Nombre de ubicacion" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedType(value as LocationFormValues["type"]);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "minibar" ? (
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Habitacion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Habitacion #{room.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
