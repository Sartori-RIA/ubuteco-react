"use client";

import {ConfirmDialog} from "@/app/_components/ConfirmDialog";
import {Organization} from "@/app/_types";
import {useOrganizationOperationalToggle} from "@/app/organizations/_hooks/useOrganizationOperationalToggle";
import {useTranslations} from "@/app/_hooks/useTranslations";

type UpdateFn = (id: number, data: Partial<Organization>) => Promise<Organization>;

type Props = {
  organization?: Organization | null;
  onChanged?: () => void;
  update?: UpdateFn;
  onOrganizationUpdated?: (organization: Organization) => void;
  compact?: boolean;
};

export function OrganizationOperationalToggle({
  organization,
  onChanged,
  update,
  onOrganizationUpdated,
  compact = false,
}: Props) {
  const t = useTranslations();
  const {isKitchenOpen, toggling, handleToggle, confirmDialogProps} =
    useOrganizationOperationalToggle({
      organization,
      onChanged,
      update,
      onOrganizationUpdated,
    });

  return (
    <>
      <ConfirmDialog {...confirmDialogProps} />
      <div className={compact ? "flex flex-wrap items-center gap-2" : "space-y-2"}>
        {!compact ? (
          <p className="text-sm text-muted">{t("organizations.operational.hint")}</p>
        ) : null}
        <button
          type="button"
          disabled={toggling}
          onClick={handleToggle}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors disabled:opacity-60 ${
            isKitchenOpen
              ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-border bg-surface-muted text-foreground hover:bg-border"
          }`}
        >
          {toggling
            ? t("kitchen.updating")
            : isKitchenOpen
              ? t("kitchen.openCloseOpen")
              : t("kitchen.openCloseClosed")}
        </button>
        {!compact ? (
          <p className="text-xs text-muted">
            {isKitchenOpen ? t("organizations.operational.open") : t("organizations.operational.closed")}
          </p>
        ) : null}
      </div>
    </>
  );
}
