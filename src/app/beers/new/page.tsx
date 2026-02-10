"use client"

import {BeerForm} from "@/app/beers/components";
import React from "react";
import {Beer} from "@/app/types";

export default function Page() {
  const handleSubmit = (data: Partial<Beer>) => {
    console.log("SAVED", data);
  }

  return (
    <BeerForm
      onSubmit={handleSubmit}
      submitLabel="Save Beer"
      beerStyles={
        [
          {id: 1, name: "lager1"},
          {id: 2, name: "lager2"},
          {id: 3, name: "lager3"}
        ]
      }
      makers={
        [
          {id: 1, name: "maker1"},
          {id: 1, name: "maker2"},
          {id: 1, name: "maker3"},
        ]
      }
    />)
}
