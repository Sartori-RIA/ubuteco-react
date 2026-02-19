"use client"

type LabelProps = {
  label: string;
  children: React.ReactNode;
}

export function Label({label, children}: LabelProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
