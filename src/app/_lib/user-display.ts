import {User} from "@/app/_types";
import {formatDateLong} from "@/app/_lib/format-date";

export function userInitials(user: User | null | undefined): string {
  const source = user?.name?.trim() || user?.email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function formatMemberSince(value?: Date | string): string {
  return formatDateLong(value);
}
