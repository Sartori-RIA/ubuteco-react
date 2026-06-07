"use client"

import {Beer} from "@/app/_types";
import {truncateWords} from "@/app/_lib";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {StockDisplay} from "@/app/_components/StockDisplay";
import {useEffect} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {beerThunks} from "@/app/_store/features/beers/beersThunks";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import dynamic from "next/dynamic";
import {setSearchTerm} from "@/app/_store/features/beers/beersSlice";

function Page() {
  const {beers, loading} = useAppSelector((state: RootState) => state.beers);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const t = useTranslations();
  const searchTerm = useAppSelector(state => state.beers.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(beerThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm(t("common.confirmDelete"))) return;

    dispatch(beerThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/beers/new"
                 searchValue={searchTerm}
                 onSearch={(v) => dispatch(setSearchTerm(v))}
                 title={t("nav.beers")}>
      {loading && <Loading/>}
      {!loading && beers.map((product: Beer) => (
        <ProductCard
          key={product.id}
          url={`/beers/${product.id}`}
          product={product}
          onDelete={() => handleDelete(Number(product.id))}
        >
          <>
            <strong>{t("common.style")}</strong>: {product.beer_style?.name} <br/>
            <strong>{t("common.maker")}</strong>: {product.maker?.name} <br/>
            <strong>{t("common.abv")}</strong>: {product.abv}&nbsp;<strong>{t("common.ibu")}</strong>: {product.ibu}
            <br/>
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