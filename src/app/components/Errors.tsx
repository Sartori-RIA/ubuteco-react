import React from "react";
import {ApiErrorMessages} from "@/app/services/api-fetch";

export function FormErrors({errors}: { errors: ApiErrorMessages | undefined }) {
  if (errors == undefined) {
    return
  }
  if (typeof errors !== "object") {
    return
  }

  if (Object.keys(errors).length === 0) {
    return
  }

  console.log(errors)
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <ul className="list-disc list-inside space-y-1">
        {Object.entries(errors).flatMap(([field, messages]) =>
          (Array.isArray(messages) ? messages : [messages]).map((msg, i) => (
            <li key={`${field}-${i}`}>{field}: {msg}</li>
          ))
        )}
      </ul>
    </div>
  )
}