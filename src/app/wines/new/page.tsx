"use client"

import {WineForm} from "@/app/wines/components";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";
import {useRouter} from "next/navigation";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.wines);
  const dispatch = useAppDispatch()
  const router = useRouter();

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
      loading={loading}
      errors={errors}
    />)
}
