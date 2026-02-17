"use client"

import React, {useEffect, useState} from "react";
import {Maker} from "@/app/_types";
import {makersService} from "@/app/_services";
import {useParams} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {fetchDrinkById, updateDrink} from "@/app/_features/drinks/drinksThunks";
import {DrinkForm} from "@/app/drinks/components";

export default function Page() {
  const [makers, setMakers] = useState<Maker[]>();

  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const drink = useSelector((state: RootState) => state.drinks.drinks.find((drink) => drink.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.drinks);

  useEffect(() => {
    if (id) {
      dispatch(fetchDrinkById(Number(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    makersService.index().then((res) => setMakers(res))
  }, []);

  async function handleEditDrink(data: FormData) {
    dispatch(updateDrink({id: Number(id), data}))
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
