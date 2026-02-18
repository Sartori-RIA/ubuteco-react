import {Table} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const tablesThunks = createCrudThunks<Table>("tables", {})