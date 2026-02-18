"use client"

import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {FoodForm} from "@/app/foods/components/FoodForm";
import {useRouter} from "next/navigation";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.beers);
  const dispatch = useAppDispatch()
  const router = useRouter();

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
      submitLabel="Save Food"
      loading={loading}
      errors={errors}
    />)
}
