"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import Image from "next/image";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const maker = useSelector((state: RootState) => state.makers.makers.find((maker) => maker.id === Number(id)));
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
          {JSON.stringify(maker)}
        </p>
        <div>
          <Image loading="eager"
                 src={maker.image_url}
                 width={500}
                 height={400}
                 alt={maker.name}
                 unoptimized
          />
        </div>

      </div>
    </Card>
  )
}