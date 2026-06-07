"use client"

import {Drink} from "@/app/_types";
import {truncateWords} from "@/app/_lib";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {StockDisplay} from "@/app/_components/StockDisplay";
import {useEffect} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import dynamic from "next/dynamic";
import {setSearchTerm} from "@/app/_store/features/drinks/drinksSlice";

function Page() {
  const {drinks, loading} = useAppSelector((state: RootState) => state.drinks);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const t = useTranslations();
  const searchTerm = useAppSelector(state => state.drinks.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(drinkThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm(t("common.confirmDelete"))) return;

    dispatch(drinkThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/drinks/new"
                 searchValue={searchTerm}
                 onSearch={(v) => dispatch(setSearchTerm(v))}
                 title={t("nav.drinks")}
    >
      {loading && <Loading/>}
      {!loading && drinks.map((product: Drink) => (
        <ProductCard
          key={product.id}
          url={`/drinks/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          <>
            <StockDisplay quantity={product.quantity_stock}/>
            <br/>
            <br/>
            {truncateWords(product.description ?? "", 50)}
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});