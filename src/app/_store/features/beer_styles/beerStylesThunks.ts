import {BeerStyle} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const beerStylesThunks = createCrudThunks<BeerStyle>("beer_styles", {})