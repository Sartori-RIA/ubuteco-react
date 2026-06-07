"use client"

import {useParams} from "next/navigation";
import {Card, Loading, ProductDetailImage} from "@/app/_components";
import {StockDisplay} from "@/app/_components/StockDisplay";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const t = useTranslations();

  const drink = useSelector((state: RootState) => state.drinks.drinks.find((drink) => drink.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.drinks);

  useEffect(() => {
    if (id) {
      dispatch(drinkThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (drink === undefined) return <h1>{t("common.notFound")}</h1>

  return (
    <Card title={drink.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <StockDisplay quantity={drink.quantity_stock}/> <br/>
          {drink.description}
        </p>
        <ProductDetailImage src={drink.image_url} alt={drink.name}/>
      </div>
    </Card>
  )
}
