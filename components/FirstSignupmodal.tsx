'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, EyeIcon, EyeOffIcon } from '@hugeicons/core-free-icons';
import { useModalStore } from '@/store/modalStore';
import { signUp } from '@/lib/auth-client';
import {
  PASSWORD_RULES, passwordStrength,
  STRENGTH_LABEL, STRENGTH_COLOR,
} from '@/lib/password';

const STROKE = 1.5;

interface FormData {
  name:     string;
  email:    string;
  password: string;
}

const FirstSignupmodal = () => {
  const { isSignupOpen, closeSignup } = useModalStore();
  const {
    register, handleSubmit, watch,
    formState: { errors }, reset,
  } = useForm<FormData>();

  const [isLoading,    setIsLoading]    = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const password = watch('password', '');
  const strength = passwordStrength(password);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await signUp.email({
        name:     data.name,
        email:    data.email,
        password: data.password,
      });
      if (res.error) {
        toast.error(res.error.message || 'Sign up failed. Please try again.');
        return;
      }
      toast.success('Account created! Welcome to GG Shop.');
      reset();
      closeSignup();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">

        <button onClick={closeSignup} aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
          <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">Join GG Shop today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full name */}
          <div>
            <label htmlFor="fsm-name" className="block text-xs font-medium text-gray-600 mb-1.5">Full name</label>
            <input
              id="fsm-name"
              autoComplete="name"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
              className={`input ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="fsm-email" className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input
              id="fsm-email"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern:  { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Invalid email address' },
              })}
              className={`input ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password + strength meter */}
          <div>
            <label htmlFor="fsm-password" className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                id="fsm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  validate: (v) => {
                    for (const rule of PASSWORD_RULES) {
                      if (!rule.test(v)) return `Password must include: ${rule.label.toLowerCase()}.`;
                    }
                    return true;
                  },
                })}
                className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} size={16} color="currentColor" strokeWidth={STROKE} />
              </button>
            </div>

            {/* Strength meter — visible once typing starts */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1">
                  {PASSWORD_RULES.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLOR[strength] : 'bg-gray-100'}`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">{STRENGTH_LABEL[strength]}</p>
                <ul className="space-y-0.5">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li key={rule.id} className={`text-[11px] flex items-center gap-1.5 ${ok ? 'text-green-500' : 'text-gray-400'}`}>
                        <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${ok ? 'bg-green-500' : 'bg-gray-200'}`} />
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-xl mt-2"
          >
            {isLoading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstSignupmodal;
