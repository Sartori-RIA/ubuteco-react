import {Food} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const foodsThunks = createCrudThunks<Food>("foods", {
  paginated: true,
})
