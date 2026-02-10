"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);

    const res = await signIn.social({
      provider: "google",
    });

    setGoogleLoading(false);

    if (res?.error) {
      setError(res.error.message || "Google login failed.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F9F4F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 border border-gray-100 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 rounded  uppercase tracking-widest">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm font-medium border-l-2 border-red-500">
            {error}
          </div>
        )}

        {/* Google Login - Square and Minimal */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center  rounded justify-center gap-3 border border-gray-300 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          <FcGoogle size={18} />
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase tracking-widest">Or use email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Email Login */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded ">
          <div className="space-y-1">
            <input
              name="email"
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              className="w-full px-2 bg-transparent rounded border-gray-300  py-3 text-sm uppercase tracking-widest placeholder-gray-400 focus:border-black outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <input
              name="password"
              type="password"
              placeholder="PASSWORD"
              required
              className="w-full bg-transparent px-2  rounded border border-gray-300  py-3 text-sm uppercase tracking-widest placeholder-gray-400 focus:border-black outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 rounded text-white text-sm font-bold uppercase tracking-[0.2em] py-4 hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/sign-up")}
              className="text-gray-900 font-bold rounded  hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}