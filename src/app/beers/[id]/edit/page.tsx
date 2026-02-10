"use client";

import React from "react";
import {Beer} from "@/app/types";
import {BeerForm} from "@/app/beers/components";

export default function Page() {
  const beer: Beer = {
    id: 1,
    beer_style: {id: 1, name: "lager"},
    beer_style_id: 1,
    maker: {id: 1, name: "maker"},
    maker_id: 1,
    name: `Beer 1`,
    alcohol: 10,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    ibu: 10,
    image: {
      thumb: {
        url: "http://lorempixel.com.br/500/400/?1"
      },
      url: "http://lorempixel.com.br/500/400/?1"
    }
  }

  async function handleUpdate(data: Partial<Beer>) {
    console.log("UPDATE", data);
  }

  return (

    <BeerForm
      defaultValues={beer}
      onSubmit={handleUpdate}
      submitLabel="Update Beer"
      beerStyles={
        [
          {id: 1, name: "lager"},
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
    />
  );
}
