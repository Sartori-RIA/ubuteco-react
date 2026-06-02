"use client"

import {DrinkForm} from "@/app/drinks/components";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import {useRouter} from "next/navigation";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.drinks);
  const dispatch = useAppDispatch()
  const router = useRouter();
  const t = useTranslations();

  async function handleCreateDrink(formData: FormData) {
    try {
      const updatedDrink = await dispatch(drinkThunks.create(formData)).unwrap()
      router.push(`/drinks/${updatedDrink.id}`);
    } catch (error) {
    }
  }

  return (
    <DrinkForm
      action={handleCreateDrink}
      submitLabel={t("forms.saveDrink")}
      loading={loading}
      errors={errors}
    />)
}
