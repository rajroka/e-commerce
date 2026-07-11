"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  AlertCircleIcon,
  LoaderPinwheelIcon,
  EyeIcon,
  EyeOffIcon,
} from "@hugeicons/core-free-icons";

const STROKE = 1.5;

// ─── Inner component — uses useSearchParams, must be inside <Suspense> ────────
function SignInForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl");
  const redirectTo   = callbackUrl ? decodeURIComponent(callbackUrl) : "/";

  const [error,         setError]         = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);

  const anyLoading = loading || googleLoading || githubLoading;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd  = new FormData(e.currentTarget);
    const res = await signIn.email({
      email:       fd.get("email")    as string,
      password:    fd.get("password") as string,
      callbackURL: redirectTo,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error.message || "Invalid email or password.");
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: redirectTo });
    // OAuth redirects away — no need to handle res here
    setGoogleLoading(false);
  }

  async function handleGitHub() {
    setError(null);
    setGithubLoading(true);
    await signIn.social({ provider: "github", callbackURL: redirectTo });
    setGithubLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm" role="alert">
          <HugeiconsIcon icon={AlertCircleIcon} size={16} color="currentColor" strokeWidth={STROKE} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          onClick={handleGoogle}
          disabled={anyLoading}
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {googleLoading
            ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={16} color="#9ca3af" strokeWidth={STROKE} className="animate-spin" />
            : <FcGoogle size={18} />}
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <button
          onClick={handleGitHub}
          disabled={anyLoading}
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {githubLoading
            ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={16} color="#9ca3af" strokeWidth={STROKE} className="animate-spin" />
            : <FaGithub size={18} className="text-gray-800" />}
          {githubLoading ? "Connecting…" : "Continue with GitHub"}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Email / password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="si-email" className="block text-xs font-medium text-gray-600 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <HugeiconsIcon icon={Mail01Icon} size={15} color="#9ca3af" strokeWidth={STROKE} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="si-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input pl-9"
              disabled={anyLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="si-pw" className="block text-xs font-medium text-gray-600 mb-1.5">
            Password
          </label>
          <div className="relative">
            <HugeiconsIcon icon={LockPasswordIcon} size={15} color="#9ca3af" strokeWidth={STROKE} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="si-pw"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="input pl-9 pr-10"
              disabled={anyLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} size={15} color="currentColor" strokeWidth={STROKE} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={anyLoading}
          className="btn-primary w-full py-2.5 rounded-xl mt-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />
              Signing in…
            </>
          ) : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-red-500 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

// ─── Page shell — Suspense required for useSearchParams ──────────────────────
export default function SignInPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-red-500">GG Shop</Link>
          <h1 className="mt-3 text-xl font-semibold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account to continue</p>
        </div>
        <Suspense fallback={
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
