"use client"

import {useParams} from "next/navigation";
import Link from "next/link";
import {Card, Loading, ProductDetailImage} from "@/app/_components";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";
import {displayPrice} from "@/app/_lib/money";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const {canMutateOperationalData} = useAuthCapabilities()

  const dish = useSelector((state: RootState) => state.dishes.dishes.find((item) => item.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.dishes);

  useEffect(() => {
    if (id) {
      dispatch(dishesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (dish === undefined) return <h1>Not Found</h1>

  const ingredients = dish.dish_ingredients ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {canMutateOperationalData && (
        <div className="flex justify-end">
          <Link
            href={`/dishes/${dish.id}/edit`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Edit dish
          </Link>
        </div>
      )}

      <Card title={dish.name} className="hover:translate-y-0">
        <div className="grid xs:grid-cols-1 grid-cols-2 gap-4 mb-6">
          <p className="text-sm text-gray-600">
            <strong>Price</strong>: {displayPrice(dish)}
          </p>
          <ProductDetailImage src={dish.image_url} alt={dish.name}/>
        </div>

        <h4 className="text-sm font-semibold text-gray-900 mb-3">Ingredients</h4>
        {ingredients.length === 0 ? (
          <p className="text-sm text-gray-500">No ingredients listed.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-2 font-medium">Food</th>
                  <th className="px-4 py-2 font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient) => (
                  <tr key={ingredient.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{ingredient.food?.name ?? `Food #${ingredient.food_id}`}</td>
                    <td className="px-4 py-2">{ingredient.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
