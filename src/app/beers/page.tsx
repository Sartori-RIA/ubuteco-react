"use client"

import {Beer, BeerStyle, Maker} from "@/app/types";
import {truncateWords} from "@/app/lib";
import {useState} from "react";
import {ProductCard, ProductList} from "@/app/components/Product";

const beer_styles: BeerStyle[] = [
  {id: 1, name: "lager"}
]

const makers: Maker[] = [
  {id: 1, name: "maker"}
]


const beers_mock: Beer[] = Array.from({length: 100}, (_, index: number): Beer => {
    return {
      id: index,
      beer_style_id: beer_styles[0].id,
      beer_style: beer_styles[0],
      maker_id: makers[0].id,
      maker: makers[0],
      name: `Beer ${index}`,
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
  }
)

export default function Page() {
  const [search, setSearch] = useState('');
  return (<>
      <ProductList title={`Beer ${search}`} onSearch={setSearch}>
        {beers_mock.map((product: Beer) => (
          <ProductCard key={product.name}
                       url={`/beers/${product.id}`}
                       product={product}
                       onEdit={() => alert("edit message")}
                       onDestroy={() => alert("delete message")}
          >
            <>
              <strong>Style</strong>: {product.beer_style?.name} <br/>
              <strong>Maker</strong>: {product.maker?.name} <br/>
              <strong>Alcohol</strong>: {product.alcohol}&nbsp;<strong>IBU</strong>: {product.ibu}
              <br/>
              <br/>
              {truncateWords(product.description || "", 50)}
            </>
          </ProductCard>
        ))}
      </ProductList>
    </>
  )
}