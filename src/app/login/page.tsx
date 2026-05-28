"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Buttons, Input} from "@/app/_components";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {clearAuthError} from "@/app/_store/features/auth/authSlice";
import {signIn} from "@/app/_store/features/auth/authThunks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector((state) => state.auth);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ubuteco</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
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
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Buttons type="submit" className="w-full rounded-xl" disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Sign in"}
        </Buttons>

        <div className="flex flex-col gap-2 text-center text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
            Forgot your password?
          </Link>
          <p className="text-gray-600">
            No account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
