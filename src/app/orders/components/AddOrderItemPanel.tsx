"use client";

import {useEffect, useMemo, useState} from "react";
import {Beer} from "@/app/_types/beer";
import {Dish} from "@/app/_types/dish";
import {Drink} from "@/app/_types/drink";
import {ItemOrderSend, OrderItem, OrderItemType} from "@/app/_types/order";
import {Wine} from "@/app/_types/wine";
import {Buttons, Label, Select} from "@/app/_components";
import {Input} from "@/app/_components/Inputs";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {beerThunks} from "@/app/_store/features/beers/beersThunks";
import {drinkThunks} from "@/app/_store/features/drinks/drinksThunks";
import {dishesThunks} from "@/app/_store/features/dishes/dishesThunks";
import {winesThunks} from "@/app/_store/features/wines/winesThunks";

type CatalogProduct = Beer | Drink | Dish | Wine;

const TYPES: OrderItemType[] = ["Beer", "Drink", "Dish", "Wine"];

type Props = {
  orderItems: OrderItem[];
  loading?: boolean;
  onAdd: (payload: ItemOrderSend) => void;
};

function stockOf(product: CatalogProduct): number | null {
  if ("quantity_stock" in product && product.quantity_stock != null) {
    return product.quantity_stock;
  }
  return null;
}

export function AddOrderItemPanel({orderItems, loading = false, onAdd}: Props) {
  const t = useTranslations();
  const {displayPrice} = useMoneyFormat();
  const dispatch = useAppDispatch();
  const {beers, loading: beersLoading} = useAppSelector((state: RootState) => state.beers);
  const {drinks, loading: drinksLoading} = useAppSelector((state: RootState) => state.drinks);
  const {dishes, loading: dishesLoading} = useAppSelector((state: RootState) => state.dishes);
  const {wines, loading: winesLoading} = useAppSelector((state: RootState) => state.wines);

  const [itemType, setItemType] = useState<OrderItemType>("Beer");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    switch (itemType) {
      case "Beer":
        dispatch(beerThunks.fetchAll({}));
        break;
      case "Drink":
        dispatch(drinkThunks.fetchAll({}));
        break;
      case "Dish":
        dispatch(dishesThunks.fetchAll({}));
        break;
      case "Wine":
        dispatch(winesThunks.fetchAll({}));
        break;
    }
  }, [itemType, dispatch]);

  const catalog = useMemo(() => {
    switch (itemType) {
      case "Beer":
        return beers;
      case "Drink":
        return drinks;
      case "Dish":
        return dishes;
      case "Wine":
        return wines;
      default:
        return [];
    }
  }, [itemType, beers, drinks, dishes, wines]);

  const catalogLoading =
    (itemType === "Beer" && beersLoading) ||
    (itemType === "Drink" && drinksLoading) ||
    (itemType === "Dish" && dishesLoading) ||
    (itemType === "Wine" && winesLoading);

  const selected = catalog.find((p) => String(p.id) === productId);
  const selectedStock = selected ? stockOf(selected) : null;
  const existingLine = orderItems.find(
    (line) => line.item_type === itemType && line.item_id === Number(productId)
  );
  const maxQty =
    selectedStock != null
      ? existingLine
        ? selectedStock - (existingLine.quantity ?? 0)
        : selectedStock
      : null;
  const overStock = maxQty != null && quantity > maxQty;
  const outOfStock = maxQty != null && maxQty <= 0;

  const stockLabel = (product: CatalogProduct): string => {
    const stock = stockOf(product);
    if (stock == null) return "";
    return t("orders.addItem.stock", {count: stock});
  };

  const handleAdd = () => {
    if (!productId || overStock || outOfStock) return;
    onAdd({
      item_type: itemType,
      item_id: Number(productId),
      quantity,
    });
    setProductId("");
    setQuantity(1);
  };

  const pillClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-medium transition ${
      active
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-border bg-surface text-foreground hover:bg-surface-muted"
    }`;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface-muted p-4">
      <h4 className="text-sm font-semibold text-foreground">{t("orders.addItem.title")}</h4>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setItemType(type)}
            className={pillClass(itemType === type)}
          >
            {t(`orders.itemType.${type}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Label label={t("orders.addItem.product")}>
            <Select
              name="order_item_product"
              value={productId}
              onChange={setProductId}
              disabled={catalogLoading}
            >
              <option value="">{catalogLoading ? t("orders.addItem.loading") : t("orders.addItem.select")}</option>
              {catalog.map((product) => {
                const stock = stockOf(product);
                const disabled = stock != null && stock <= 0;
                return (
                  <option key={product.id} value={product.id} disabled={disabled}>
                    {product.name} — {displayPrice(product)}
                    {stockLabel(product)}
                    {disabled ? t("orders.addItem.outOfStock") : ""}
                  </option>
                );
              })}
            </Select>
          </Label>
        </div>

        <Label label={t("orders.addItem.quantity")}>
          <Input
            type="number"
            min={1}
            max={maxQty ?? undefined}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </Label>
      </div>

      {existingLine && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          {t("orders.addItem.alreadyOnOrder", {qty: existingLine.quantity ?? 0})}
        </p>
      )}

      {selected && (
        <p className="text-xs text-muted">
          {t("orders.addItem.selected", {
            name: selected.name,
            price: displayPrice(selected),
            stock: stockLabel(selected),
          })}
        </p>
      )}

      {overStock && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {t("orders.addItem.notEnoughStock", {max: Math.max(0, maxQty ?? 0)})}
        </p>
      )}

      <div className="flex justify-end">
        <Buttons
          type="button"
          onClick={handleAdd}
          loading={loading}
          disabled={!productId || overStock || outOfStock}
        >
          {t("orders.addItem.submit")}
        </Buttons>
      </div>
    </div>
  );
}
