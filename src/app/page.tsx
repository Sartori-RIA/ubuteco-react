"use client";

import {Loading} from "@/app/_components";
import {LandingPage} from "@/app/_components/marketing/LandingPage";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useClientReady} from "@/app/_hooks/useClientReady";
import {canAccessDashboard, isSuperAdmin} from "@/app/_lib/auth-roles";
import {getAuthToken} from "@/app/_lib/auth-storage";
import OrganizationDashboard from "@/app/dashboard/OrganizationDashboard";
import {SuperAdminHome} from "@/app/dashboard/components/SuperAdminHome";
import {useAppSelector} from "@/app/_store/hooks";

export default function HomePage() {
  const ready = useClientReady();
  const authStatus = useAppSelector((state) => state.auth.status);
  const {user} = useAuthCapabilities();
  const isAuthenticated =
    ready && (Boolean(getAuthToken()) || authStatus === "authenticated");

  if (!ready) {
    return <Loading/>;
  }

  if (!isAuthenticated) {
    return <LandingPage/>;
  }

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
