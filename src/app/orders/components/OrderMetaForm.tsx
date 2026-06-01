"use client";

import {useEffect, useRef, useState} from "react";
import {Order} from "@/app/_types";
import {Table} from "@/app/_types/table";
import {Label} from "@/app/_components";
import {Select} from "@/app/_components/Selects";
import {Input} from "@/app/_components/Inputs";
import {useDebounce} from "@/app/_hooks/useDebounce";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {parseMoneyValue} from "@/app/_lib/money";

function initialDiscount(order: Order): string {
  if (order.discount_cents != null) return String(order.discount_cents / 100);
  const parsed = parseMoneyValue(order.discount);
  if (parsed) return String(parsed.amount);
  return "";
}

type Props = {
  order: Order;
  tables: Table[];
  readOnly?: boolean;
  onSave: (data: {table_id: number | null; discount: number}) => void;
};

export function OrderMetaForm({order, tables, readOnly = false, onSave}: Props) {
  const {defaultCurrency} = useOrganizationSettings();
  const [tableId, setTableId] = useState(order.table_id ? String(order.table_id) : "");
  const [discount, setDiscount] = useState(() => initialDiscount(order));
  const debouncedTableId = useDebounce(tableId, 500);
  const debouncedDiscount = useDebounce(discount, 500);
  const skipNextSave = useRef(true);

  useEffect(() => {
    if (readOnly) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    onSave({
      table_id: debouncedTableId ? Number(debouncedTableId) : null,
      discount: debouncedDiscount ? Number(debouncedDiscount) : 0,
    });
  }, [debouncedTableId, debouncedDiscount, readOnly, onSave]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Label label="Table">
        <Select
          name="table_id"
          value={tableId}
          onChange={setTableId}
          disabled={readOnly}
        >
          <option value="">No table</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.name} ({table.chairs} seats)
            </option>
          ))}
        </Select>
      </Label>

      <Label label={`Discount (${defaultCurrency})`}>
        <Input
          type="number"
          step="0.01"
          min={0}
          value={discount}
          disabled={readOnly}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="0.00"
        />
      </Label>

      {!readOnly && (
        <p className="md:col-span-2 text-xs text-gray-500">Changes save automatically.</p>
      )}
    </div>
  );
}
