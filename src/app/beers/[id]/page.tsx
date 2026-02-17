"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import Image from "next/image";
import React, {useEffect} from "react";
import {isPictureFromS3} from "@/app/_lib";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {fetchBeerById} from "@/app/_features/beers/beersThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const beer = useSelector((state: RootState) => state.beers.beers.find((beer) => beer.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.beers);

  useEffect(() => {
    if (id) {
      dispatch(fetchBeerById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (beer === undefined) return <h1>Not Found</h1>

  return (
    <Card title={beer.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>Style</strong>: {beer.beer_style?.name} <br/>
          <strong>Maker</strong>: {beer.maker?.name} <br/>
          <strong>Quantity in Stock</strong>: {beer.quantity_stock} <br/>
          <strong>ABV</strong>: {beer.abv}&nbsp;<strong>IBU</strong>: {beer.ibu}
          <br/><br/>
          {beer.description}
        </p>
        {beer.image && isPictureFromS3(beer.image) && (<div>
          <Image loading="eager"
                 src={beer.image?.thumb?.url}
                 width={500}
                 height={400}
                 alt={beer.name}
                 unoptimized
          />
        </div>)}

      </div>
    </Card>
  )
}