"use client"

import {WineForm} from "@/app/wines/components";
import React, {useEffect, useState} from "react";
import {beerStylesService, makersService} from "@/app/_services";
import {Maker, WineStyle} from "@/app/_types";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";
import {useRouter} from "next/navigation";

export default function Page() {
  const [wineStyles, setWineStyles] = useState<WineStyle[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const {loading, errors} = useSelector((state: RootState) => state.wines);
  const dispatch = useAppDispatch()
  const router = useRouter();

  useEffect(() => {
    beerStylesService.index().then((res) => setWineStyles(res));
    makersService.index().then((res) => setMakers(res));
  }, []);

  async function handleCreateBeer(formData: FormData) {
    try {
      const newWine = await dispatch(winesThunks.create(formData)).unwrap()
      router.push(`/wines/${newWine.id}`);
    } catch (error) {
    }
  }

  return (
    <WineForm
      action={handleCreateBeer}
      submitLabel="Save Wine"
      wineStyles={wineStyles}
      loading={loading}
      errors={errors}
      makers={makers}
    />)
}
