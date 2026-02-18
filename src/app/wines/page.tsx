"use client"

import {Wine} from "@/app/_types";
import {truncateWords} from "@/app/_lib";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect, useState} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";

export default function Page() {
  const {wines, loading} = useAppSelector((state: RootState) => state.wines);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(winesThunks.fetchAll({search}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    dispatch(winesThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/wines/new" onSearch={setSearch} title="Wines">
      {loading && <Loading/>}
      {!loading && wines.map((product: Wine) => (
        <ProductCard
          key={product.id}
          url={`/wines/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          <>
            <strong>Grapes</strong>: {product.grapes} <br/>
            <strong>Ripening</strong>: {product.ripening} <br/>
            <strong>Vintage wine</strong>: {product.vintage_wine} <br/>
            <strong>Visual</strong>: {product.visual} <br/>
            <strong>Maker</strong>: {product.maker?.name} <br/>
            <strong>ABV</strong>: {product.abv}
            <br/>
            <br/>
            {truncateWords(product.description ?? "", 50)}
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}