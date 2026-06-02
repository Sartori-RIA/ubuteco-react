"use client"

import {Food} from "@/app/_types";
import React, {FormEvent, useState} from "react";
import {Buttons, Card, FormErrors, Input, Label} from "@/app/_components";
import {motion} from "motion/react";
import {toDateInputValue} from "@/app/_lib/format-date";
import {priceFromCents} from "@/app/_lib/money";
import {useTranslations} from "@/app/_hooks/useTranslations";

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
  const t = useTranslations();
  const [preview, setPreview] = useState<string | null>(defaultValues?.image_url ?? null);
  const [form, setForm] = useState<Partial<Food>>({
    name: defaultValues?.name ?? "",
    price: defaultValues ? priceFromCents(defaultValues) : 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
    valid_until: defaultValues?.valid_until ?? "",
  });

  function setField<K extends keyof Food>(key: K, value: Food[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await action(new FormData(event.currentTarget));
  }

  return (
    <motion.div
      initial={false}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? t("forms.updateFood") : t("forms.newFood")} className="rounded-2xl shadow-lg hover:translate-y-0">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6 max-w-2xl"
        >

          <FormErrors errors={errors}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label={t("forms.fields.name")}>
              <Input
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                name="name"
                required
              />
            </Label>

            <Label label={t("forms.fields.image")}>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mb-2 h-32 rounded-xl object-cover"
                />
              )}
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label={t("forms.fields.price")}>
              <Input
                type="number"
                step="0.01"
                name="price"
                value={form.price ?? 0}
                onChange={(e) => setField("price", Number(e.target.value))}
                required
              />
            </Label>

            <Label label={t("forms.fields.stockQuantity")}>
              <Input
                type="number"
                min={0}
                name="quantity_stock"
                value={form.quantity_stock ?? 0}
                onChange={(e) => setField("quantity_stock", Number(e.target.value))}
                required
              />
            </Label>

            <Label label={t("forms.fields.validUntil")}>
              <Input
                type="date"
                name="valid_until"
                value={toDateInputValue(form.valid_until as string | undefined)}
                onChange={(e) => setField("valid_until", e.target.value)}
              />
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Buttons type="submit" loading={loading}>
              {submitLabel}
            </Buttons>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
