"use client"

import {Maker, Wine, WineStyle} from "@/app/_types";
import React, {useEffect, useState} from "react";
import {Buttons, Card, FormErrors, Input, Label, Select, Textarea} from "@/app/_components";
import {motion} from "motion/react";
import Form from "next/form";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";
import {wineStylesThunks} from "@/app/_store/features/wine_styles/wineStylesThunks";

interface WineFormProps {
  defaultValues?: Partial<Wine>;
  errors?: string[];
  action: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function WineForm({
                           defaultValues,
                           action,
                           errors,
                           loading = false,
                           submitLabel = "Save Wine",
                         }: WineFormProps) {
  const makers: Maker[] = useAppSelector((state: RootState) => state.makers.makers);
  const wineStyles: WineStyle[] = useAppSelector((state: RootState) => state.wineStyles.wineStyles);
  const dispatch = useAppDispatch();
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Wine>>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    maker_id: defaultValues?.maker_id,
    price: defaultValues?.price ?? 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
    grapes: defaultValues?.grapes ?? "",
    ripening: defaultValues?.ripening ?? "",
    vintage_wine: defaultValues?.vintage_wine ?? "",
    visual: defaultValues?.visual ?? "",
  });

  useEffect(() => {
    dispatch(makersThunks.fetchAll({}))
    dispatch(wineStylesThunks.fetchAll({}))
  }, [dispatch])

  function setField<K extends keyof Wine>(key: K, value: Wine[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Wine" : "New Wine"} className="rounded-2xl shadow-lg">
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

            <div>
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
            <Label label="ABV">
              <Input
                type="number"
                name="abv"
                value={form.abv ?? 0}
                onChange={(e) => setField("abv", Number(e.target.value))}
                required
              />
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wineStyles.length > 0 && (
              <Label label="Wine Style">
                <Select
                  name="wine_style_id"
                  value={form.wine_style_id ?? ""}
                  onChange={(value) => setField("wine_style_id", Number(value))}
                >
                  <option value="">Select style</option>
                  {wineStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </Select>
              </Label>
            )}

            {makers.length > 0 && (
              <Label label="Maker">
                <Select
                  name="maker_id"
                  value={form.maker_id ?? ""}
                  onChange={(value) => setField("maker_id", Number(value))}
                >
                  <option value="">Select Maker</option>
                  {makers.map((maker) => (
                    <option key={maker.id} value={maker.id}>
                      {maker.name}
                    </option>
                  ))}
                </Select>
              </Label>
            )}
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