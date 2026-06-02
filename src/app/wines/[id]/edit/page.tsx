"use client"

import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";
import {WineForm} from "@/app/wines/components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const wine = useSelector((state: RootState) => state.wines.wines.find((wine) => wine.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.wines);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (id) {
      dispatch(winesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEditWine(data: FormData) {
    try {
      const updatedWine = await dispatch(winesThunks.update({id: Number(id), data})).unwrap()
      router.push(`/wines/${updatedWine.id}`);
    } catch (error) {
    }
  }

  if (loading) return <Loading/>;
  if (wine === undefined) return <h1>{t("common.notFound")}</h1>

  return (
    <WineForm
      defaultValues={wine}
      action={handleEditWine}
      submitLabel={t("forms.updateWineSubmit")}
      errors={errors}
      loading={loading}
    />
  );
}
