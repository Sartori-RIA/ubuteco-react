"use client"

import {Food} from "@/app/_types";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {StockDisplay} from "@/app/_components/StockDisplay";
import {useEffect} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import dynamic from "next/dynamic";
import {setSearchTerm} from "@/app/_store/features/foods/foodsSlice";

function Page() {
  const {foods, loading} = useAppSelector((state: RootState) => state.foods);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const t = useTranslations();
  const {displayPrice, formatDate} = useMoneyFormat();
  const searchTerm = useAppSelector(state => state.foods.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(foodsThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm(t("common.confirmDelete"))) return;

    dispatch(foodsThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/foods/new"
                 title={t("nav.foods")}
                 searchValue={searchTerm}
                 onSearch={(v) => dispatch(setSearchTerm(v))}
    >
      {loading && <Loading/>}
      {!loading && foods.map((food: Food) => (
        <ProductCard
          key={food.id}
          url={`/foods/${food.id}`}
          product={food}
          onDelete={() => handleDelete(Number(food.id))}
        >
          <>
            <strong>{t("common.price")}</strong>: {displayPrice(food)}<br/>
            <StockDisplay quantity={food.quantity_stock}/><br/>
            <strong>{t("catalog.validUntil")}</strong>: {formatDate(food.valid_until)}
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
