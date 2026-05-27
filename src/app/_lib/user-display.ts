import {User} from "@/app/_types";

export function userInitials(user: User | null | undefined): string {
  const source = user?.name?.trim() || user?.email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function formatMemberSince(value?: Date | string): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {day: "2-digit", month: "long", year: "numeric"});
}
