"use client"

import {Product} from "@/app/_types";
import Image from "next/image";
import React from "react";
import {Card, DestroyButton, EditLinkButton, OpenButton, Toolbar} from ".";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";

type Props1 = {
  children: React.ReactNode
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
  product: Product
  url: string
}

export function ProductCard({product, url, children, onDelete}: Props1) {
  const {canMutateOperationalData} = useAuthCapabilities();

  return (
    <Card title={product.name} className="min-h-[200px] flex flex-col justify-between">
      <div className="grid xs:grid-cols-1 grid-cols-2 gap-1">
        <div className="text-sm text-gray-500 break-words">
          {children}
        </div>
        <div>
          <Image loading="eager"
                 src={product.image_url}
                 width={100}
                 height={100}
                 alt={product.name}
                 unoptimized
          />
        </div>
      </div>
      <div className="flex justify-end">
        <OpenButton url={url}/>
        {canMutateOperationalData && (
          <>
            <EditLinkButton url={`${url}/edit`}/>
            <DestroyButton onClick={onDelete}/>
          </>
        )}
      </div>
    </Card>
  )
}

type Props2 = {
  children: React.ReactNode,
  title: string,
  searchValue: string,
  onSearch?: (value: string) => void
  addProductUrl: string
}

export function ProductList({children, title, searchValue, onSearch, addProductUrl}: Props2) {
  const {canMutateOperationalData} = useAuthCapabilities();

  return (<>
      <div className="space-y-6">
        <Toolbar title={title}
                 newUrl={addProductUrl}
                 searchValue={searchValue}
                 showAdd={canMutateOperationalData}
                 onSearch={(e) => onSearch ? onSearch(e.target.value || "") : {}}/>
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