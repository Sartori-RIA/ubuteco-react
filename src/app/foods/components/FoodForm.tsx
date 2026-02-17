"use client"

import {Food} from "@/app/_types";
import React, {useState} from "react";
import {Button, Card, FormErrors, Input} from "@/app/_components";
import {motion} from "motion/react";
import Form from "next/form";

interface FoodFormProps {
  defaultValues?: Partial<Food>;
  errors?: string[];
  action: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function FoodForm({
                           defaultValues,
                           action,
                           errors,
                           loading = false,
                           submitLabel = "Save Food",
                         }: FoodFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Food>>({
    name: defaultValues?.name ?? "",
    price: defaultValues?.price ?? 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
  });

  function setField<K extends keyof Food>(key: K, value: Food[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Food" : "New Food"} className="rounded-2xl shadow-lg">
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