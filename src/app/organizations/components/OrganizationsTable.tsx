"use client";

import Link from "next/link";
import {Organization} from "@/app/_types";
import {Buttons} from "@/app/_components";
import {useMoneyFormat} from "@/app/_hooks/useMoneyFormat";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  organizations: Organization[];
};

function statusLabel(
  organization: Organization,
  t: ReturnType<typeof useTranslations>
): string {
  return organization.operational_status === "open"
    ? t("organizations.list.statusOpen")
    : t("organizations.list.statusClosed");
}

export function OrganizationsTable({organizations}: Props) {
  const t = useTranslations();
  const {formatDate} = useMoneyFormat();

  if (organizations.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        {t("organizations.list.empty")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("organizations.list.name")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("organizations.list.phone")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("organizations.list.status")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted">{t("organizations.list.createdAt")}</th>
            <th className="w-24 px-4 py-3"/>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {organizations.map((organization) => (
            <tr key={organization.id}>
              <td className="px-4 py-3 font-medium text-foreground">{organization.name ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{organization.phone ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{statusLabel(organization, t)}</td>
              <td className="px-4 py-3 text-muted">
                {organization.created_at ? formatDate(organization.created_at) : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                {organization.id ? (
                  <Link href={`/organizations/${organization.id}`}>
                    <Buttons type="button" variant="outline" size="sm">
                      {t("organizations.list.view")}
                    </Buttons>
                  </Link>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
