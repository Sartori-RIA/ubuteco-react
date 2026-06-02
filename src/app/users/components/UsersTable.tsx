"use client";

import Link from "next/link";
import {User} from "@/app/_types";
import {Buttons} from "@/app/_components";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";
import type {TranslationKey} from "@/app/_lib/i18n";

type Props = {
  users: User[];
};

function roleLabelKey(roleName: string): TranslationKey {
  return `users.roles.${roleName}` as TranslationKey;
}

export function UsersTable({users}: Props) {
  const t = useTranslations();
  const {formatDate} = useMoneyFormat();

  if (users.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        {t("users.list.empty")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("users.list.name")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("users.list.email")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("users.list.role")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("users.list.createdAt")}</th>
            <th className="w-24 px-4 py-3"/>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 font-medium text-foreground">{user.name ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{user.email ?? "—"}</td>
              <td className="px-4 py-3 text-muted">
                {user.role?.name ? t(roleLabelKey(user.role.name)) : "—"}
              </td>
              <td className="px-4 py-3 text-muted">
                {user.created_at ? formatDate(user.created_at) : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/users/${user.id}/edit`}>
                  <Buttons type="button" variant="outline" size="sm">
                    {t("users.list.edit")}
                  </Buttons>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
