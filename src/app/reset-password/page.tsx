"use client";

import {FormEvent, Suspense, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {AuthFooterLink, AuthShell} from "@/app/_components/AuthShell";
import {AMBIENT_PAGE, BRAND_CTA} from "@/app/_components/marketing/brand-styles";
import {Buttons, Input, Loading} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppDispatch} from "@/app/_store/hooks";
import {resetPassword, validateResetCode} from "@/app/_store/features/auth/authThunks";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailHint = searchParams.get("email");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    setLoading(true);

    const codeResult = await dispatch(validateResetCode(code.trim()));
    if (validateResetCode.rejected.match(codeResult)) {
      setLoading(false);
      setError(typeof codeResult.payload === "string" ? codeResult.payload : t("auth.invalidCode"));
      return;
    }

    const resetResult = await dispatch(resetPassword(password));
    setLoading(false);

    if (resetPassword.fulfilled.match(resetResult)) {
      dispatch(setAuthenticatedUser(resetResult.payload));
      router.replace("/");
      return;
    }

    setError(typeof resetResult.payload === "string" ? resetResult.payload : t("auth.resetFailed"));
  };

  return (
    <AuthShell
      title={t("auth.resetTitle")}
      subtitle={
        emailHint
          ? t("auth.resetSubtitleWithEmail", {email: emailHint})
          : t("auth.resetSubtitle")
      }
      footer={<AuthFooterLink href="/login">{t("auth.backToSignIn")}</AuthFooterLink>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.resetCode")}
          </label>
          <Input id="code" required autoFocus value={code} onChange={(e) => setCode(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.newPassword")}
          </label>
          <Input id="password" type="password" required value={password}
                 onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("settings.confirmNewPassword")}
          </label>
          <Input id="confirm_password" type="password" required value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <Buttons type="submit" className={`w-full rounded-xl ${BRAND_CTA}`} disabled={loading}>
          {loading ? t("auth.updating") : t("auth.updatePassword")}
        </Buttons>
      </form>
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
