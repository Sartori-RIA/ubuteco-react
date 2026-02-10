"use client"

import {Product} from "@/app/types";
import {Card} from "@/app/components/Card";
import Image from "next/image";
import {AddButton, DestroyButton, EditButton, OpenButton} from "@/app/components/Button";
import React from "react";
import {SearchInput} from "@/app/components/Input";

type Props1 = {
  children: React.ReactNode
  onDestroy: (event: React.MouseEvent<HTMLButtonElement>) => void
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  product: Product
  url: string
}

export function ProductCard({product, url, children, onDestroy}: Props1) {
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
        <OpenButton url={url}/>
        <EditButton url={`/beers/${product.id}/edit`}/>
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
          <AddButton url={'/beers/new'}/>
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