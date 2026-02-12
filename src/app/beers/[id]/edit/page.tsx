"use client"

import React, {useEffect, useState} from "react";
import {Beer, BeerStyle, Maker} from "@/app/types";
import {BeerForm} from "@/app/beers/components";
import {beersService, beerStylesService, makersService} from "@/app/services";
import {redirect, useParams} from "next/navigation";
import {ApiError, ApiErrorMessages} from "@/app/services/api-fetch";
import {Loading} from "@/app/components";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApiErrorMessages>({});
  const [beer, setBeer] = useState<Beer>();
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>();
  const [makers, setMakers] = useState<Maker[]>();
  const {id} = useParams()

  useEffect(() => {
    beerStylesService.index().then((res) => setBeerStyles(res))
    makersService.index().then((res) => setMakers(res))
  }, []);

  useEffect(() => {
    beersService.show(Number(id)).then((res) => setBeer(res))
  }, [id])

  async function editBeer(data: FormData) {
    if (beer == null) {
      return
    }

    setLoading(true);
    let response: Beer | null = null;
    try {
      response = await beersService.update(Number(beer.id), data);
    } catch (error) {
      setLoading(false);
      if (error instanceof ApiError) {
        console.log({t: error.data});
        if (error.status === 422) {
          setErrors(error.data);
        }
        if (error.status === 401) {
          console.log("not authenticated");
        }
        if (error.status === 403) {
          console.log("not authorized");
        }
      }
      return;
    }
    setLoading(false);
    if (response) {
      redirect(`/beers/${response.id}`);
    }
  }

  if (beer == undefined) {
    return <Loading />
  }

  return (
    <BeerForm
      defaultValues={beer}
      action={editBeer}
      submitLabel="Update Beer"
      beerStyles={beerStyles}
      errors={errors}
      loading={loading}
      makers={makers}
    />
  );
}
