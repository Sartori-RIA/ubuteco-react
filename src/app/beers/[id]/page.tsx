"use client"

import {useParams} from "next/navigation";
import {Card, Loading, ProductDetailImage} from "@/app/_components";
import {StockDisplay} from "@/app/_components/StockDisplay";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {beerThunks} from "@/app/_store/features/beers/beersThunks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useEntityDocumentTitle} from "@/app/_hooks/useDocumentTitle";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const t = useTranslations();

  const beer = useSelector((state: RootState) => state.beers.beers.find((beer) => beer.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.beers);

  useEntityDocumentTitle(beer?.name);

  useEffect(() => {
    if (id) {
      dispatch(beerThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (beer === undefined) return <h1>{t("common.notFound")}</h1>

  return (
    <Card title={beer.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>{t("common.style")}</strong>: {beer.beer_style?.name} <br/>
          <strong>{t("common.maker")}</strong>: {beer.maker?.name} <br/>
          <StockDisplay quantity={beer.quantity_stock}/> <br/>
          <strong>{t("common.abv")}</strong>: {beer.abv}&nbsp;<strong>{t("common.ibu")}</strong>: {beer.ibu}
          <br/><br/>
          {beer.description}
        </p>
        <ProductDetailImage src={beer.image_url} alt={beer.name}/>
      </div>
    </Card>
  )
}
