"use client"

import {Beer, BeerStyle, Maker} from "@/app/types";
import {useState} from "react";
import {Button, Card, Input} from "@/app/components";
import {motion} from "motion/react";

interface BeerFormProps {
  defaultValues?: Partial<Beer>;
  beerStyles?: BeerStyle[];
  makers?: Maker[];
  onSubmit: (data: Partial<Beer>) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function BeerForm({
                           defaultValues,
                           beerStyles = [],
                           makers = [],
                           onSubmit,
                           loading = false,
                           submitLabel = "Save Beer",
                         }: BeerFormProps) {
  const [form, setForm] = useState<Partial<Beer>>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    ibu: defaultValues?.ibu ?? 0,
    alcohol: defaultValues?.alcohol ?? 0,
    beer_style_id: defaultValues?.beer_style_id,
    maker_id: defaultValues?.maker_id,
    price: defaultValues?.price ?? 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
  });

  function setField<K extends keyof Beer>(key: K, value: Beer[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Editar Beer" : "Nova Beer"} className="rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Name */}
          <Input label="Name">
            <input
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              value={form.name ?? ""}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </Input>

          {/* Description */}
          <Input label="Description">
        <textarea
          className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          rows={4}
          value={form.description ?? ""}
          onChange={(e) => setField("description", e.target.value)}
        />
          </Input>

          {/* Grid Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="IBU">
              <input
                type="number"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.ibu ?? 0}
                onChange={(e) => setField("ibu", Number(e.target.value))}
                required
              />
            </Input>

            <Input label="Alcohol %">
              <input
                type="number"
                step="0.1"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.alcohol ?? 0}
                onChange={(e) => setField("alcohol", Number(e.target.value))}
              />
            </Input>
          </div>

          {/* Grid Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Price">
              <input
                type="number"
                step="0.01"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.price ?? 0}
                onChange={(e) => setField("price", Number(e.target.value))}
              />
            </Input>

            <Input label="Stock Quantity">
              <input
                type="number"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.quantity_stock ?? 0}
                onChange={(e) => setField("quantity_stock", Number(e.target.value))}
              />
            </Input>
          </div>

          {/* Beer Style */}
          {beerStyles.length > 0 && (
            <Input label="Beer Style">
              <select
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.beer_style_id ?? ""}
                onChange={(e) => setField("beer_style_id", Number(e.target.value))}
              >
                <option value="">Select style</option>
                {beerStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </Input>
          )}

          {/* Makers */}
          {makers.length > 0 && (
            <Input label="Maker">
              <select
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.maker_id ?? ""}
                onChange={(e) => setField("maker_id", Number(e.target.value))}
              >
                <option value="">Select Maker</option>
                {makers.map((maker) => (
                  <option key={maker.id} value={maker.id}>
                    {maker.name}
                  </option>
                ))}
              </select>
            </Input>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" loading={loading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}