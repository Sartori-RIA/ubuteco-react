"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {AuthFooterLink, AuthShell} from "@/app/_components/AuthShell";
import {BRAND_CTA} from "@/app/_components/marketing/brand-styles";
import {Buttons, Input} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {clearAuthError} from "@/app/_store/features/auth/authSlice";
import {signUp} from "@/app/_store/features/auth/authThunks";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector((state) => state.auth);
  const t = useTranslations();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationPhone, setOrganizationPhone] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError(t("auth.passwordsMismatch"));
      return;
    }

    const result = await dispatch(
      signUp({
        user: {name: name.trim(), email: email.trim(), password},
        organization_attributes: {
          name: organizationName.trim(),
          phone: organizationPhone.trim(),
        },
      })
    );

    if (signUp.fulfilled.match(result)) {
      router.replace("/");
    }
  };

  const displayError = localError ?? error;

  return (
    <AuthShell
      title={t("auth.signUpTitle")}
      subtitle={t("auth.signUpSubtitle")}
      footer={<AuthFooterLink href="/login">{t("auth.footerAlreadyHaveAccount")}</AuthFooterLink>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.yourName")}
          </label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.email")}
          </label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.password")}
          </label>
          <Input id="password" type="password" required value={password}
                 onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.confirmPassword")}
          </label>
          <Input id="confirm_password" type="password" required value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>

        <div className="border-t pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-900">{t("auth.organizationSection")}</p>
          <div>
            <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.businessName")}
            </label>
            <Input id="organization_name" required value={organizationName}
                   onChange={(e) => setOrganizationName(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="organization_phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.phone")}
            </label>
            <Input id="organization_phone" required value={organizationPhone}
                   onChange={(e) => setOrganizationPhone(e.target.value)}/>
          </div>
        </div>

        {displayError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {displayError}
          </p>
        )}

        <Buttons type="submit" className={`w-full rounded-xl ${BRAND_CTA}`} disabled={status === "loading"}>
          {status === "loading" ? t("auth.creatingAccount") : t("auth.createAccount")}
        </Buttons>

        <p className="text-center text-xs leading-relaxed text-muted">
          {t("legal.signUpNoticePrefix")}{" "}
          <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {t("marketing.footer.terms")}
          </Link>{" "}
          {t("legal.signUpNoticeAnd")}{" "}
          <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {t("marketing.footer.privacy")}
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
