"use client";

import {useCallback, useState} from "react";
import {Card} from "@/app/_components";
import {Organization} from "@/app/_types";
import {setAuthUser} from "@/app/_lib/auth-storage";
import {organizationsService} from "@/app/_services/organizations.service";
import {ApiError} from "@/app/_services/api-fetch";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {updateAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {LocaleSettings} from "@/app/settings/components/LocaleSettings";
import {
  OrganizationForm,
  OrganizationOperationalToggle,
} from "@/app/organizations/components";

type Props = {
  organization: Organization;
  onOrganizationUpdated?: (organization: Organization) => void;
  updateForm?: (id: number, data: FormData) => Promise<Organization>;
  updateOperational?: (id: number, data: Partial<Organization>) => Promise<Organization>;
  showRegionalSettings?: boolean;
};

export function OrganizationProfilePage({
  organization,
  onOrganizationUpdated,
  updateForm = organizationsService.updateForm,
  updateOperational = organizationsService.update,
  showRegionalSettings = true,
}: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const t = useTranslations();
  const [current, setCurrent] = useState(organization);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[] | undefined>();

  const syncAuthOrganization = useCallback(
    (updated: Organization) => {
      if (!user?.organization?.id || user.organization.id !== updated.id) return;
      const nextUser = {
        ...user,
        organization: {...user.organization, ...updated},
      };
      dispatch(updateAuthenticatedUser(nextUser));
      setAuthUser(nextUser);
    },
    [dispatch, user]
  );

  const handleSubmit = async (formData: FormData) => {
    if (!current.id) return;

    setSaving(true);
    setErrors(undefined);
    try {
      const updated = await updateForm(current.id, formData);
      setCurrent(updated);
      syncAuthOrganization(updated);
      onOrganizationUpdated?.(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.data);
      } else {
        setErrors([t("organizations.form.saveFailed")]);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleOperationalUpdated = (updated: Organization) => {
    setCurrent(updated);
    onOrganizationUpdated?.(updated);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("organizations.profile.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("organizations.profile.subtitle")}</p>
      </div>

      <OrganizationForm
        defaultValues={current}
        errors={errors}
        loading={saving}
        submitLabel={t("organizations.form.save")}
        onSubmit={handleSubmit}
      />

      <Card title={t("organizations.operational.title")} className="hover:translate-y-0">
        <OrganizationOperationalToggle
          organization={current}
          update={updateOperational}
          onOrganizationUpdated={handleOperationalUpdated}
        />
      </Card>

      {showRegionalSettings ? (
        <Card title={t("settings.regional")} className="hover:translate-y-0">
          <p className="mb-4 text-sm text-muted">{t("settings.regionalHint")}</p>
          <LocaleSettings/>
        </Card>
      ) : null}
    </div>
  );
}
