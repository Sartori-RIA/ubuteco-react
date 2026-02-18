"use client"

import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";
import {MakerForm} from "@/app/makers/components/MakerForm";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const maker = useSelector((state: RootState) => state.makers.makers.find((maker) => maker.id === Number(id)));
  const {loading, errors} = useSelector((state: RootState) => state.makers);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(makersThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEdit(data: FormData) {
    try {
      const updatedWine = await dispatch(makersThunks.update({id: Number(id), data})).unwrap()
      router.push(`/makers/${updatedWine.id}`);
    } catch (error) {
    }
  }

  if (loading) return <Loading/>;
  if (maker === undefined) return <h1>Not Found</h1>

  return (
    <MakerForm
      defaultValues={maker}
      action={handleEdit}
      submitLabel="Update Wine"
      errors={errors}
      loading={loading}
    />
  );
}
