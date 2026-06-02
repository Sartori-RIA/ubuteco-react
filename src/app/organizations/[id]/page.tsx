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

  useEffect(() => {
    if (!user || Number.isNaN(id)) return;

    if (isSuperAdmin(user)) {
      setLoading(true);
      void platformOrganizationsService
        .show(id)
        .then(setOrganization)
        .finally(() => setLoading(false));
      return;
    }

    if (canManageOrganization(user) && user.organization?.id === id) {
      setOrganization(user.organization);
      setLoading(false);
      return;
    }

    router.replace("/organizations");
  }, [id, router, user]);

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
