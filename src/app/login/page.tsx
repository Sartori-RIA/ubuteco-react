"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {AuthShell} from "@/app/_components/AuthShell";
import {BRAND_CTA} from "@/app/_components/marketing/brand-styles";
import {Buttons, Input} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {clearAuthError} from "@/app/_store/features/auth/authSlice";
import {signIn} from "@/app/_store/features/auth/authThunks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector((state) => state.auth);
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(signIn({email, password}));
    if (signIn.fulfilled.match(result)) {
      router.replace("/");
    }
  };

  return (
    <AuthShell
      title={t("auth.signInTitle")}
      subtitle={t("auth.signInSubtitle")}
      footer={
        <div className="space-y-2 text-center text-sm">
          <p>
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {t("auth.forgotPassword")}
            </Link>
          </p>
          <p className="text-muted">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {t("auth.createOne")}
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
            {t("auth.email")}
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
            {t("auth.password")}
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <Buttons type="submit" className={`w-full rounded-xl ${BRAND_CTA}`} disabled={status === "loading"}>
          {status === "loading" ? t("auth.signingIn") : t("auth.signIn")}
        </Buttons>
      </form>
    </AuthShell>
  );
}
