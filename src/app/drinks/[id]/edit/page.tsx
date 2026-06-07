"use client"

import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import {DrinkForm} from "@/app/drinks/components";
import {StockAdjustmentPanel} from "@/app/_components/StockAdjustmentPanel";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const drink = useSelector((state: RootState) => state.drinks.drinks.find((drink) => drink.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.drinks);
  const router = useRouter();
  const t = useTranslations();

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
  if (drink === undefined) return <h1>{t("common.notFound")}</h1>

  return (
    <>
      <DrinkForm
        defaultValues={drink}
        action={handleEditDrink}
        submitLabel={t("forms.updateDrinkSubmit")}
        errors={errors}
        loading={loading}
      />
      <StockAdjustmentPanel
        productType="drinks"
        productId={Number(id)}
        quantityStock={drink.quantity_stock ?? 0}
        onStockChanged={() => dispatch(drinkThunks.fetchById(Number(id)))}
      />
    </>
  );
}
