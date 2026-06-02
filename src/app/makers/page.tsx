"use client"

import {Maker} from "@/app/_types";
import {ProductCard, ProductList} from "@/app/_components/Product";
import {useEffect} from "react";
import {Loading} from "@/app/_components";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import dynamic from "next/dynamic";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";
import {setSearchTerm} from "@/app/_store/features/makers/makersSlice";

function Page() {
  const {makers, loading} = useAppSelector((state: RootState) => state.makers);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const t = useTranslations();
  const searchTerm = useAppSelector(state => state.makers.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(makersThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm(t("common.confirmDelete"))) return;

    dispatch(makersThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <ProductList addProductUrl="/makers/new"
                 searchValue={searchTerm}
                 onSearch={(v) => dispatch(setSearchTerm(v))}
                 title={t("nav.makers")}>
      {loading && <Loading/>}
      {!loading && makers.map((maker: Maker) => (
        <ProductCard
          key={maker.id}
          url={`/makers/${maker.id}`}
          product={{
            name: maker.name,
            image_url: maker.logo_url,
            thumbnail_url: maker.logo_thumbnail_url,
          }}
          onDelete={() => handleDelete(Number(maker.id))}
        >
          <>
            <strong>Country</strong>: {maker.country ?? "—"}
          </>
        </ProductCard>
      ))}
    </ProductList>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
