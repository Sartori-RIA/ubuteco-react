"use client"

import {Dish} from "@/app/_types";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect, useState} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {deleteDish, fetchDish} from "@/app/_features/dishes/dishesThunks";

export default function Page() {
  const {dishes, loading} = useAppSelector((state: RootState) => state.dishes);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchDish(search));
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    dispatch(deleteDish(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/dishes/new" onSearch={setSearch} title="Dishes">
      {loading && <Loading/>}
      {!loading && dishes.map((product: Dish) => (
        <ProductCard
          key={product.id}
          url={`/dishes/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          <>
            <br/>
            {JSON.stringify(product)}
            <br/>
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}