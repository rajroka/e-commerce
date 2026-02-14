"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc"; // Optional: adding a small icon for the Google button

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await signUp.email({
      name: formData.get("name") as string,
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

  return (
    <main className="min-h-screen  bg-[#F9F4F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 border border-gray-100 shadow-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Join the community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm font-medium border-l-2 border-red-500">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded ">
          <div className="space-y-1">
            <input
              name="name"
              placeholder="FULL NAME"
              required
              className="w-full bg-transparent px-2 border-gray-300 py-3 text-sm uppercase tracking-widest placeholder-gray-400 focus:border-black outline-none transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <input
              name="email"
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              className="w-full bg-transparent  px-2 border-gray-300  py-3 text-sm uppercase tracking-widest placeholder-gray-400 focus:border-black outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <input
              name="password"
              type="password"
              placeholder="PASSWORD"
              required
              minLength={8}
              className="w-full bg-transparent px-2 border-gray-300  py-3 text-sm uppercase tracking-widest placeholder-gray-400 focus:border-black outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 rounded  text-white text-sm font-bold uppercase tracking-[0.2em] py-4 hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Social Login */}
        <button 
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.98]" 
          onClick={async() => await signIn.social({
            provider: "google",
          })}
        >
          <FcGoogle size={18} />
          Google Login
        </button>

        <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest">
          By signing up, you agree to our terms.
        </p>
      </div>
    </main>
  );
}