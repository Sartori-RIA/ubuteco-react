"use client";

import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {useParams, useRouter} from "next/navigation";
import {Loading} from "@/app/_components";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canManageOrganization, isSuperAdmin} from "@/app/_lib/auth-roles";
import {platformOrganizationsService} from "@/app/_services/platform-organizations.service";
import {OrganizationProfilePage} from "@/app/organizations/components";

function Page() {
  const params = useParams();
  const router = useRouter();
  const {user} = useAuthCapabilities();
  const id = Number(params.id);

  const [organization, setOrganization] = useState<Awaited<
    ReturnType<typeof platformOrganizationsService.show>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnOrgAdmin =
    user != null &&
    !Number.isNaN(id) &&
    canManageOrganization(user) &&
    user.organization?.id === id;

  useEffect(() => {
    if (!user || Number.isNaN(id) || isOwnOrgAdmin) return;

    if (!isSuperAdmin(user)) {
      router.replace("/organizations");
      return;
    }

    let cancelled = false;
    void platformOrganizationsService
      .show(id)
      .then((org) => {
        if (!cancelled) setOrganization(org);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isOwnOrgAdmin, router, user]);

  if (!user || Number.isNaN(id)) {
    return <Loading/>;
  }

  if (isOwnOrgAdmin && user.organization) {
    return (
      <OrganizationProfilePage
        organization={user.organization}
        onOrganizationUpdated={setOrganization}
        updateForm={platformOrganizationsService.updateForm}
        updateOperational={platformOrganizationsService.update}
        showRegionalSettings={!isSuperAdmin(user)}
      />
    );
  }

  if (loading || !organization) {
    return <Loading/>;
  }

  return (
    <OrganizationProfilePage
      organization={organization}
      onOrganizationUpdated={setOrganization}
      updateForm={platformOrganizationsService.updateForm}
      updateOperational={platformOrganizationsService.update}
      showRegionalSettings={!isSuperAdmin(user)}
    />
  );
}

export default dynamic(() => Promise.resolve(Page), {ssr: false});
