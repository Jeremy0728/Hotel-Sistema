"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  trackStock: boolean;
}

export default function PosPage() {
  const { products, inventory, guests, paymentMethods, hotelSettings, addSale } = useHotelData();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestId, setGuestId] = useState("none");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const stockByProduct = useMemo(() => {
    return inventory.reduce<Record<string, number>>((acc, item) => {
      acc[item.productId] = (acc[item.productId] ?? 0) + item.stock;
      return acc;
    }, {});
  }, [inventory]);

  const activePayments = useMemo(
    () => paymentMethods.filter((method) => method.status === "active"),
    [paymentMethods]
  );

  useEffect(() => {
    if (!paymentMethod && activePayments.length) {
      setPaymentMethod(activePayments[0].name);
    }
  }, [activePayments, paymentMethod]);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  });

  const getAvailable = (productId: string, trackStock: boolean) => {
    if (!trackStock) return 9999;
    return stockByProduct[productId] ?? 0;
  };

  const handleAdd = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const available = getAvailable(product.id, product.trackStock);
    setError(null);
    setSuccess(null);

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (!existing) {
        if (available <= 0) return prev;
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            trackStock: product.trackStock,
          },
        ];
      }
      if (existing.quantity >= available) return prev;
      return prev.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const handleQuantity = (productId: string, next: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const available = getAvailable(product.id, product.trackStock);
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const safeValue = Number.isNaN(next) ? 1 : next;
          const clamped = Math.max(1, Math.min(safeValue, available));
          return { ...item, quantity: clamped };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = hotelSettings.taxRate ?? 0;
  const tax = Number(((subtotal * taxRate) / 100).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleCheckout = () => {
    setError(null);
    setSuccess(null);
    if (cart.length === 0) {
      setError("Agrega productos al carrito.");
      return;
    }
    const guest = guests.find((item) => item.id === guestId);
    const items = cart.map((item) => ({
      id: `sale-item-${item.productId}`,
      productId: item.productId,
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity,
    }));

    addSale({
      guestId: guestId === "none" ? undefined : guestId,
      guestName: guest ? `${guest.firstName} ${guest.lastName}` : undefined,
      status: "paid",
      paymentMethod,
      items,
      notes: notes || undefined,
    });

    setCart([]);
    setNotes("");
    setGuestId("none");
    setSuccess("Venta registrada correctamente.");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-4">
        <Card className="p-4 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Productos</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-300">
                Selecciona productos para registrar la venta
              </p>
            </div>
            <Input
              placeholder="Buscar por nombre o SKU"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-xs"
            />
          </div>
        </Card>

        {filteredProducts.length === 0 ? (
          <EmptyState
            title="Sin productos"
            description="No se encontraron productos con ese filtro."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const available = getAvailable(product.id, product.trackStock);
              const disabled = product.trackStock && available <= 0;
              return (
                <Card key={product.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">
                        SKU {product.sku}
                      </p>
                    </div>
                    <Badge variant="secondary">S/ {product.price}</Badge>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-300">
                    {product.categoryName}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-300">
                      Stock: {product.trackStock ? available : "N/A"}
                    </span>
                    {disabled ? (
                      <span className="text-red-500">Sin stock</span>
                    ) : null}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(product.id)}
                    disabled={disabled}
                    className={cn(disabled && "opacity-60")}
                  >
                    Agregar
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Carrito</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Productos seleccionados
            </p>
          </div>

          {cart.length === 0 ? (
            <EmptyState
              title="Carrito vacio"
              description="Agrega productos desde el catalogo."
            />
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const available = getAvailable(item.productId, item.trackStock);
                return (
                  <div key={item.productId} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">
                        S/ {item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={available}
                        value={item.quantity}
                        onChange={(event) => handleQuantity(item.productId, Number(event.target.value))}
                        className="w-16"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= available}
                      >
                        +
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(item.productId)}
                      >
                        x
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <div className="text-sm text-neutral-500 dark:text-neutral-300">Cliente</div>
          <Select value={guestId} onValueChange={setGuestId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un huesped" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin huesped</SelectItem>
              {guests.map((guest) => (
                <SelectItem key={guest.id} value={guest.id}>
                  {guest.firstName} {guest.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-neutral-500 dark:text-neutral-300">Metodo de pago</div>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Metodo de pago" />
            </SelectTrigger>
            <SelectContent>
              {activePayments.map((method) => (
                <SelectItem key={method.id} value={method.name}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Notas de la venta"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Impuesto ({taxRate}%)</span>
              <span>S/ {tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <Button onClick={handleCheckout} disabled={cart.length === 0}>
            Completar venta
          </Button>
        </Card>
      </div>
    </div>
  );
}
