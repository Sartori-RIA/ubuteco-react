"use client"

import {Drink} from "@/app/_types";
import React, {useState} from "react";
import {Buttons, Card, FormErrors, Input, Label, Textarea} from "@/app/_components";
import {motion} from "motion/react";
import Form from "next/form";

interface DrinkFormProps {
  defaultValues?: Partial<Drink>;
  errors?: string[];
  action: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function DrinkForm({
                            defaultValues,
                            action,
                            errors,
                            loading = false,
                            submitLabel = "Save Drink",
                          }: DrinkFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Drink>>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
    flavor: defaultValues?.flavor ?? "",
  });

  function setField<K extends keyof Drink>(key: K, value: Drink[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={false}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Drink" : "New Drink"} className="rounded-2xl shadow-lg">
        <Form action={action} formEncType="multipart/form-data" className="space-y-6 max-w-2xl">

          <FormErrors errors={errors}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label="Name">
              <Input
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                name="name"
              />
            </Label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-32 rounded-xl object-cover"
              />
            )}

            <Label label="Image">
              <Input
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
            </Label>
          </div>

          <Label label="Description">
            <Textarea
              rows={4}
              name="description"
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label="Flavor">
              <Input
                name="flavor"
                value={form.flavor}
                onChange={(e) => setField("flavor", e.target.value)}
                required
              />
            </Label>

            <Label label="ABV">
              <Input
                type="number"
                name="abv"
                value={form.abv ?? 0}
                onChange={(e) => setField("abv", Number(e.target.value))}
                required
              />
            </Label>

            <Label label="Price">
              <Input
                type="number"
                step="0.01"
                name="price"
                value={form.price ?? 0}
                onChange={(e) => setField("price", Number(e.target.value))}
              />
            </Label>

            <Label label="Stock Quantity">
              <Input
                type="number"
                name="quantity_stock"
                value={form.quantity_stock ?? 0}
                onChange={(e) => setField("quantity_stock", Number(e.target.value))}
              />
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Buttons type="submit" loading={loading}>
              {submitLabel}
            </Buttons>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}