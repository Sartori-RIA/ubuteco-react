import {Beer} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const beerThunks = createCrudThunks<Beer>("beers", {
  paginated: true,
})
