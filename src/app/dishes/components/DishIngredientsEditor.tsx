"use client";

import {DishIngredientAttribute} from "@/app/_types";
import {FoodOption} from "@/app/_store/features/foods/foodsThunks";
import {Buttons, Label, Select} from "@/app/_components";
import {Input} from "@/app/_components/Inputs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

type Props = {
  foods: FoodOption[];
  ingredients: DishIngredientAttribute[];
  onChange: (ingredients: DishIngredientAttribute[]) => void;
  readOnly?: boolean;
};

function emptyRow(): DishIngredientAttribute {
  return {food_id: 0, quantity: 1};
}

export function DishIngredientsEditor({foods, ingredients, onChange, readOnly = false}: Props) {
  const visibleIngredients = ingredients.filter((item) => !item._destroy);

  const updateRow = (index: number, patch: Partial<DishIngredientAttribute>) => {
    const next = [...ingredients];
    const target = visibleIngredients[index];
    const realIndex = ingredients.indexOf(target);
    if (realIndex === -1) return;
    next[realIndex] = {...next[realIndex], ...patch};
    onChange(next);
  };

  const addRow = () => {
    const firstFoodId = foods[0]?.id ?? 0;
    onChange([...ingredients, {...emptyRow(), food_id: Number(firstFoodId)}]);
  };

  const removeRow = (index: number) => {
    const target = visibleIngredients[index];
    const realIndex = ingredients.indexOf(target);
    if (realIndex === -1) return;

    const next = [...ingredients];
    if (next[realIndex].id) {
      next[realIndex] = {...next[realIndex], _destroy: true};
    } else {
      next.splice(realIndex, 1);
    }
    onChange(next);
  };

  if (foods.length === 0) {
    return (
      <p className="text-sm text-amber-700 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        Create foods before adding ingredients to a dish.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {visibleIngredients.length === 0 && (
        <p className="text-sm text-gray-500">No ingredients yet.</p>
      )}

      {visibleIngredients.map((row, index) => (
        <div key={row.id ?? `new-${index}`} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px_auto] items-end">
          <Label label="Food">
            <Select
              name={`ingredient-food-${index}`}
              value={row.food_id || ""}
              className={readOnly ? "opacity-60 pointer-events-none" : undefined}
              onChange={(value) => updateRow(index, {food_id: Number(value)})}
            >
              <option value="" disabled>Select food</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
            </Select>
          </Label>

          <Label label="Quantity">
            <Input
              type="number"
              min={1}
              value={row.quantity}
              disabled={readOnly}
              onChange={(e) => updateRow(index, {quantity: Number(e.target.value)})}
            />
          </Label>

          {!readOnly && (
            <Buttons
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(index)}
              aria-label="Remove ingredient"
            >
              <FontAwesomeIcon icon={faTrash} className="text-red-500"/>
            </Buttons>
          )}
        </div>
      ))}

      {!readOnly && (
        <Buttons type="button" variant="outline" onClick={addRow} leftIcon={<FontAwesomeIcon icon={faPlus}/>}>
          Add ingredient
        </Buttons>
      )}
    </div>
  );
}
