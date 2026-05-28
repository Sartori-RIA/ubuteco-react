"use client"

import {useParams} from "next/navigation";
import {Card, Loading, ProductDetailImage} from "@/app/_components";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {displayPrice} from "@/app/_lib/money";
import {formatDate} from "@/app/_lib/format-date";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const food = useSelector((state: RootState) => state.foods.foods.find((item) => item.id === Number(id)));
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
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-4">
        <dl className="space-y-2 text-sm text-gray-600">
          <div>
            <dt className="font-medium text-gray-900">Price</dt>
            <dd>{displayPrice(food)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Stock</dt>
            <dd>{food.quantity_stock ?? 0}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Valid until</dt>
            <dd>{formatDate(food.valid_until)}</dd>
          </div>
        </dl>
        <ProductDetailImage src={food.image_url} alt={food.name}/>
      </div>
    </Card>
  )
}
