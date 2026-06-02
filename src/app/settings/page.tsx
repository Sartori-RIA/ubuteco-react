"use client";

import {FormEvent, useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {Buttons, Card, FormErrors, Input, Label, Loading} from "@/app/_components";
import {formatRoleLabel} from "@/app/_lib/role-labels";
import {formatMemberSince, userInitials} from "@/app/_lib/user-display";
import {setAuthUser} from "@/app/_lib/auth-storage";
import {usersService} from "@/app/_services/users.service";
import {ApiError} from "@/app/_services/api-fetch";
import {useAppDispatch} from "@/app/_store/hooks";
import {updateAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {signOut} from "@/app/_store/features/auth/authThunks";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {User} from "@/app/_types";
import {AppearanceSettings} from "@/app/settings/components/AppearanceSettings";
import {LocaleSettings} from "@/app/settings/components/LocaleSettings";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {user: sessionUser} = useAuthCapabilities();
  const t = useTranslations();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<string[] | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeletePanel, setShowDeletePanel] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const loadProfile = useCallback(async () => {
    if (!sessionUser?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrors(undefined);
    try {
      const data = await usersService.show(sessionUser.id);
      setProfile(data);
      setName(data.name ?? "");
      setEmail(data.email ?? "");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.data);
      } else {
        setErrors([t("settings.loadProfileFailed")]);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionUser?.id]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleLogout = async () => {
    await dispatch(signOut());
    router.replace("/login");
  };

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sessionUser?.id) return;

    if (password && password !== passwordConfirmation) {
      setErrors([t("auth.passwordsMismatch")]);
      return;
    }

    setSaving(true);
    setErrors(undefined);

    const payload: {name: string; email: string; password?: string} = {
      name: name.trim(),
      email: email.trim(),
    };
    if (password.trim()) {
      payload.password = password;
    }

    try {
      const updated = await usersService.updateProfile(sessionUser.id, payload);
      setProfile(updated);
      setPassword("");
      setPasswordConfirmation("");
      dispatch(updateAuthenticatedUser(updated));
      setAuthUser(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.data);
      } else {
        setErrors([t("settings.saveProfileFailed")]);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!sessionUser?.id || !profile?.email) return;
    if (deleteConfirm !== profile.email) {
      setErrors([t("settings.deleteEmailMismatch")]);
      return;
    }

    setDeleting(true);
    setErrors(undefined);

    try {
      await usersService.destroy(sessionUser.id);
      await dispatch(signOut());
      router.replace("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.data);
      } else {
        setErrors([t("settings.deleteAccountFailed")]);
      }
      setDeleting(false);
    }
  };

  const displayUser = profile ?? sessionUser;

  if (loading && !displayUser) {
    return <Loading/>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("settings.subtitle")}</p>
      </div>

      {errors && <FormErrors errors={errors}/>}

      <Card title={t("settings.profile")} className="hover:translate-y-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {displayUser?.avatar_url ? (
            <Image
              src={displayUser.avatar_url}
              alt={displayUser.name ?? "Avatar"}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white"
              aria-hidden
            >
              {userInitials(displayUser)}
            </div>
          )}
          <dl className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">{t("settings.name")}</dt>
              <dd className="font-medium text-gray-900">{displayUser?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("settings.email")}</dt>
              <dd className="font-medium text-gray-900">{displayUser?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("settings.role")}</dt>
              <dd className="font-medium text-gray-900">{formatRoleLabel(displayUser)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("settings.organization")}</dt>
              <dd className="font-medium text-gray-900">{displayUser?.organization?.name ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-gray-500">{t("settings.memberSince")}</dt>
              <dd className="font-medium text-gray-900">{formatMemberSince(displayUser?.created_at)}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <Card title={t("settings.editProfile")} className="hover:translate-y-0">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Label label={t("settings.name")}>
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("settings.yourNamePlaceholder")}
              required
              className="!pl-4"
            />
          </Label>
          <Label label={t("settings.email")}>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="!pl-4"
            />
          </Label>
          <Label label={t("settings.newPassword")}>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("settings.passwordKeepBlank")}
              className="!pl-4"
            />
          </Label>
          <Label label={t("settings.confirmNewPassword")}>
            <Input
              name="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder={t("settings.repeatNewPassword")}
              className="!pl-4"
            />
          </Label>
          <div className="flex justify-end">
            <Buttons type="submit" loading={saving} disabled={loading}>
              {t("settings.saveChanges")}
            </Buttons>
          </div>
        </form>
      </Card>

      <Card title={t("settings.appearance")} className="hover:translate-y-0">
        <p className="mb-4 text-sm text-muted">{t("settings.appearanceHint")}</p>
        <AppearanceSettings/>
      </Card>

      <Card title={t("settings.regional")} className="hover:translate-y-0">
        <p className="mb-4 text-sm text-muted">{t("settings.regionalHint")}</p>
        <LocaleSettings/>
      </Card>

      <Card title={t("settings.plan")} className="hover:translate-y-0">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">{t("settings.planComingSoon")}</p>
          <p className="mt-2 text-sm text-gray-600">{t("settings.planHint")}</p>
        </div>
      </Card>

      <Card title={t("settings.session")} className="hover:translate-y-0">
        <p className="mb-4 text-sm text-gray-600">{t("settings.sessionHint")}</p>
        <Buttons
          variant="outline"
          onClick={handleLogout}
          leftIcon={<FontAwesomeIcon icon={faRightFromBracket}/>}
        >
          {t("common.signOut")}
        </Buttons>
      </Card>

      <Card title={t("settings.dangerZone")} className="border-red-100 hover:translate-y-0">
        <p className="mb-4 text-sm text-gray-600">{t("settings.dangerHint")}</p>
        {!showDeletePanel ? (
          <Buttons variant="danger" onClick={() => setShowDeletePanel(true)}>
            {t("settings.deleteAccount")}
          </Buttons>
        ) : (
          <div className="space-y-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
            <p className="text-sm text-red-900">
              {t("settings.typeEmailConfirm", {email: profile?.email ?? ""})}
            </p>
            <Input
              name="delete_confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={profile?.email ?? "you@example.com"}
              className="!pl-4"
            />
            <div className="flex flex-wrap gap-2">
              <Buttons
                variant="danger"
                loading={deleting}
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== profile?.email}
              >
                {t("settings.confirmDeletion")}
              </Buttons>
              <Buttons
                variant="ghost"
                onClick={() => {
                  setShowDeletePanel(false);
                  setDeleteConfirm("");
                }}
              >
                {t("common.cancel")}
              </Buttons>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
