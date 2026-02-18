"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import Image from "next/image";
import React, {useEffect} from "react";
import {isPictureFromS3} from "@/app/_lib";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const food = useSelector((state: RootState) => state.foods.foods.find((food) => food.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.foods);

  useEffect(() => {
    if (id) {
      dispatch(foodsThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (food === undefined) return <h1>Not Found</h1>

  return (
    <Card title={food.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          <strong>Quantity in Stock</strong>: {food.quantity_stock} <br/>
        </p>
        {food.image && isPictureFromS3(food.image) && (<div>
          <Image loading="eager"
                 src={food.image?.thumb?.url}
                 width={500}
                 height={400}
                 alt={food.name}
                 unoptimized
          />
        </div>)}

      </div>
    </Card>
  )
}