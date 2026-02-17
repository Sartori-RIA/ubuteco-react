import React from "react";

export function FormErrors({errors}: { errors: string[] | undefined }) {
  if (errors == undefined) {
    return
  }

  if (Object.keys(errors).length === 0) {
    return
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (<li key={index}>{error}</li>))}
      </ul>
    </div>
  )
}