"use client"

import {BeerForm} from "@/app/beers/components";
import React, {useEffect, useState} from "react";
import {beerStylesService, makersService} from "@/app/_services";
import {BeerStyle, Maker} from "@/app/_types";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {createBeer} from "@/app/_features/beers/beersThunks";

export default function Page() {
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const {loading, errors} = useSelector((state: RootState) => state.beers);
  const dispatch = useAppDispatch()

  useEffect(() => {
    beerStylesService.index().then((res) => setBeerStyles(res));
    makersService.index().then((res) => setMakers(res));
  }, []);

  async function handleCreateBeer(formData: FormData) {
    dispatch(createBeer(formData))
  }

  return (
    <BeerForm
      action={handleCreateBeer}
      submitLabel="Save Beer"
      beerStyles={beerStyles}
      loading={loading}
      errors={errors}
      makers={makers}
    />)
}
