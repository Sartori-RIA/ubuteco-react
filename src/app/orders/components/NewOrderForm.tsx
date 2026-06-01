"use client";

import {FormEvent, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {Buttons, Card, FormErrors, Label, Loading} from "@/app/_components";
import {Select} from "@/app/_components/Selects";
import {Input} from "@/app/_components/Inputs";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {ordersThunks} from "@/app/_store/features/orders/ordersThunks";
import {tablesThunks} from "@/app/_store/features/tables/tablesThunks";

export function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableFromQuery = searchParams.get("table_id") ?? "";
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const {defaultCurrency} = useOrganizationSettings();
  const {saving, errors} = useAppSelector((state: RootState) => state.orders);
  const {tables, loading: tablesLoading} = useAppSelector((state: RootState) => state.tables);

  const [tableId, setTableId] = useState(() => tableFromQuery);
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    dispatch(tablesThunks.fetchAll({}));
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await dispatch(
      ordersThunks.createOrder({
        table_id: tableId ? Number(tableId) : undefined,
        discount: discount ? Number(discount) : undefined,
      })
    );

    if (ordersThunks.createOrder.fulfilled.match(result)) {
      showToast("Order created", "success");
      router.replace(`/orders/${result.payload.id}`);
    }
  };

  if (tablesLoading && tables.length === 0) {
    return <Loading/>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to orders
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">New order</h1>
        <p className="text-sm text-gray-500 mt-1">Create an open order, then add items on the next screen.</p>
      </div>

      <Card title="Order details" className="hover:translate-y-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormErrors errors={errors}/>

          <Label label="Table (optional)">
            <Select name="table_id" value={tableId} onChange={setTableId}>
              <option value="">No table</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name} ({table.chairs} seats)
                </option>
              ))}
            </Select>
          </Label>

          <Label label={`Discount (${defaultCurrency}, optional)`}>
            <Input
              type="number"
              step="0.01"
              min={0}
              placeholder="0.00"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Label>

          <Buttons type="submit" className="w-full rounded-xl" loading={saving}>
            Create order
          </Buttons>
        </form>
      </Card>
    </div>
  );
}
