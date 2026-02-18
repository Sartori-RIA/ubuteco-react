import {Dish} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const dishesThunks = createCrudThunks<Dish>("dishes", {
  paginated: true,
})
