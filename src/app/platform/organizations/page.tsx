"use client";

import dynamic from "next/dynamic";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {SuperAdminOrganizationsList} from "@/app/organizations/components/SuperAdminOrganizationsList";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canAccessPlatformRoutes} from "@/app/_lib/auth-roles";

function PlatformOrganizationsPage() {
  const router = useRouter();
  const {user} = useAuthCapabilities();

  useEffect(() => {
    if (!user) return;
    if (!canAccessPlatformRoutes(user)) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || !canAccessPlatformRoutes(user)) {
    return <Loading/>;
  }

  return <SuperAdminOrganizationsList/>;
}

export default dynamic(() => Promise.resolve(PlatformOrganizationsPage), {ssr: false});
