"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/components";
import {Beer} from "@/app/types";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {beersService} from "@/app/services";
import {isPictureFromS3} from "@/app/lib";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const [beer, setBeer] = useState<Beer | null>(null);

  useEffect(() => {
    beersService.show(Number(id)).then((res) => setBeer(res))
  }, [id]);

  if (beer == null) {
    return <Loading/>;
  }

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