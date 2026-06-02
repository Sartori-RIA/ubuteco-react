"use client"

import {Wine} from "@/app/_types";
import {truncateWords} from "@/app/_lib";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";
import dynamic from "next/dynamic";
import {setSearchTerm} from "@/app/_store/features/wines/winesSlice";

function Page() {
  const {wines, loading} = useAppSelector((state: RootState) => state.wines);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const t = useTranslations();
  const searchTerm = useAppSelector(state => state.wines.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(winesThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm(t("common.confirmDelete"))) return;

    dispatch(winesThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/wines/new"
                 title={t("nav.wines")}
                 searchValue={searchTerm}
                 onSearch={(v) => dispatch(setSearchTerm(v))}
    >
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

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});