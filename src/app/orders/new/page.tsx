"use client";

import {Suspense} from "react";
import {Loading} from "@/app/_components";
import {NewOrderForm} from "@/app/orders/components/NewOrderForm";

export default function NewOrderPage() {
  return (
    <Suspense fallback={<Loading/>}>
      <NewOrderForm/>
    </Suspense>
  );
}
