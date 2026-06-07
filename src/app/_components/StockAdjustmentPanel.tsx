"use client";

import React, {useState} from "react";
import {Card, FormErrors, Input, Label} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {adjustStock, StockableProductType} from "@/app/_services/inventory";
import {ApiError} from "@/app/_services/api-fetch";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canAdjustStock} from "@/app/_lib/auth-roles";

type Props = {
  productType: StockableProductType;
  productId: number;
  quantityStock: number;
  onStockChanged: (quantity: number) => void;
};

export function StockAdjustmentPanel({productType, productId, quantityStock, onStockChanged}: Props) {
  const t = useTranslations();
  const {user} = useAuthCapabilities();
  const [adjustment, setAdjustment] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  if (!canAdjustStock(user)) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors([]);

    const delta = Number(adjustment);
    if (!Number.isFinite(delta) || delta === 0) {
      setErrors([t("api.errors.adjustmentZero")]);
      return;
    }

    setLoading(true);
    try {
      const updated = await adjustStock<{ quantity_stock: number }>(
        productType,
        productId,
        delta,
        reason
      );
      onStockChanged(updated.quantity_stock);
      setAdjustment("");
      setReason("");
    } catch (error) {
      if (error instanceof ApiError) {
        const messages = resolveApiErrorMessages({errors: error.items}, t);
        setErrors(messages.length > 0 ? messages : [t("inventory.adjustFailed")]);
      } else {
        setErrors([t("inventory.adjustFailed")]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title={t("inventory.adjustTitle")} className="mt-6">
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {t("inventory.currentStock", {count: quantityStock})}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormErrors errors={errors}/>
        <Label label={t("inventory.adjustment")}>
          <Input
            type="number"
            name="adjustment"
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
            placeholder={t("inventory.adjustmentHint")}
          />
        </Label>
        <Label label={`${t("inventory.reason")} (${t("common.optional")})`}>
          <Input
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("inventory.reasonPlaceholder")}
          />
        </Label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t("common.loading") : t("inventory.apply")}
        </button>
      </form>
    </Card>
  );
}
