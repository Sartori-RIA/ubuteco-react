"use client"

import {useParams} from "next/navigation";
import {Card} from "@/app/components";
import {Beer} from "@/app/types";
import Image from "next/image";

export default function Page() {
  const params = useParams<{ id: string }>()
  const mockedBeer: Beer = {
    id: Number(params.id),
    beer_style: {id: 1, name: "lager"},
    beer_style_id: 1,
    maker: {id: 1, name: "maker"},
    maker_id: 1,
    name: `Beer ${params.id}`,
    alcohol: 10,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    ibu: 10,
    image: {
      thumb: {
        url: "http://lorempixel.com.br/500/400/?1"
      },
      url: "http://lorempixel.com.br/500/400/?1"
    }
  }
  return (
    <Card title={mockedBeer.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>Style</strong>: {mockedBeer.beer_style?.name} <br/>
          <strong>Maker</strong>: {mockedBeer.maker?.name} <br/>
          <strong>Quantity in Stock</strong>: {mockedBeer.quantity_stock} <br/>
          <strong>Alcohol</strong>: {mockedBeer.alcohol}&nbsp;<strong>IBU</strong>: {mockedBeer.ibu}
          <br/><br/>
          {mockedBeer.description}
        </p>
        {mockedBeer.image && (<div>
          <Image src={mockedBeer.image?.url} width={500} height={400} alt={mockedBeer.name}/>
        </div>)}

      </div>
    </Card>
  )
}