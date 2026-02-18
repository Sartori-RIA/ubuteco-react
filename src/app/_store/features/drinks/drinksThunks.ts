import {Drink} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const drinkThunks = createCrudThunks<Drink>("drinks", {
  paginated: true,
})