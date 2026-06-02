import {OrderCatalogProduct} from "@/app/orders/_lib/search-order-catalog";

export function mergeCatalogResults(
  apiResults: OrderCatalogProduct[],
  supplement: OrderCatalogProduct[],
  query: string
): OrderCatalogProduct[] {
  const normalized = query.trim().toLowerCase();
  const byId = new Map(apiResults.map((product) => [product.id, product]));

  for (const product of supplement) {
    if (byId.has(product.id)) continue;
    if (normalized && !product.name.toLowerCase().includes(normalized)) continue;
    byId.set(product.id, product);
  }

  return Array.from(byId.values());
}
