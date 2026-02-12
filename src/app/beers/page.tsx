"use client"

import {Beer} from "@/app/types";
import {truncateWords} from "@/app/lib";
import {ProductCard, ProductList} from "@/app/components/Product";
import {beersService} from "@/app/services";
import {useEffect, useState} from "react";
import {Toolbar} from "@/app/components";
import { useRouter } from "next/navigation";

export default function Page() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    beersService.index().then((res) => setBeers(res));
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Toolbar newUrl={'/beers/new'} title={'Beers'}/>
      </div>);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    await beersService.destroy(Number(id))

    setBeers(prev => prev.filter(beer => beer.id !== id));
    router.refresh();
  }

  return (
    <ProductList title="Beers">
      {beers.map((product: Beer) => (
        <ProductCard
          key={product.id}
          url={`/beers/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          <>
            <strong>Style</strong>: {product.beer_style?.name} <br/>
            <strong>Maker</strong>: {product.maker?.name} <br/>
            <strong>ABV</strong>: {product.abv}&nbsp;<strong>IBU</strong>: {product.ibu}
            <br/>
            <br/>
            {truncateWords(product.description ?? "", 50)}
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}