import {WineStyle} from "@/app/_types";
import {createCrudThunks} from "@/app/_store/shared/crudFactory";

export const wineStylesThunks = createCrudThunks<WineStyle>("wine_styles", {})