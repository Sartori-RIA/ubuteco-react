"use client";

import {ReactNode, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {getAuthToken} from "@/app/_lib/auth-storage";
import {isAuthPublicPath} from "@/app/_lib/auth-routes";
import {
  canAccessOrganizations,
  canManageUsers,
  hasOrganization,
  isAdminOnlyPath,
  isKitchenAllowedPath,
  isKitchenStaff,
  isOperationalMutationPath,
  isOrganizationPath,
  requiresOrganization,
} from "@/app/_lib/auth-roles";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useClientReady} from "@/app/_hooks/useClientReady";
import {useAppSelector} from "@/app/_store/hooks";
import {Loading} from "@/app/_components/Loading";

function operationalListPath(pathname: string): string {
  const match = pathname.match(/^\/(beers|wines|drinks|foods|dishes|makers|orders|users)/);
  return match ? `/${match[1]}` : "/";
}

export default function AuthGuard({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const ready = useClientReady();
  const authStatus = useAppSelector((state) => state.auth.status);
  const {canMutateOperationalData, user} = useAuthCapabilities();

  useEffect(() => {
    if (!ready || isAuthPublicPath(pathname)) return;

    const token = getAuthToken();
    if (!token && authStatus !== "authenticated") {
      router.replace("/login");
      return;
    }

    if (user && requiresOrganization(user) && !hasOrganization(user)) {
      router.replace("/forbidden");
      return;
    }

    if (!canMutateOperationalData && isOperationalMutationPath(pathname)) {
      router.replace(operationalListPath(pathname));
      return;
    }

    if (user && isKitchenStaff(user) && !isKitchenAllowedPath(pathname)) {
      router.replace("/kitchen");
      return;
    }

    if (user && isAdminOnlyPath(pathname) && !canManageUsers(user)) {
      router.replace("/");
      return;
    }

    if (user && isOrganizationPath(pathname) && !canAccessOrganizations(user)) {
      router.replace("/");
    }
  }, [ready, pathname, router, authStatus, canMutateOperationalData, user]);

  if (isAuthPublicPath(pathname)) {
    return <>{children}</>;
  }

  if (!ready) {
    return <Loading/>;
  }

  if (!getAuthToken() && authStatus !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
