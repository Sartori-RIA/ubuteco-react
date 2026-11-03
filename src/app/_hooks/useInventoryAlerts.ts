"use client";

import {useEffect, useState} from "react";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {fetchExpiring, fetchLowStock, inventoryAlertTotal} from "@/app/_services/inventory";

type Counts = {
  lowStock: number;
  expiring: number;
};

export function useInventoryAlerts(): Counts & {total: number} {
  const {canAccessInventory} = useAuthCapabilities();
  const [counts, setCounts] = useState<Counts>({lowStock: 0, expiring: 0});

  useEffect(() => {
    if (!canAccessInventory) return;

    let cancelled = false;

    Promise.all([fetchLowStock(), fetchExpiring()])
      .then(([lowStock, expiring]) => {
        if (cancelled) return;
        setCounts({lowStock: lowStock.items.length, expiring: expiring.items.length});
      })
      .catch(() => {
        if (!cancelled) setCounts({lowStock: 0, expiring: 0});
      });

    return () => {
      cancelled = true;
    };
  }, [canAccessInventory]);

  return {...counts, total: inventoryAlertTotal(counts.lowStock, counts.expiring)};
}
