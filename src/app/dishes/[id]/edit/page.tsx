"use client"

import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";
import {foodsThunks} from "@/app/_store/features/foods/foodsThunks";
import {DishForm} from "@/app/dishes/components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const dish = useSelector((state: RootState) => state.dishes.dishes.find((item) => item.id === Number(id)));
  const {foodOptions} = useSelector((state: RootState) => state.foods);
  const {loading, errors} = useSelector((state: RootState) => state.dishes);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    dispatch(foodsThunks.fetchOptions())
    if (id) {
      dispatch(dishesThunks.fetchById(Number(id)))
    }
  }, [dispatch, id])

  async function handleEdit(formData: FormData) {
    try {
      const updatedDish = await dispatch(dishesThunks.update({id: Number(id), data: formData})).unwrap()
      router.push(`/dishes/${updatedDish.id}`);
    } catch (error) {
    }
  }

  if (loading && !dish) return <Loading/>;
  if (dish === undefined) return <h1>Not Found</h1>

  return (
    <DishForm
      key={dish.id}
      defaultValues={dish}
      foods={foodOptions}
      onSubmit={handleEdit}
      submitLabel={t("forms.updateDishSubmit")}
      errors={errors}
      loading={loading}
    />
  );
}
