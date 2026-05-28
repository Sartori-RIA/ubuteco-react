"use client"

import {useParams} from "next/navigation";
import {Card, Loading, ProductDetailImage} from "@/app/_components";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const maker = useSelector((state: RootState) => state.makers.makers.find((m) => m.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.makers);

  useEffect(() => {
    if (id) {
      dispatch(makersThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (maker === undefined) return <h1>Not Found</h1>

  return (
    <Card title={maker.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>Country</strong>: {maker.country ?? "—"}
        </p>
        <ProductDetailImage src={maker.logo_url} alt={maker.name}/>
      </div>
    </Card>
  )
}
