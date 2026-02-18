"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import Image from "next/image";
import React, {useEffect} from "react";
import {isPictureFromS3} from "@/app/_lib";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const wine = useSelector((state: RootState) => state.wines.wines.find((wine) => wine.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.wines);

  useEffect(() => {
    if (id) {
      dispatch(winesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (wine === undefined) return <h1>Not Found</h1>

  return (
    <Card title={wine.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>Grapes</strong>: {wine.grapes} <br/>
          <strong>Ripening</strong>: {wine.ripening} <br/>
          <strong>Vintage wine</strong>: {wine.vintage_wine} <br/>
          <strong>Visual</strong>: {wine.visual} <br/>
          <strong>Maker</strong>: {wine.maker?.name} <br/>
          <strong>ABV</strong>: {wine.abv}
          {wine.description}
        </p>
        {wine.image && isPictureFromS3(wine.image) && (<div>
          <Image loading="eager"
                 src={wine.image?.thumb?.url}
                 width={500}
                 height={400}
                 alt={wine.name}
                 unoptimized
          />
        </div>)}

      </div>
    </Card>
  )
}