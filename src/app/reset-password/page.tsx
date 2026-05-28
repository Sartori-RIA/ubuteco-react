"use client";

import {FormEvent, Suspense, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {AuthFooterLink, AuthShell} from "@/app/_components/AuthShell";
import {Buttons, Input} from "@/app/_components";
import {Loading} from "@/app/_components";
import {useAppDispatch} from "@/app/_store/hooks";
import {resetPassword, validateResetCode} from "@/app/_store/features/auth/authThunks";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

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
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const codeResult = await dispatch(validateResetCode(code.trim()));
    if (validateResetCode.rejected.match(codeResult)) {
      setLoading(false);
      setError(typeof codeResult.payload === "string" ? codeResult.payload : "Invalid code");
      return;
    }

    const resetResult = await dispatch(resetPassword(password));
    setLoading(false);

    if (resetPassword.fulfilled.match(resetResult)) {
      dispatch(setAuthenticatedUser(resetResult.payload));
      router.replace("/");
      return;
    }

    setError(typeof resetResult.payload === "string" ? resetResult.payload : "Could not reset password");
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle={
        emailHint
          ? `Enter the code sent to ${emailHint} and choose a new password.`
          : "Enter the code from your email and choose a new password."
      }
      footer={<AuthFooterLink href="/login">Back to sign in</AuthFooterLink>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Reset code</label>
          <Input id="code" required autoFocus value={code} onChange={(e) => setCode(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <Input id="password" type="password" required minLength={8} value={password}
                 onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm new password
          </label>
          <Input id="confirm_password" type="password" required minLength={8} value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <Buttons type="submit" className="w-full rounded-xl" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Buttons>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loading/></div>}>
      <ResetPasswordForm/>
    </Suspense>
  );
}
