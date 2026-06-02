"use client";

import {useMemo} from "react";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canManageOrganization} from "@/app/_lib/auth-roles";
import {resolveOrganizationSettings} from "@/app/_lib/organization-settings";

export function useOrganizationSettings() {
  const {user} = useAuthCapabilities();

  return useMemo(() => {
    const settings = resolveOrganizationSettings(user?.organization);

    return {
      organization: user?.organization ?? null,
      ...settings,
      canManage: canManageOrganization(user),
    };
  }, [user]);
}
