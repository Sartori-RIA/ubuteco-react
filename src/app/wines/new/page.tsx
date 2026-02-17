"use client"

import {WineForm} from "@/app/wines/components";
import React, {useEffect, useState} from "react";
import {beerStylesService, makersService} from "@/app/_services";
import {Maker, WineStyle} from "@/app/_types";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {createWine} from "@/app/_features/wines/winesThunks";

export default function Page() {
  const [wineStyles, setWineStyles] = useState<WineStyle[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const {loading, errors} = useSelector((state: RootState) => state.wines);
  const dispatch = useAppDispatch()

  useEffect(() => {
    beerStylesService.index().then((res) => setWineStyles(res));
    makersService.index().then((res) => setMakers(res));
  }, []);

  async function handleCreateBeer(formData: FormData) {
    dispatch(createWine(formData))
  }

  return (
    <WineForm
      action={handleCreateBeer}
      submitLabel="Save Beer"
      wineStyles={wineStyles}
      loading={loading}
      errors={errors}
      makers={makers}
    />)
}
