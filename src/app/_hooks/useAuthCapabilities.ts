"use client";

import {useAppSelector} from "@/app/_store/hooks";
import {getAuthUser} from "@/app/_lib/auth-storage";
import {canMutateOperationalData, isSuperAdmin} from "@/app/_lib/auth-roles";
import {useClientReady} from "@/app/_hooks/useClientReady";

export function useAuthCapabilities() {
  const ready = useClientReady();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = reduxUser ?? (ready ? getAuthUser() : null);

  return {
    user,
    isSuperAdmin: isSuperAdmin(user),
    canMutateOperationalData: canMutateOperationalData(user),
  };
}
