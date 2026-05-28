"use client"

import {Dish, DishIngredientAttribute} from "@/app/_types";
import {FoodOption} from "@/app/_store/features/foods/foodsThunks";
import React, {FormEvent, useState} from "react";
import {Buttons, Card, FormErrors, Input, Label} from "@/app/_components";
import {motion} from "motion/react";
import {priceFromCents} from "@/app/_lib/money";
import {buildDishFormData} from "@/app/dishes/_lib/buildDishFormData";
import {DishIngredientsEditor} from "@/app/dishes/components/DishIngredientsEditor";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";

interface DishFormProps {
  defaultValues?: Partial<Dish>;
  foods: FoodOption[];
  errors?: string[];
  onSubmit: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

function mapIngredients(dish?: Partial<Dish>): DishIngredientAttribute[] {
  return (dish?.dish_ingredients ?? []).map((item) => ({
    id: item.id,
    food_id: item.food_id,
    quantity: item.quantity,
    food: item.food,
  }));
}

export function DishForm({
                            defaultValues,
                            foods,
                            onSubmit,
                            errors,
                            loading = false,
                            submitLabel = "Save Dish",
                          }: DishFormProps) {
  const {canMutateOperationalData} = useAuthCapabilities();
  const readOnly = !canMutateOperationalData;

  const [preview, setPreview] = useState<string | null>(defaultValues?.image_url ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [price, setPrice] = useState(defaultValues ? priceFromCents(defaultValues) : 0);
  const [ingredients, setIngredients] = useState<DishIngredientAttribute[]>(() => mapIngredients(defaultValues));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (readOnly) return;

    const payloadIngredients = ingredients.filter((item) => {
      if (item._destroy) return !!item.id;
      return item.food_id > 0;
    });
    const formData = buildDishFormData({name, price}, payloadIngredients, imageFile);

    await onSubmit(formData);
  };

  return (
    <motion.div
      initial={false}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-3xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Dish" : "New Dish"} className="rounded-2xl shadow-lg hover:translate-y-0">
        <form onSubmit={handleSubmit} className="space-y-8">

          <FormErrors errors={errors}/>

          <section className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Dish details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label label="Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={readOnly}
                />
              </Label>

              <Label label="Price">
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  disabled={readOnly}
                />
              </Label>
            </div>

            <Label label="Image">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mb-2 h-32 rounded-xl object-cover"
                />
              )}
              {!readOnly && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              )}
            </Label>
          </section>

          <section className="space-y-4 border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-900">Ingredients</h4>
            <DishIngredientsEditor
              foods={foods}
              ingredients={ingredients}
              onChange={setIngredients}
              readOnly={readOnly}
            />
          </section>

          {!readOnly && (
            <div className="flex justify-end gap-2 pt-4">
              <Buttons type="submit" loading={loading}>
                {submitLabel}
              </Buttons>
            </div>
          )}
        </form>
      </Card>
    </motion.div>
  );
}
