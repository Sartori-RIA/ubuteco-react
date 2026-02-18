"use client"

import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {FoodForm} from "@/app/foods/components/FoodForm";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.beers);
  const dispatch = useAppDispatch()

  async function handleCreateFood(formData: FormData) {
    dispatch(foodsThunks.create(formData))
  }

  return (
    <FoodForm
      action={handleCreateFood}
      submitLabel="Save Food"
      loading={loading}
      errors={errors}
    />)
}
