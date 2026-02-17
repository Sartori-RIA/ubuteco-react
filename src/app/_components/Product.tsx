"use client"

import {Product} from "@/app/_types";
import Image from "next/image";
import React from "react";
import {Card, DestroyButton, EditButton, OpenButton, Toolbar} from ".";
import {isPictureFromS3} from "@/app/_lib";

type Props1 = {
  children: React.ReactNode
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
  product: Product
  url: string
}

export function ProductCard({product, url, children, onDelete}: Props1) {
  return (
    <Card title={product.name} className="min-h-[200px] flex flex-col justify-between">
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-1">
        <p className="text-sm text-gray-500 break-words">
          {children}
        </p>
        {product.image && isPictureFromS3(product.image) && (<div>
          <Image loading="eager"
                 src={product.image?.thumb?.url}
                 width={100}
                 height={100}
                 alt={product.name}
                 unoptimized
          />
        </div>)}
      </div>
      <div className="flex justify-end">
        <OpenButton url={url}/>
        <EditButton url={`${url}/edit`}/>
        <DestroyButton onClick={onDelete}/>
      </div>
    </Card>
  )
}

type Props2 = {
  children: React.ReactNode,
  title: string,
  onSearch?: (value?: string) => void
}

export function ProductList({children, title, onSearch}: Props2) {
  return (<>
      <div className="space-y-6">
        <Toolbar title={title} newUrl={'/beers/new'} onSearch={(e) => onSearch ? onSearch(e.target.value) : {}}/>
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