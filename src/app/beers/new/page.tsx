"use client"

import {BeerForm} from "@/app/beers/components";
import React, {useEffect, useState} from "react";
import {beersService, beerStylesService, makersService} from "@/app/services";
import {Beer, BeerStyle, Maker} from "@/app/types";
import {ApiError, ApiErrorMessages} from "@/app/services/api-fetch";
import {redirect} from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApiErrorMessages>({});
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);

  useEffect(() => {
    beerStylesService.index().then((res) => setBeerStyles(res));
    makersService.index().then((res) => setMakers(res));
  }, []);

  async function createBeer(formData: FormData) {
    setLoading(true);
    let response: Beer | null = null;
    try {
      response = await beersService.create(formData);
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

  return (
    <BeerForm
      action={createBeer}
      submitLabel="Save Beer"
      beerStyles={beerStyles}
      loading={loading}
      errors={errors}
      makers={makers}
    />)
}
