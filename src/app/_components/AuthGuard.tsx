"use client";

import {ReactNode, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {getAuthToken} from "@/app/_lib/auth-storage";
import {isOperationalMutationPath} from "@/app/_lib/auth-roles";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useAppSelector} from "@/app/_store/hooks";

const PUBLIC_PATHS = ["/login"];

function operationalListPath(pathname: string): string {
  const match = pathname.match(/^\/(beers|wines|drinks|foods|dishes|makers|orders|users)/);
  return match ? `/${match[1]}` : "/";
}

export default function AuthGuard({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const {canMutateOperationalData} = useAuthCapabilities();

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) return;

    const token = getAuthToken();
    if (!token && authStatus !== "authenticated") {
      router.replace("/login");
      return;
    }

    if (!canMutateOperationalData && isOperationalMutationPath(pathname)) {
      router.replace(operationalListPath(pathname));
    }
  }, [pathname, router, authStatus, canMutateOperationalData]);

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  if (!getAuthToken() && authStatus !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
