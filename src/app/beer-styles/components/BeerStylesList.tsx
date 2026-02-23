"use client"


import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {beerStylesThunks} from "@/app/_store/features/beer_styles/beerStylesThunks";
import {useEffect} from "react"
import {CreateBeerStyleRow} from "@/app/beer-styles/components/CreateBeerStyleRow";
import {BeerStyleRow} from "@/app/beer-styles/components/BeerStyleRow";
import {FormErrors, Loading} from "@/app/_components";


export function BeerStylesList() {
  const dispatch = useAppDispatch()

  const {beerStyles, errors, loading} = useAppSelector(s => s.beerStyles)

  useEffect(() => {
    dispatch(beerStylesThunks.fetchAll({}))
  }, [dispatch])

  const handleCreate = async (name: string) => {
    await dispatch(beerStylesThunks.create({name}))
  }

  const handleRename = async (id: number, name: string) => {
    await dispatch(beerStylesThunks.update({id, data: {name}}))
  }

  const handleDelete = async (id: number) => {
    await dispatch(beerStylesThunks.delete(id))
  }

  return (
    <div className="space-y-2">
      {errors && <FormErrors errors={errors}/>}
      {loading && <Loading />}
      <CreateBeerStyleRow onCreate={handleCreate} />
      <ul className="overflow-hidden rounded-2xl  bg-background flex flex-col gap-2">
        {!loading && beerStyles.map(style => (
          <BeerStyleRow
            key={style.id}
            style={style}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  )
}
