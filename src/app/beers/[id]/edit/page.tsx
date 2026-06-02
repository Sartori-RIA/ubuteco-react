"use client"

import React, {useEffect} from "react";
import {BeerForm} from "@/app/beers/components";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {beerThunks} from "@/app/_store/features/beers/beersThunks";
import {useAppDispatch} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const router = useRouter();
  const t = useTranslations();

  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const beer = useSelector((state: RootState) => state.beers.beers.find((beer) => beer.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.beers);

  useEffect(() => {
    if (id) {
      dispatch(beerThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEditBeer(data: FormData) {
    try {
      const updatedBeer = await dispatch(beerThunks.update({id: Number(id), data})).unwrap()
      router.push(`/beers/${updatedBeer.id}`);
    } catch (error) {
    }
  }

  if (loading) return <Loading/>;
  if (beer === undefined) return <h1>Not Found</h1>

  return (
    <BeerForm
      defaultValues={beer}
      action={handleEditBeer}
      submitLabel={t("forms.updateBeerSubmit")}
      errors={errors}
      loading={loading}
    />
  );
}
