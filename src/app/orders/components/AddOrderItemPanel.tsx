"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {ItemOrderSend, OrderItem, OrderItemType} from "@/app/_types/order";
import {Buttons, Label, SearchableSelect} from "@/app/_components";
import {Input} from "@/app/_components/Inputs";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppSelector} from "@/app/_store/hooks";
import {findMatchingOrderLine} from "@/app/orders/_lib/order-items";
import {mergeCatalogResults} from "@/app/orders/_lib/merge-catalog-results";
import {
  OrderCatalogProduct,
  searchOrderCatalog,
} from "@/app/orders/_lib/search-order-catalog";

const TYPES: OrderItemType[] = ["Beer", "Drink", "Dish", "Wine"];

type Props = {
  orderItems: OrderItem[];
  loading?: boolean;
  onAdd: (payload: ItemOrderSend) => void;
};

function stockOf(product: OrderCatalogProduct): number | null {
  if ("quantity_stock" in product && product.quantity_stock != null) {
    return product.quantity_stock;
  }
  return null;
}

export function AddOrderItemPanel({orderItems, loading = false, onAdd}: Props) {
  const t = useTranslations();
  const {displayPrice} = useMoneyFormat();
  const storeBeers = useAppSelector((state) => state.beers.beers);
  const storeDrinks = useAppSelector((state) => state.drinks.drinks);
  const storeDishes = useAppSelector((state) => state.dishes.dishes);
  const storeWines = useAppSelector((state) => state.wines.wines);

  const [itemType, setItemType] = useState<OrderItemType>("Beer");
  const [productId, setProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<OrderCatalogProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [catalog, setCatalog] = useState<OrderCatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const storeCatalog = useMemo(() => {
    switch (itemType) {
      case "Beer":
        return storeBeers;
      case "Drink":
        return storeDrinks;
      case "Dish":
        return storeDishes;
      case "Wine":
        return storeWines;
    }
  }, [itemType, storeBeers, storeDrinks, storeDishes, storeWines]);

  const loadCatalog = useCallback(
    async (type: OrderItemType, query: string, supplement: OrderCatalogProduct[]) => {
      setCatalogLoading(true);
      try {
        const data = await searchOrderCatalog(type, query);
        setCatalog(mergeCatalogResults(data, supplement, query));
      } catch {
        setCatalog(mergeCatalogResults([], supplement, query));
      } finally {
        setCatalogLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setProductId("");
    setSelectedProduct(null);
    setQuantity(1);
    setProductSearch("");
  }, [itemType]);

  useEffect(() => {
    const delay = productSearch.trim() ? 300 : 0;
    const handle = window.setTimeout(() => {
      void loadCatalog(itemType, productSearch, storeCatalog);
    }, delay);
    return () => window.clearTimeout(handle);
  }, [itemType, productSearch, storeCatalog, loadCatalog]);

  const selected = selectedProduct ?? catalog.find((p) => String(p.id) === productId) ?? null;
  const selectedStock = selected ? stockOf(selected) : null;
  const existingLine = productId
    ? findMatchingOrderLine(orderItems, {item_type: itemType, item_id: Number(productId)})
    : undefined;
  const maxQty =
    selectedStock != null
      ? existingLine
        ? selectedStock - (existingLine.quantity ?? 0)
        : selectedStock
      : null;
  const overStock = maxQty != null && quantity > maxQty;
  const outOfStock = maxQty != null && maxQty <= 0;

  const stockLabel = (product: OrderCatalogProduct): string => {
    const stock = stockOf(product);
    if (stock == null) return "";
    return t("orders.addItem.stock", {count: stock});
  };

  const formatProductLabel = (product: OrderCatalogProduct): string => {
    const stock = stockOf(product);
    const outOfStockSuffix = stock != null && stock <= 0 ? t("orders.addItem.outOfStock") : "";
    return `${product.name} — ${displayPrice(product)}${stockLabel(product)}${outOfStockSuffix}`;
  };

  const handleProductChange = (id: string) => {
    setProductId(id);
    const product =
      catalog.find((item) => String(item.id) === id) ??
      storeCatalog.find((item) => String(item.id) === id) ??
      null;
    setSelectedProduct(product);
  };

  const handleAdd = () => {
    if (!productId || overStock || outOfStock) return;
    onAdd({
      item_type: itemType,
      item_id: Number(productId),
      quantity,
    });
    setProductId("");
    setSelectedProduct(null);
    setQuantity(1);
    setProductSearch("");
    void loadCatalog(itemType, "", storeCatalog);
  };

  const catalogForOptions = useMemo(() => {
    if (!selected) return catalog;
    if (catalog.some((product) => product.id === selected.id)) return catalog;
    return [selected, ...catalog];
  }, [catalog, selected]);

  const productOptions = useMemo(
    () =>
      catalogForOptions.map((product) => {
        const stock = stockOf(product);
        const isOutOfStock = stock != null && stock <= 0;
        return {
          value: String(product.id),
          disabled: isOutOfStock,
          label: formatProductLabel(product),
          searchText: product.name,
        };
      }),
    [catalogForOptions, displayPrice, t]
  );

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
            <SearchableSelect
              key={itemType}
              name="order_item_product"
              value={productId}
              onChange={handleProductChange}
              onQueryChange={setProductSearch}
              filterLocally={false}
              loading={catalogLoading}
              loadingMessage={t("orders.addItem.loading")}
              selectedLabel={selected ? formatProductLabel(selected) : undefined}
              disabled={false}
              placeholder={t("orders.addItem.select")}
              searchPlaceholder={t("orders.addItem.searchPlaceholder")}
              emptyMessage={t("orders.addItem.noResults")}
              options={productOptions}
            />
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

      {outOfStock && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {t("orders.addItem.notEnoughStock", {max: 0})}
        </p>
      )}

      {overStock && !outOfStock && (
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
