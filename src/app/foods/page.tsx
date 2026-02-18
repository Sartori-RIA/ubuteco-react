"use client"

import {Food} from "@/app/_types";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect, useState} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";

export default function Page() {
  const {foods, loading} = useAppSelector((state: RootState) => state.foods);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    dispatch(foodsThunks.fetchAll({search}));
  }, [search]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    dispatch(foodsThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/foods/new" onSearch={setSearch} title="Foods">
      {loading && <Loading/>}
      {!loading && foods.map((product: Food) => (
        <ProductCard
          key={product.id}
          url={`/foods/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          {JSON.stringify(product, null, 2)}
        </ProductCard>
      ))}
    </ProductList>
  );
}