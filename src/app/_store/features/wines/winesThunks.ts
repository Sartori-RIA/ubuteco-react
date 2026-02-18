import {Wine} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const winesThunks = createCrudThunks<Wine>("wines", {
  paginated: true,
})