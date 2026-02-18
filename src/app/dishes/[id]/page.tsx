"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import Image from "next/image";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const dish = useSelector((state: RootState) => state.dishes.dishes.find((dish) => dish.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.dishes);

  useEffect(() => {
    if (id) {
      dispatch(dishesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (dish === undefined) return <h1>Not Found</h1>

  return (
    <Card title={dish.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          {JSON.stringify(dish)}
        </p>
        <div>
          <Image loading="eager"
                 src={dish.image_url}
                 width={500}
                 height={400}
                 alt={dish.name}
                 unoptimized
          />
        </div>
      </div>
    </Card>
  )
}