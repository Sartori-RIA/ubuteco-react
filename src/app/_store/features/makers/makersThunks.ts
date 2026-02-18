import {createCrudThunks} from "@/app/_store/shared/crudFactory";
import {Maker} from "@/app/_types";

export const makersThunks = createCrudThunks<Maker>("makers", {})