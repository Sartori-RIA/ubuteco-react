"use client"

import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {useRouter} from "next/navigation";
import {DishForm} from "@/app/dishes/components";
import {Loading} from "@/app/_components";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.dishes);
  const {foodOptions, optionsLoading} = useSelector((state: RootState) => state.foods);
  const dispatch = useAppDispatch()
  const router = useRouter();

  useEffect(() => {
    dispatch(foodsThunks.fetchOptions())
  }, [dispatch])

  async function handleCreate(formData: FormData) {
    try {
      const newDish = await dispatch(dishesThunks.create(formData)).unwrap()
      router.push(`/dishes/${newDish.id}`);
    } catch (error) {
    }
  }

  if (optionsLoading && foodOptions.length === 0) {
    return <Loading/>;
  }

  return (
    <DishForm
      foods={foodOptions}
      onSubmit={handleCreate}
      submitLabel="Save Dish"
      loading={loading}
      errors={errors}
    />)
}
