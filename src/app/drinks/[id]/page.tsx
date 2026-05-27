"use client"

import {useParams} from "next/navigation";
import {Card, Loading} from "@/app/_components";
import Image from "next/image";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const drink = useSelector((state: RootState) => state.drinks.drinks.find((drink) => drink.id === Number(id)));
  const {loading} = useSelector((state: RootState) => state.drinks);

  useEffect(() => {
    if (id) {
      dispatch(drinkThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <Loading/>;
  if (drink === undefined) return <h1>Not Found</h1>

  return (
    <Card title={drink.name}>
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-2">
        <p>
          {drink.description}
        </p>
        <div>
          <Image loading="eager"
                 src={drink.image_url}
                 width={500}
                 height={400}
                 alt={drink.name}
                 unoptimized
          />
        </div>
      </div>
    </Card>
  )
}