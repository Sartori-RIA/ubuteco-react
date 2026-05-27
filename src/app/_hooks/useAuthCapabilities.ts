"use client";

import {useAppSelector} from "@/app/_store/hooks";
import {getAuthUser} from "@/app/_lib/auth-storage";
import {canMutateOperationalData, isSuperAdmin} from "@/app/_lib/auth-roles";

export function useAuthCapabilities() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = reduxUser ?? getAuthUser();

  return {
    user,
    isSuperAdmin: isSuperAdmin(user),
    canMutateOperationalData: canMutateOperationalData(user),
  };
}
