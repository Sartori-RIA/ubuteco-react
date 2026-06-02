"use client"

import {BeerForm} from "@/app/beers/components";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {beerThunks} from "@/app/_store/features/beers/beersThunks";
import {useRouter} from "next/navigation";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.beers);
  const dispatch = useAppDispatch()
  const router = useRouter();
  const t = useTranslations();

  async function handleCreateBeer(formData: FormData) {
    try {
      const updatedBeer = await dispatch(beerThunks.create(formData)).unwrap()
      router.push(`/beers/${updatedBeer.id}`);
    } catch (error) {
    }
  }

  return (
    <BeerForm
      action={handleCreateBeer}
      submitLabel={t("forms.saveBeer")}
      loading={loading}
      errors={errors}
    />)
}
