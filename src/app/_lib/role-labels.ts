import {User} from "@/app/_types";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  KITCHEN: "Kitchen",
  WAITER: "Waiter",
  CASH_REGISTER: "Cash register",
  CUSTOMER: "Customer",
};

export function formatRoleLabel(user: User | null | undefined): string {
  const name = user?.role?.name;
  if (!name) return "—";
  return ROLE_LABELS[name] ?? name;
}
