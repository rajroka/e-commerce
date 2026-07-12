"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  PASSWORD_RULES, passwordStrength,
  STRENGTH_LABEL, STRENGTH_COLOR, isStrongPassword,
} from "@/lib/password";

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
    if (!isStrongPassword(password)) { setError("Please choose a stronger password — see the requirements below."); return; }
    setLoading(true);
    const fd  = new FormData(e.currentTarget);
    const res = await signUp.email({ name: fd.get("name") as string, email: fd.get("email") as string, password });
    setLoading(false);
    if (res.error) setError(res.error.message || "Something went wrong. Please try again.");
    else { router.push("/"); router.refresh(); }
  }

  async function handleGoogle() {
    setError(null); setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/" });
    setGoogleLoading(false);
  }

  async function handleGitHub() {
    setError(null); setGithubLoading(true);
    await signIn.social({ provider: "github", callbackURL: "/" });
    setGithubLoading(false);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-red-500">GG Shop</Link>
          <h1 className="mt-3 text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join thousands of happy customers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm" role="alert">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button variant="outline" type="button" className="w-full" disabled={anyLoading} onClick={handleGoogle}>
              {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <FcGoogle size={18} />}
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </Button>
            <Button variant="outline" type="button" className="w-full" disabled={anyLoading} onClick={handleGitHub}>
              {githubLoading ? <Loader2 size={16} className="animate-spin" /> : <FaGithub size={18} />}
              {githubLoading ? "Connecting…" : "Continue with GitHub"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="su-name">Full name</Label>
              <Input id="su-name" name="name" type="text" required autoComplete="name"
                placeholder="Jane Smith" disabled={anyLoading} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="su-email">Email address</Label>
              <Input id="su-email" name="email" type="email" required autoComplete="email"
                placeholder="you@example.com" disabled={anyLoading} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="su-pw">Password</Label>
              <div className="relative">
                <Input id="su-pw" name="password" type={showPassword ? "text" : "password"} required
                  value={password} onChange={e => { setPassword(e.target.value); setTouched(true); }}
                  placeholder="Create a strong password" autoComplete="new-password"
                  className="pr-10" disabled={anyLoading} />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {touched && password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {PASSWORD_RULES.map((_, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLOR[strength] : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{STRENGTH_LABEL[strength]}</p>
                  <ul className="space-y-0.5">
                    {PASSWORD_RULES.map(rule => {
                      const ok = rule.test(password);
                      return (
                        <li key={rule.id} className={`text-[11px] flex items-center gap-1.5 ${ok ? "text-green-500" : "text-muted-foreground"}`}>
                          <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 border ${ok ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`} />
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" disabled={anyLoading} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full mt-1">
              {loading ? <><Loader2 size={15} className="animate-spin" />Creating…</> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-red-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
