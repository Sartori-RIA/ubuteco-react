"use client"

import {DrinkForm} from "@/app/drinks/components";
import React, {useState} from "react";
import {Maker} from "@/app/_types";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import {useRouter} from "next/navigation";

export default function Page() {
  const [makers, setMakers] = useState<Maker[]>([]);
  const {loading, errors} = useSelector((state: RootState) => state.drinks);
  const dispatch = useAppDispatch()
  const router = useRouter();

  async function handleCreateBeer(formData: FormData) {
    try {
      const updatedDrink = await dispatch(drinkThunks.create(formData)).unwrap()
      router.push(`/drinks/${updatedDrink.id}`);
    } catch (error) {
    }
  }

  return (
    <DrinkForm
      action={handleCreateBeer}
      submitLabel="Save Drink"
      loading={loading}
      errors={errors}
      makers={makers}
    />)
}
