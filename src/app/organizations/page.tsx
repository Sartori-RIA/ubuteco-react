"use client";

import {useEffect} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canManageOrganization, isSuperAdmin} from "@/app/_lib/auth-roles";
import {OrganizationProfilePage} from "@/app/organizations/components";

function Page() {
  const router = useRouter();
  const {user} = useAuthCapabilities();
  const isSuper = isSuperAdmin(user);
  const isOrgAdmin = canManageOrganization(user);

  useEffect(() => {
    if (!user) return;
    if (isSuper) {
      router.replace("/platform/organizations");
      return;
    }
    if (!isOrgAdmin) {
      router.replace("/");
    }
  }, [user, isSuper, isOrgAdmin, router]);

  if (!user || isSuper || !isOrgAdmin) {
    return <Loading/>;
  }

  if (!user.organization) {
    return <Loading/>;
  }

  return <OrganizationProfilePage organization={user.organization} showRegionalSettings/>;
}

export default dynamic(() => Promise.resolve(Page), {ssr: false});
