"use client"

import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {FoodForm} from "@/app/foods/components/FoodForm";
import {useRouter} from "next/navigation";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.foods);
  const dispatch = useAppDispatch()
  const router = useRouter();
  const t = useTranslations();

  async function handleCreateFood(formData: FormData) {
    try {
      const newFood = await dispatch(foodsThunks.create(formData)).unwrap()
      router.push(`/foods/${newFood.id}`);
    } catch (error) {
    }
  }

  return (
    <FoodForm
      action={handleCreateFood}
      submitLabel={t("forms.saveFood")}
      loading={loading}
      errors={errors}
    />)
}
