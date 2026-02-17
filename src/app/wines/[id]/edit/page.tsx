"use client"

import React, {useEffect, useState} from "react";
import {Maker, WineStyle} from "@/app/_types";
import {makersService, wineStylesService} from "@/app/_services";
import {useParams} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {fetchWineById, updateWine} from "@/app/_features/wines/winesThunks";
import {WineForm} from "@/app/wines/components";

export default function Page() {
  const [wineStyles, setWineStyles] = useState<WineStyle[]>();
  const [makers, setMakers] = useState<Maker[]>();


  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const wine = useSelector((state: RootState) => state.wines.wines.find((wine) => wine.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.wines);

  useEffect(() => {
    if (id) {
      dispatch(fetchWineById(Number(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    wineStylesService.index().then((res) => setWineStyles(res))
    makersService.index().then((res) => setMakers(res))
  }, []);

  async function handleEditWine(data: FormData) {
    dispatch(updateWine({id: Number(id), data}))
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
