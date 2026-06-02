"use client";

import {useCallback, useState} from "react";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import {useConfirm} from "@/app/_hooks/useConfirm";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {
  isOrganizationKitchenOpen,
  nextOperationalStatus,
} from "@/app/_lib/organization-operational";
import {setAuthUser} from "@/app/_lib/auth-storage";
import {organizationsService} from "@/app/_services/organizations.service";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {updateAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {Organization, User} from "@/app/_types";

type UpdateFn = (id: number, data: Partial<Organization>) => Promise<Organization>;

type Options = {
  organization?: Organization | null;
  onChanged?: () => void;
  update?: UpdateFn;
  onOrganizationUpdated?: (organization: Organization) => void;
};

export function useOrganizationOperationalToggle(options: Options = {}) {
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const {confirm, confirmDialogProps} = useConfirm();
  const t = useTranslations();
  const user = useAppSelector((state) => state.auth.user);
  const organization = options.organization ?? user?.organization ?? null;
  const isKitchenOpen = isOrganizationKitchenOpen(organization);
  const [toggling, setToggling] = useState(false);

  const syncAuthOrganization = useCallback(
    (updated: Organization) => {
      if (!user?.organization?.id || user.organization.id !== updated.id) return;

      const nextUser: User = {
        ...user,
        organization: {...user.organization, ...updated},
      };
      dispatch(updateAuthenticatedUser(nextUser));
      setAuthUser(nextUser);
    },
    [dispatch, user]
  );

  const handleToggle = useCallback(async () => {
    if (!organization?.id) return;

    const closing = isKitchenOpen;
    if (closing) {
      const ok = await confirm({
        title: t("kitchen.closeKitchen"),
        message: t("kitchen.closeKitchenMessage"),
        confirmLabel: t("kitchen.closeKitchenConfirm"),
        variant: "danger",
      });
      if (!ok) return;
    }

    setToggling(true);
    try {
      const operational_status = nextOperationalStatus(organization.operational_status);
      const update = options.update ?? organizationsService.update;
      const updated = await update(organization.id, {operational_status});
      syncAuthOrganization(updated);
      options.onOrganizationUpdated?.(updated);
      options.onChanged?.();
      showToast(
        operational_status === "open" ? t("kitchen.toastOpened") : t("kitchen.toastClosed"),
        "success"
      );
    } catch {
      showToast(t("kitchen.toastOperationalFailed"), "error");
    } finally {
      setToggling(false);
    }
  }, [
    confirm,
    isKitchenOpen,
    options,
    organization,
    showToast,
    syncAuthOrganization,
    t,
  ]);

  return {
    isKitchenOpen,
    toggling,
    handleToggle,
    confirmDialogProps: {...confirmDialogProps, loading: toggling},
  };
}
