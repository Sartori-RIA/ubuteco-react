"use client"

import {Product} from "@/app/_types";
import Image from "next/image";
import React from "react";
import {Card, DestroyButton, EditLinkButton, OpenButton, Toolbar} from ".";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";

type Props1 = {
  children: React.ReactNode
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
  product: Pick<Product, "name"> & {image_url?: string; thumbnail_url?: string}
  url: string
  showImage?: boolean
}

export function ProductCard({product, url, children, onDelete, showImage = true}: Props1) {
  const {canMutateOperationalData} = useAuthCapabilities();
  const imageUrl = product.thumbnail_url ?? product.image_url;

  return (
    <Card title={product.name} className="min-h-[200px] flex flex-col justify-between">
      <div className={showImage && imageUrl ? "space-y-3" : ""}>
        <div className="text-sm text-gray-500 break-words">
          {children}
        </div>
        {showImage && imageUrl && (
          <div className="relative mx-auto h-44 w-full max-w-[220px] overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="220px"
              unoptimized
            />
          </div>
        )}
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