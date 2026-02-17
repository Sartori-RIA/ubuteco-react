"use client"

import React, {useEffect, useState} from "react";
import {BeerStyle, Maker} from "@/app/_types";
import {BeerForm} from "@/app/beers/components";
import {beerStylesService, makersService} from "@/app/_services";
import {useParams} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {fetchBeerById, updateBeer} from "@/app/_features/beers/beersThunks";
import {useAppDispatch} from "@/app/_store/hooks";

export default function Page() {
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>();
  const [makers, setMakers] = useState<Maker[]>();


  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const beer = useSelector((state: RootState) => state.beers.beers.find((beer) => beer.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.beers);

  useEffect(() => {
    if (id) {
      dispatch(fetchBeerById(Number(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    beerStylesService.index().then((res) => setBeerStyles(res))
    makersService.index().then((res) => setMakers(res))
  }, []);

  async function handleEditBeer(data: FormData) {
    dispatch(updateBeer({id: Number(id), data}))
  }

  if (loading) return <Loading/>;
  if (beer === undefined) return <h1>Not Found</h1>

  return (
    <BeerForm
      defaultValues={beer}
      action={handleEditBeer}
      submitLabel="Update Beer"
      beerStyles={beerStyles}
      errors={errors}
      loading={loading}
      makers={makers}
    />
  );
}
