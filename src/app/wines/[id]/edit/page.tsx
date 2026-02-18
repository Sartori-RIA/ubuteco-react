"use client"

import React, {useEffect, useState} from "react";
import {Maker, WineStyle} from "@/app/_types";
import {makersService, wineStylesService} from "@/app/_services";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";
import {WineForm} from "@/app/wines/components";

export default function Page() {
  const [wineStyles, setWineStyles] = useState<WineStyle[]>();
  const [makers, setMakers] = useState<Maker[]>();
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const wine = useSelector((state: RootState) => state.wines.wines.find((wine) => wine.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.wines);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(winesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    wineStylesService.index().then((res) => setWineStyles(res))
    makersService.index().then((res) => setMakers(res))
  }, []);

  async function handleEditWine(data: FormData) {
    try {
      const updatedWine = await dispatch(winesThunks.update({id: Number(id), data})).unwrap()
      router.push(`/wines/${updatedWine.id}`);
    } catch (error) {
    }
  }

  if (loading) return <Loading/>;
  if (wine === undefined) return <h1>Not Found</h1>

  return (
    <WineForm
      defaultValues={wine}
      action={handleEditWine}
      submitLabel="Update Wine"
      wineStyles={wineStyles}
      errors={errors}
      loading={loading}
      makers={makers}
    />
  );
}
