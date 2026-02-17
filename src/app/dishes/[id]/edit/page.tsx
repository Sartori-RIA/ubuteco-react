"use client"

import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {fetchDishById, updateDish} from "@/app/_features/dishes/dishesThunks";
import {DishForm} from "@/app/dishes/components";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const dish = useSelector((state: RootState) => state.dishes.dishes.find((dish) => dish.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.dishes);

  useEffect(() => {
    if (id) {
      dispatch(fetchDishById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEditDish(data: FormData) {
    dispatch(updateDish({id: Number(id), data}))
  }

  if (loading) return <Loading/>;
  if (dish === undefined) return <h1>Not Found</h1>

  return (
    <DishForm
      defaultValues={dish}
      action={handleEditDish}
      submitLabel="Update Dish"
      errors={errors}
      loading={loading}
    />
  );
}
