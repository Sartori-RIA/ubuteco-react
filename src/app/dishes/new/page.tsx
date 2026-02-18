"use client"

import {DishForm} from "@/app/dishes/components";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.dishes);
  const dispatch = useAppDispatch()

  async function handleCreateDish(formData: FormData) {
    dispatch(dishesThunks.create(formData))
  }

  return (
    <DishForm
      action={handleCreateDish}
      submitLabel="Save Dish"
      loading={loading}
      errors={errors}
    />)
}
