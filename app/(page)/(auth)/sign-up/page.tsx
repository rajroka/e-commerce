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
import { isStrongPassword } from "@/lib/password";

export default function SignUpPage() {
  const router = useRouter();
  const [error,         setError]         = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const anyLoading = loading || googleLoading || githubLoading;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isStrongPassword(password)) { setError("Please choose a stronger password."); return; }
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
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-3">
          <Link href="/" className="inline-block">
            <img src="/m.png" alt="SportShop" className="h-[160px] w-auto mx-auto" />
          </Link>
          <h1 className="mt-0 text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join thousands of happy customers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm" role="alert">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="space-y-2">
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="su-name">Full name</Label>
              <Input id="su-name" name="name" type="text" required autoComplete="name"
                placeholder="Jane Smith" disabled={anyLoading} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="su-email">Email address</Label>
              <Input id="su-email" name="email" type="email" required autoComplete="email"
                placeholder="you@example.com" disabled={anyLoading} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="su-pw">Password</Label>
              <div className="relative">
                <Input id="su-pw" name="password" type={showPassword ? "text" : "password"} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password" autoComplete="new-password"
                  className="pr-10" disabled={anyLoading} />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={anyLoading} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">
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
