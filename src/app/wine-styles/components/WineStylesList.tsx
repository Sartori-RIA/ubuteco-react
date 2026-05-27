"use client"


import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {wineStylesThunks} from "@/app/_store/features/wine_styles/wineStylesThunks";
import {useEffect} from "react"
import {CreateWineStyleRow} from "@/app/wine-styles/components/CreateWineStyleRow";
import {WineStyleRow} from "@/app/wine-styles/components/WineStyleRow";
import {FormErrors, Loading} from "@/app/_components";


export function WineStylesList() {
  const dispatch = useAppDispatch()

  const {wineStyles, errors, loading} = useAppSelector(s => s.wineStyles)

  useEffect(() => {
    dispatch(wineStylesThunks.fetchAll({}))
  }, [dispatch])

  const handleCreate = async (name: string) => {
    await dispatch(wineStylesThunks.create({name}))
  }

  const handleRename = async (id: number, name: string) => {
    await dispatch(wineStylesThunks.update({id, data: {name}}))
  }

  const handleDelete = async (id: number) => {
    await dispatch(wineStylesThunks.delete(id))
  }

  return (
    <div className="space-y-2">
      {errors && <FormErrors errors={errors}/>}
      {loading && <Loading />}
      <CreateWineStyleRow onCreate={handleCreate} />
      <ul className="rounded-2xl flex flex-col gap-2">
        {!loading && wineStyles.map(style => (
          <WineStyleRow
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
