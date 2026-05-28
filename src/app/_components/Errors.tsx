import React from "react";
import {normalizeErrors} from "@/app/_lib/normalize-errors";

export function FormErrors({errors}: { errors: unknown }) {
  const messages = normalizeErrors(errors);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <ul className="list-disc list-inside space-y-1">
        {messages.map((error, index) => (<li key={index}>{error}</li>))}
      </ul>
    </div>
  )
}