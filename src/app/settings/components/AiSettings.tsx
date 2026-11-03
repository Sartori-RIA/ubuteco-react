"use client";

import {useState} from "react";
import Link from "next/link";
import {ConfirmDialog, FormErrors} from "@/app/_components";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {isAdmin} from "@/app/_lib/auth-roles";
import {setAuthUser} from "@/app/_lib/auth-storage";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import {organizationsService} from "@/app/_services/organizations.service";
import {ApiError} from "@/app/_services/api-fetch";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {updateAuthenticatedUser} from "@/app/_store/features/auth/authSlice";

export function AiSettings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {organization} = useOrganizationSettings();
  const t = useTranslations();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[] | undefined>();
  const [confirmOn, setConfirmOn] = useState(false);

  if (!isAdmin(user) || !organization?.id) return null;

  const enabled = organization.ai_enabled === true;
  const organizationId = organization.id;

  const save = async (next: boolean) => {
    setSaving(true);
    setErrors(undefined);

    try {
      const updated = await organizationsService.update(organizationId, {ai_enabled: next});
      if (!user) return;

      const nextUser = {
        ...user,
        organization: {...organization, ...updated, ai_enabled: updated.ai_enabled ?? next},
      };
      dispatch(updateAuthenticatedUser(nextUser));
      setAuthUser(nextUser);
    } catch (error) {
      if (error instanceof ApiError) {
        const messages = resolveApiErrorMessages({errors: error.items}, t);
        setErrors(messages.length > 0 ? messages : [t("settings.ai.saveFailed")]);
      } else {
        setErrors([t("settings.ai.saveFailed")]);
      }
    } finally {
      setSaving(false);
      setConfirmOn(false);
    }
  };

  const handleToggle = () => {
    if (enabled) {
      void save(false);
      return;
    }
    setConfirmOn(true);
  };

  return (
    <>
      <p className="text-sm text-muted">{t("settings.ai.hint")}</p>
      <p className="mt-3 text-sm text-muted">{t("settings.ai.body")}</p>
      <Link href="/privacy" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
        {t("settings.ai.privacyLink")}
      </Link>

      {errors && <div className="mt-4"><FormErrors errors={errors}/></div>}

      <label className="mt-4 flex items-center gap-3 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          role="switch"
          className="h-5 w-5"
          checked={enabled}
          disabled={saving}
          aria-label={t("settings.ai.title")}
          onChange={handleToggle}
        />
        {enabled ? t("settings.ai.on") : t("settings.ai.off")}
      </label>

      <ConfirmDialog
        open={confirmOn}
        title={t("settings.ai.confirmTitle")}
        message={t("settings.ai.confirmMessage")}
        confirmLabel={t("settings.ai.confirm")}
        cancelLabel={t("common.cancel")}
        loading={saving}
        onConfirm={() => void save(true)}
        onCancel={() => setConfirmOn(false)}
      />
    </>
  );
}
