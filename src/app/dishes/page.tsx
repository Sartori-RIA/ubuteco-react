"use client"

import {Dish} from "@/app/_types";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";
import dynamic from "next/dynamic";
import {setSearchTerm} from "@/app/_store/features/dishes/dishesSlice";

function Page() {
  const {dishes, loading} = useAppSelector((state: RootState) => state.dishes);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(state => state.dishes.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(dishesThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    dispatch(dishesThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/dishes/new"
                 searchValue={searchTerm}
                 onSearch={(v) => dispatch(setSearchTerm(v))}
                 title="Dishes">
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

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});