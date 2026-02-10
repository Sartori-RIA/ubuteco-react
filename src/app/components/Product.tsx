import {Product} from "@/app/types";
import {Card} from "@/app/components/Card";
import Image from "next/image";
import {AddButton, DestroyButton, EditButton, LinkButton} from "@/app/components/Button";
import React from "react";
import {SearchInput} from "@/app/components/Input";

type Props1 = {
  product: Product
  url: string
  children: React.ReactNode
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDestroy: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function ProductCard({product, url, children, onEdit, onDestroy}: Props1) {
  return (
    <Card title={product.name} className="min-h-[200px] flex flex-col justify-between">
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-1">
        <p className="text-sm text-gray-500 break-words">
          {children}
        </p>
        {product.image && (<div>
          <Image src={product.image?.thumb.url} width={100} height={100} alt={product.name}/>
        </div>)}
      </div>
      <div className="flex justify-end">
        <LinkButton url={url}/>
        <EditButton onClick={onEdit}/>
        <DestroyButton onClick={onDestroy}/>
      </div>
    </Card>
  )
}

type Props2 = {
  children: React.ReactNode,
  title: string,
  onSearch: (value: string) => void
}

export function ProductList({children, title, onSearch}: Props2) {
  return (<>
      <div className="space-y-6">
        <div className="grid xs:grid-cols-1 grid-cols-5 gap-2">
          <h1 className="text-3xl">{title}</h1>
          <SearchInput className={"col-span-3"} onChange={(e) => onSearch(e.target.value)}/>
          <AddButton onClick={() => alert("Add message")}/>
        </div>
        <br/>
        <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-6"
        >
          {children}
        </div>
      </div>
    </>
  )
}