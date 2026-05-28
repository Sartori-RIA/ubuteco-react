import {DishIngredientAttribute} from "@/app/_types/dish";

export function buildDishFormData(
  fields: {name: string; price: number},
  ingredients: DishIngredientAttribute[],
  imageFile?: File | null
): FormData {
  const formData = new FormData();
  formData.append("name", fields.name.trim());
  formData.append("price", String(fields.price));

  let index = 0;
  for (const ingredient of ingredients) {
    if (ingredient._destroy) {
      if (!ingredient.id) continue;
      formData.append(`dish_ingredients_attributes[${index}][id]`, String(ingredient.id));
      formData.append(`dish_ingredients_attributes[${index}][_destroy]`, "1");
    } else {
      formData.append(`dish_ingredients_attributes[${index}][food_id]`, String(ingredient.food_id));
      formData.append(`dish_ingredients_attributes[${index}][quantity]`, String(ingredient.quantity));
      if (ingredient.id) {
        formData.append(`dish_ingredients_attributes[${index}][id]`, String(ingredient.id));
      }
    }
    index += 1;
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
}
