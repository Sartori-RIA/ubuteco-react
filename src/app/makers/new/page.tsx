"use client"

import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {useRouter} from "next/navigation";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";
import {MakerForm} from "@/app/makers/components/MakerForm";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.wines);
  const dispatch = useAppDispatch()
  const router = useRouter();

  async function handleCreate(formData: FormData) {
    try {
      const newMaker = await dispatch(makersThunks.create(formData)).unwrap()
      router.push(`/makers/${newMaker.id}`);
    } catch (error) {
    }
  }

  return (
    <MakerForm
      action={handleCreate}
      submitLabel="Save Wine"
      loading={loading}
      errors={errors}
    />)
}
