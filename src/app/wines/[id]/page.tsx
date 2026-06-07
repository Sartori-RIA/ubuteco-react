"use client"

import {useParams} from "next/navigation";
import {Card, Loading, ProductDetailImage} from "@/app/_components";
import {StockDisplay} from "@/app/_components/StockDisplay";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const t = useTranslations();

  const wine = useSelector((state: RootState) => state.wines.wines.find((wine) => wine.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.wines);

  useEffect(() => {
    if (id) {
      dispatch(winesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (wine === undefined) return <h1>{t("common.notFound")}</h1>

  return (
    <Card title={wine.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>{t("catalog.grapes")}</strong>: {wine.grapes} <br/>
          <strong>{t("catalog.ripening")}</strong>: {wine.ripening} <br/>
          <strong>{t("catalog.vintageWine")}</strong>: {wine.vintage_wine} <br/>
          <strong>{t("catalog.visual")}</strong>: {wine.visual} <br/>
          <strong>{t("common.maker")}</strong>: {wine.maker?.name} <br/>
          <strong>{t("common.abv")}</strong>: {wine.abv} <br/>
          <StockDisplay quantity={wine.quantity_stock}/> <br/>
          {wine.description}
        </p>
        <ProductDetailImage src={wine.image_url} alt={wine.name}/>

      </div>
    </Card>
  )
}
