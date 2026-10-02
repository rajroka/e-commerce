'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { useModalStore } from '@/store/modalStore';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginModal() {
  const router = useRouter();
  const { isLoginOpen, closeLogin } = useModalStore();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const anyLoading = loading || googleLoading || githubLoading;

  if (!isLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn.email({ email, password, callbackURL: '/' });
    setLoading(false);
    if (res.error) { setError(res.error.message || 'Invalid email or password.'); return; }
    closeLogin();
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn.social({ provider: 'google', callbackURL: '/' });
    setGoogleLoading(false);
  };

  const handleGithub = async () => {
    setGithubLoading(true);
    await signIn.social({ provider: 'github', callbackURL: '/' });
    setGithubLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={closeLogin}
        aria-hidden
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-label="Sign in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 space-y-5 relative">

          {/* Close */}
          <button
            onClick={closeLogin}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue shopping</p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Social */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full" disabled={anyLoading} onClick={handleGoogle}>
              {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <FcGoogle size={18} />}
              {googleLoading ? 'Connecting…' : 'Continue with Google'}
            </Button>
            <Button variant="outline" className="w-full" disabled={anyLoading} onClick={handleGithub}>
              {githubLoading ? <Loader2 size={16} className="animate-spin" /> : <FaGithub size={18} />}
              {githubLoading ? 'Connecting…' : 'Continue with GitHub'}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="lm-email">Email</Label>
              <Input id="lm-email" type="email" required placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} disabled={anyLoading} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lm-pw">Password</Label>
              <div className="relative">
                <Input id="lm-pw" type={showPassword ? 'text' : 'password'} required
                  placeholder="••••••••" className="pr-10"
                  value={password} onChange={e => setPassword(e.target.value)} disabled={anyLoading} />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={anyLoading} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">
              {loading ? <><Loader2 size={15} className="animate-spin" />Signing in…</> : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            No account?{' '}
            <Link href="/sign-up" onClick={closeLogin} className="text-red-500 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
