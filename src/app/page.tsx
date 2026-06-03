"use client";

import dynamic from "next/dynamic";
import {Loading} from "@/app/_components";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canAccessDashboard, isSuperAdmin} from "@/app/_lib/auth-roles";
import OrganizationDashboard from "@/app/dashboard/OrganizationDashboard";
import {SuperAdminHome} from "@/app/dashboard/components/SuperAdminHome";

function HomePage() {
  const {user} = useAuthCapabilities();

  if (!user) {
    return <Loading/>;
  }

  if (isSuperAdmin(user)) {
    return <SuperAdminHome/>;
  }

  if (canAccessDashboard(user)) {
    return <OrganizationDashboard/>;
  }

  return <Loading/>;
}

export default dynamic(() => Promise.resolve(HomePage), {ssr: false});
