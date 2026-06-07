"use client"

import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {tablesThunks} from "@/app/_store/features/tables/tablesThunks";
import {useEffect} from "react"
import {CreateTableRow} from "@/app/tables/components/CreateTableRow";
import {TableRow} from "@/app/tables/components/TableRow";
import {FormErrors, Loading} from "@/app/_components";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function TablesList() {
  const dispatch = useAppDispatch()
  const t = useTranslations()
  const {canMutateOperationalData} = useAuthCapabilities()
  const {tables, errors, loading} = useAppSelector(s => s.tables)

  useEffect(() => {
    dispatch(tablesThunks.fetchAll({}))
  }, [dispatch])

  const handleCreate = async (name: string, chairs: number) => {
    await dispatch(tablesThunks.create({name, chairs}))
  }

  const handleUpdate = async (id: number, name: string, chairs: number) => {
    await dispatch(tablesThunks.update({id, data: {name, chairs}}))
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirmDelete"))) return
    await dispatch(tablesThunks.delete(id))
  }

  return (
    <div className="space-y-2">
      {errors && <FormErrors errors={errors}/>}
      {loading && <Loading/>}
      {canMutateOperationalData && <CreateTableRow onCreate={handleCreate}/>}
      <ul className="rounded-2xl flex flex-col gap-2">
        {!loading && tables.map(table => (
          <TableRow
            key={table.id}
            table={table}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            readOnly={!canMutateOperationalData}
          />
        ))}
      </ul>
    </div>
  )
}
