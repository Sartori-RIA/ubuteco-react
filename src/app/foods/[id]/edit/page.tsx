"use client"

import React, {useEffect} from "react";
import {FoodForm} from "@/app/foods/components";
import {useParams} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {fetchFoodById, updateFood} from "@/app/_features/foods/foodsThunks";
import {useAppDispatch} from "@/app/_store/hooks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const food = useSelector((state: RootState) => state.foods.foods.find((food) => food.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.foods);

  useEffect(() => {
    if (id) {
      dispatch(fetchFoodById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEditFood(data: FormData) {
    dispatch(updateFood({id: Number(id), data}))
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
