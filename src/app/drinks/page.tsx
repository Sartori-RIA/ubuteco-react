"use client"

import {Drink} from "@/app/_types";
import {truncateWords} from "@/app/_lib";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect, useState} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {deleteDrink, fetchDrink} from "@/app/_features/drinks/drinksThunks";

export default function Page() {
  const {drinks, loading} = useAppSelector((state: RootState) => state.drinks);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchDrink(search));
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, dispatch]);

  function handleSearch(v?: string) {
    setSearch(v || "")
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    dispatch(deleteDrink(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/drinks/new" onSearch={(v) => handleSearch(v)} title="Drinks">
      {loading && <Loading/>}
      {!loading && drinks.map((product: Drink) => (
        <ProductCard
          key={product.id}
          url={`/drinks/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          <>
            <strong>Maker</strong>: {product.maker?.name} <br/>
            <br/>
            <br/>
            {truncateWords(product.description ?? "", 50)}
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}