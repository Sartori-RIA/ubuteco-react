"use client";

import dynamic from "next/dynamic";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {SuperAdminHome} from "@/app/dashboard/components/SuperAdminHome";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canAccessPlatformRoutes} from "@/app/_lib/auth-roles";

function PlatformHomePage() {
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

  return <SuperAdminHome/>;
}

export default dynamic(() => Promise.resolve(PlatformHomePage), {ssr: false});
