"use client";

import {FormEvent, useEffect, useState} from "react";
import {Buttons, FormErrors, Label} from "@/app/_components";
import {Select} from "@/app/_components/Selects";
import {ConfirmDialog} from "@/app/_components/ConfirmDialog";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LOCALES,
  SUPPORTED_TIMEZONES,
} from "@/app/_lib/organization-settings";
import {organizationsService} from "@/app/_services/organizations.service";
import {ApiError} from "@/app/_services/api-fetch";
import {setAuthUser} from "@/app/_lib/auth-storage";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {updateAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {Organization} from "@/app/_types";

type FormState = {
  locale: string;
  default_currency: string;
  timezone: string;
};

function toFormState(organization: Organization | null | undefined): FormState {
  return {
    locale: organization?.locale ?? DEFAULT_LOCALE,
    default_currency: organization?.default_currency ?? DEFAULT_CURRENCY,
    timezone: organization?.timezone ?? DEFAULT_TIMEZONE,
  };
}

export function LocaleSettings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {organization, canManage} = useOrganizationSettings();
  const t = useTranslations();
  const [form, setForm] = useState<FormState>(() => toFormState(organization));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[] | undefined>();
  const [confirmCurrencyChange, setConfirmCurrencyChange] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<FormState | null>(null);

  useEffect(() => {
    setForm(toFormState(organization));
  }, [organization?.locale, organization?.default_currency, organization?.timezone]);

  if (!canManage || !organization?.id) {
    return <p className="text-sm text-muted">{t("settings.adminOnlyRegional")}</p>;
  }

  const organizationId = organization.id;

  const submitSettings = async (payload: FormState) => {
    setSaving(true);
    setErrors(undefined);

    try {
      const updated = await organizationsService.update(organizationId, payload);
      if (!user) return;

      const nextUser = {
        ...user,
        organization: {...organization, ...updated},
      };
      dispatch(updateAuthenticatedUser(nextUser));
      setAuthUser(nextUser);
      setForm(toFormState(updated));
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.data);
      } else {
        setErrors([t("settings.saveFailedRegional")]);
      }
    } finally {
      setSaving(false);
      setConfirmCurrencyChange(false);
      setPendingSubmit(null);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const currencyChanged = form.default_currency !== (organization.default_currency ?? DEFAULT_CURRENCY);
    if (currencyChanged) {
      setPendingSubmit(form);
      setConfirmCurrencyChange(true);
      return;
    }

    void submitSettings(form);
  };

  return (
    <>
      {errors && <FormErrors errors={errors}/>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Label label={t("settings.locale")}>
          <Select
            name="locale"
            value={form.locale}
            onChange={(value) => setForm((current) => ({...current, locale: value}))}
          >
            {SUPPORTED_LOCALES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Label>

        <Label label={t("settings.defaultCurrency")}>
          <Select
            name="default_currency"
            value={form.default_currency}
            onChange={(value) => setForm((current) => ({...current, default_currency: value}))}
          >
            {SUPPORTED_CURRENCIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Label>

        <Label label={t("settings.timezone")}>
          <Select
            name="timezone"
            value={form.timezone}
            onChange={(value) => setForm((current) => ({...current, timezone: value}))}
          >
            {SUPPORTED_TIMEZONES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Label>

        <p className="text-xs text-muted">{t("settings.currencyChangeHint")}</p>

        <div className="flex justify-end">
          <Buttons type="submit" loading={saving}>
            {t("settings.saveRegional")}
          </Buttons>
        </div>
      </form>

      <ConfirmDialog
        open={confirmCurrencyChange}
        title={t("settings.changeCurrencyTitle")}
        message={t("settings.changeCurrencyMessage")}
        confirmLabel={t("settings.changeCurrencyConfirm")}
        variant="primary"
        loading={saving}
        onConfirm={() => pendingSubmit && void submitSettings(pendingSubmit)}
        onCancel={() => {
          setConfirmCurrencyChange(false);
          setPendingSubmit(null);
        }}
      />
    </>
  );
}
