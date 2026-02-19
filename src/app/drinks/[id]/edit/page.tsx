"use client"

import React, {useEffect, useState} from "react";
import {Maker} from "@/app/_types";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import {DrinkForm} from "@/app/drinks/components";

export default function Page() {
  const [makers, setMakers] = useState<Maker[]>();

  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const drink = useSelector((state: RootState) => state.drinks.drinks.find((drink) => drink.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.drinks);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(drinkThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEditDrink(data: FormData) {
    try {
      const updatedDrink = await dispatch(drinkThunks.update({id: Number(id), data})).unwrap()
      router.push(`/drinks/${updatedDrink.id}`);
    } catch (error) {
    }
  }

  if (loading) return <Loading/>;
  if (drink === undefined) return <h1>Not Found</h1>

  return (
    <DrinkForm
      defaultValues={drink}
      action={handleEditDrink}
      submitLabel="Update Drink"
      errors={errors}
      loading={loading}
      makers={makers}
    />
  );
}
