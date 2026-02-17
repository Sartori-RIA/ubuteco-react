"use client"

import {Beer, BeerStyle, Maker} from "@/app/_types";
import React, {useState} from "react";
import {Button, Card, FormErrors, Input} from "@/app/_components";
import {motion} from "motion/react";
import Form from "next/form";

interface BeerFormProps {
  defaultValues?: Partial<Beer>;
  beerStyles?: BeerStyle[];
  makers?: Maker[];
  errors?: string[];
  action: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function BeerForm({
                           defaultValues,
                           beerStyles = [],
                           makers = [],
                           action,
                           errors,
                           loading = false,
                           submitLabel = "Save Beer",
                         }: BeerFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Beer>>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    ibu: defaultValues?.ibu ?? 0,
    beer_style_id: defaultValues?.beer_style_id,
    maker_id: defaultValues?.maker_id,
    price: defaultValues?.price ?? 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
  });

  function setField<K extends keyof Beer>(key: K, value: Beer[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Beer" : "New Beer"} className="rounded-2xl shadow-lg">
        <Form action={action} formEncType="multipart/form-data" className="space-y-6 max-w-2xl">

          <FormErrors errors={errors}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name">
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                name="name"
              />
            </Input>

            <div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 h-32 rounded-xl object-cover"
                />
              )}

              <Input label="Image">
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const imageUrl = URL.createObjectURL(file);
                    setPreview(imageUrl);
                  }}
                />
              </Input>
            </div>
          </div>

          <Input label="Description">
            <textarea
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              rows={4}
              name="description"
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Input>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="IBU">
              <input
                type="number"
                name="ibu"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.ibu ?? 0}
                onChange={(e) => setField("ibu", Number(e.target.value))}
                required
              />
            </Input>

            <Input label="ABV">
              <input
                type="number"
                name="abv"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.abv ?? 0}
                onChange={(e) => setField("abv", Number(e.target.value))}
                required
              />
            </Input>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Price">
              <input
                type="number"
                step="0.01"
                name="price"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.price ?? 0}
                onChange={(e) => setField("price", Number(e.target.value))}
              />
            </Input>

            <Input label="Stock Quantity">
              <input
                type="number"
                name="quantity_stock"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                value={form.quantity_stock ?? 0}
                onChange={(e) => setField("quantity_stock", Number(e.target.value))}
              />
            </Input>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beerStyles.length > 0 && (
              <Input label="Beer Style">
                <select
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  name="beer_style_id"
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

            {makers.length > 0 && (
              <Input label="Maker">
                <select
                  name="maker_id"
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" loading={loading}>
              {submitLabel}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}