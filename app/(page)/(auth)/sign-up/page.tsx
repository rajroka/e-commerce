"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon, Mail01Icon, LockPasswordIcon,
  AlertCircleIcon, LoaderPinwheelIcon, EyeIcon, EyeOffIcon,
} from "@hugeicons/core-free-icons";
import {
  PASSWORD_RULES, passwordStrength,
  STRENGTH_LABEL, STRENGTH_COLOR, isStrongPassword,
} from "@/lib/password";

const STROKE = 1.5;

export default function SignUpPage() {
  const router = useRouter();

  const [error,         setError]         = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [touched,       setTouched]       = useState(false);

  const anyLoading = loading || googleLoading || githubLoading;
  const strength   = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setTouched(true);

    if (!isStrongPassword(password)) {
      setError("Please choose a stronger password — see the requirements below.");
      return;
    }

    setLoading(true);
    const fd  = new FormData(e.currentTarget);
    const res = await signUp.email({
      name:     fd.get("name")  as string,
      email:    fd.get("email") as string,
      password,
    });
    setLoading(false);

    if (res.error) {
      setError(res.error.message || "Something went wrong. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/" });
    setGoogleLoading(false);
  }

  async function handleGitHub() {
    setError(null);
    setGithubLoading(true);
    await signIn.social({ provider: "github", callbackURL: "/" });
    setGithubLoading(false);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-red-500">GG Shop</Link>
          <h1 className="mt-3 text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join thousands of happy customers</p>
        </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label htmlFor="su-name" className="block text-xs font-medium text-gray-600 mb-1.5">Full name</label>
              <div className="relative">
                <HugeiconsIcon icon={UserIcon} size={15} color="#9ca3af" strokeWidth={STROKE} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="su-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className="input pl-9"
                  disabled={anyLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="su-email" className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
              <div className="relative">
                <HugeiconsIcon icon={Mail01Icon} size={15} color="#9ca3af" strokeWidth={STROKE} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="su-email"
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

            {/* Password + strength meter */}
            <div>
              <label htmlFor="su-pw" className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <HugeiconsIcon icon={LockPasswordIcon} size={15} color="#9ca3af" strokeWidth={STROKE} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="su-pw"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setTouched(true); }}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

              {/* Strength meter — visible once typing starts */}
              {touched && password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {PASSWORD_RULES.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLOR[strength] : "bg-gray-100"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400">{STRENGTH_LABEL[strength]}</p>
                  <ul className="space-y-0.5">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <li key={rule.id} className={`text-[11px] flex items-center gap-1.5 ${ok ? "text-green-500" : "text-gray-400"}`}>
                          <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 border ${ok ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`} />
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={anyLoading}
              className="btn-primary w-full py-2.5 rounded-xl mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />
                  Creating…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-red-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
