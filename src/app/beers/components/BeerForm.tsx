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
import {toDateInputValue} from "@/app/_lib/format-date";
import {LabelPhotoButton} from "@/app/_components/intake/LabelPhotoButton";
import {LabelDraftResponse} from "@/app/_types/intake";

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
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState({maker: "", style: ""});
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<Partial<Beer>>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    ibu: defaultValues?.ibu ?? 0,
    beer_style_id: defaultValues?.beer_style_id,
    maker_id: defaultValues?.maker_id,
    price: defaultValues?.price ?? 0,
    quantity_stock: defaultValues?.quantity_stock ?? 0,
    valid_until: defaultValues?.valid_until ?? "",
  });

  useEffect(() => {
    dispatch(makersThunks.fetchAll({}))
    dispatch(beerStylesThunks.fetchAll({}))
  }, [dispatch])


  function setField<K extends keyof Beer>(key: K, value: Beer[K]) {
    setHighlighted((current) => {
      if (!current.has(key)) return current;
      const next = new Set(current);
      next.delete(key);
      return next;
    });
    setForm((prev) => ({...prev, [key]: value}));
  }

  function applyLabel(payload: LabelDraftResponse) {
    const draft = payload.draft;
    setForm((prev) => ({
      ...prev,
      name: draft.name,
      description: draft.description,
      abv: draft.abv ?? 0,
      ibu: draft.ibu ?? 0,
      maker_id: draft.maker_id ?? prev.maker_id,
      beer_style_id: draft.beer_style_id ?? prev.beer_style_id,
    }));
    setHighlighted(new Set(["name", "description", "abv", "ibu", "maker_id", "beer_style_id"]));
    setWarnings(payload.warnings);
    setSuggestions({maker: draft.maker_name, style: draft.style_name});
  }

  function ring(key: string) {
    return highlighted.has(key) ? "rounded-xl ring-2 ring-amber-400" : "";
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
          {!defaultValues?.id && <LabelPhotoButton productType="beer" onDraft={applyLabel}/>}
          {warnings.includes("unknown_maker") && (
            <p className="text-sm text-amber-800">{t("intake.unknownMaker", {name: suggestions.maker})}</p>
          )}
          {warnings.includes("unknown_style") && (
            <p className="text-sm text-amber-800">{t("intake.unknownStyle", {name: suggestions.style})}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={ring("name")}>
            <Label label={t("forms.fields.name")}>
              <Input
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                name="name"
              />
            </Label>
            </div>

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

          <div className={ring("description")}>
          <Label label={t("forms.fields.description")}>
            <Textarea
              rows={4}
              name="description"
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={ring("ibu")}>
            <Label label={t("forms.fields.ibu")}>
              <Input
                type="number"
                name="ibu"
                value={form.ibu ?? 0}
                onChange={(e) => setField("ibu", Number(e.target.value))}
                required
              />
            </Label>
            </div>

            <div className={ring("abv")}>
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

            <Label label={t("forms.fields.validUntil")}>
              <Input
                type="date"
                name="valid_until"
                value={toDateInputValue(form.valid_until)}
                onChange={(e) => setField("valid_until", e.target.value)}
              />
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={ring("beer_style_id")}>
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
            </div>

            <div className={ring("maker_id")}>
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