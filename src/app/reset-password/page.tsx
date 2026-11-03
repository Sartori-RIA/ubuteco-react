"use client";

import {FormEvent, Suspense, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {AuthFooterLink, AuthShell} from "@/app/_components/AuthShell";
import {AMBIENT_PAGE, BRAND_CTA} from "@/app/_components/marketing/brand-styles";
import {Buttons, Input, Loading} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppDispatch} from "@/app/_store/hooks";
import {resetPassword} from "@/app/_store/features/auth/authThunks";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import {MIN_PASSWORD_LENGTH, passwordIssue} from "@/app/_lib/password-policy";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const token = searchParams.get("token") ?? "";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError(t("auth.missingResetToken"));
      return;
    }

    const issue = passwordIssue({password, confirmation: confirmPassword});
    if (issue === "too_short") {
      setError(t("auth.passwordTooShort", {count: MIN_PASSWORD_LENGTH}));
      return;
    }
    if (issue === "mismatch") {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    setLoading(true);
    const result = await dispatch(resetPassword({token, password}));
    setLoading(false);

    if (resetPassword.fulfilled.match(result)) {
      setSaved(true);
      return;
    }

    const reason = result.payload as {message?: string; payload?: unknown} | undefined;
    const messages = resolveApiErrorMessages(reason?.payload, t);
    setError(messages[0] ?? reason?.message ?? t("auth.resetFailed"));
  };

  return (
    <AuthShell
      title={t("auth.resetTitle")}
      subtitle={saved ? t("auth.passwordUpdated") : t("auth.resetSubtitle")}
      footer={<AuthFooterLink href="/login">{t("auth.backToSignIn")}</AuthFooterLink>}
    >
      {saved ? (
        <Buttons type="button" className={`w-full rounded-xl ${BRAND_CTA}`} onClick={() => router.push("/login")}>
          {t("auth.signIn")}
        </Buttons>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.newPassword")}
            </label>
            <Input id="password" type="password" required minLength={MIN_PASSWORD_LENGTH} value={password}
                   onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              {t("settings.confirmNewPassword")}
            </label>
            <Input id="confirm_password" type="password" required minLength={MIN_PASSWORD_LENGTH} value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <Buttons type="submit" className={`w-full rounded-xl ${BRAND_CTA}`} disabled={loading}>
            {loading ? t("auth.updating") : t("auth.updatePassword")}
          </Buttons>
        </form>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className={`flex min-h-screen items-center justify-center ${AMBIENT_PAGE}`}><Loading/></div>}>
      <ResetPasswordForm/>
    </Suspense>
  );
}
