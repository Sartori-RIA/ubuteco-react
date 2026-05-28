"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {AuthFooterLink, AuthShell} from "@/app/_components/AuthShell";
import {Buttons, Input} from "@/app/_components";
import {useAppDispatch} from "@/app/_store/hooks";
import {requestPasswordReset} from "@/app/_store/features/auth/authThunks";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await dispatch(requestPasswordReset(email.trim()));
    setLoading(false);

    if (requestPasswordReset.fulfilled.match(result)) {
      setSent(true);
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      return;
    }

    setError(typeof result.payload === "string" ? result.payload : "Could not send reset code");
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle={sent ? "Check your email for the reset code." : "We will email you a code to reset your password."}
      footer={<AuthFooterLink href="/login">Back to sign in</AuthFooterLink>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            id="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <Buttons type="submit" className="w-full rounded-xl" disabled={loading}>
          {loading ? "Sending..." : "Send reset code"}
        </Buttons>
      </form>
    </AuthShell>
  );
}
