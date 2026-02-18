"use client"

import React, {useEffect} from "react";
import {FoodForm} from "@/app/foods/components";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {useAppDispatch} from "@/app/_store/hooks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const food = useSelector((state: RootState) => state.foods.foods.find((food) => food.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.foods);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(foodsThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEditFood(data: FormData) {
    try {
      const updatedFood = await dispatch(foodsThunks.update({id: Number(id), data})).unwrap()
      router.push(`/foods/${updatedFood.id}`);
    } catch (error) {
    }
  }

  if (loading) return <Loading/>;
  if (food === undefined) return <h1>Not Found</h1>

  return (
    <FoodForm
      defaultValues={food}
      action={handleEditFood}
      submitLabel="Update Food"
      errors={errors}
      loading={loading}
    />
  );
}
