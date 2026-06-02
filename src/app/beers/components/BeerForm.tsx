"use client"

import {Beer, BeerStyle, Maker} from "@/app/_types";
import React, {useEffect, useState} from "react";
import {Buttons, Card, FormErrors, Input, Label, Select, Textarea} from "@/app/_components";
import {motion} from "motion/react";
import Form from "next/form";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";
import {beerStylesThunks} from "@/app/_store/features/beer_styles/beerStylesThunks";
import {useTranslations} from "@/app/_hooks/useTranslations";

interface BeerFormProps {
  defaultValues?: Partial<Beer>;
  errors?: string[];
  action: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function BeerForm({
                           defaultValues,
                           action,
                           errors,
                           loading = false,
                           submitLabel = "Save Beer",
                         }: BeerFormProps) {
  const beerStyles = useAppSelector<BeerStyle[]>((state: RootState) => state.beerStyles.beerStyles);
  const makers = useAppSelector<Maker[]>((state: RootState) => state.makers.makers);
  const dispatch = useAppDispatch();
  const t = useTranslations();
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

  useEffect(() => {
    dispatch(makersThunks.fetchAll({}))
    dispatch(beerStylesThunks.fetchAll({}))
  }, [dispatch])


  function setField<K extends keyof Beer>(key: K, value: Beer[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={false}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? t("forms.updateBeer") : t("forms.newBeer")} className="rounded-2xl shadow-lg">
        <Form action={action} formEncType="multipart/form-data" className="space-y-6 max-w-2xl">

          <FormErrors errors={errors}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label={t("forms.fields.name")}>
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
                  alt={t("forms.fields.imagePreview")}
                  className="mt-2 h-32 rounded-xl object-cover"
                />
              )}

              <Label label={t("forms.fields.image")}>
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

          <Label label={t("forms.fields.description")}>
            <Textarea
              rows={4}
              name="description"
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label={t("forms.fields.ibu")}>
              <Input
                type="number"
                name="ibu"
                value={form.ibu ?? 0}
                onChange={(e) => setField("ibu", Number(e.target.value))}
                required
              />
            </Label>

            <Label label={t("forms.fields.abv")}>
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
            <Label label={t("forms.fields.price")}>
              <Input
                type="number"
                step="0.01"
                name="price"
                value={form.price ?? 0}
                onChange={(e) => setField("price", Number(e.target.value))}
              />
            </Label>

            <Label label={t("forms.fields.stockQuantity")}>
              <Input
                type="number"
                name="quantity_stock"
                value={form.quantity_stock ?? 0}
                onChange={(e) => setField("quantity_stock", Number(e.target.value))}
              />
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label={t("forms.fields.beerStyle")}>
              <Select
                name="beer_style_id"
                value={form.beer_style_id ?? ""}
                onChange={(e) => setField("beer_style_id", Number(e))}
              >
                <option value="">{t("forms.fields.selectStyle")}</option>
                {beerStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </Select>
            </Label>

            <Label label={t("forms.fields.maker")}>
              <Select
                name="maker_id"
                value={form.maker_id}
                onChange={(e) => setField("maker_id", Number(e))}
              >
                <option value="">{t("forms.fields.selectMaker")}</option>
                {makers.map((maker) => (
                  <option key={maker.id} value={maker.id}>
                    {maker.name}
                  </option>
                ))}
              </Select>
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