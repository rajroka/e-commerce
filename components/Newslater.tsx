'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Check } from 'lucide-react';

type FormData = { email: string; agree: boolean };

const Newsletter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FormData>();

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      console.log('Subscribed:', data);
      reset();
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-20 px-4 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Stay in the loop
        </h2>
        <p className="text-sm text-gray-500 mb-10">
          Exclusive updates, new arrivals and curated picks — straight to your inbox.
        </p>

        {isSubmitSuccessful && !loading ? (
          <div className="flex flex-col items-center justify-center text-gray-900 py-4 animate-in fade-in duration-500">
            <Check className="w-8 h-8 mb-2" strokeWidth={3} />
            <p className="text-sm font-semibold">You&apos;re on the list.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  className={`w-full bg-transparent rounded-lg border px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:border-red-400'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                  })}
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-red-600 font-medium mt-1.5 text-left">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 rounded-full text-white py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:bg-gray-300 flex items-center justify-center"
              >
                {loading ? <span className="animate-pulse">Subscribing…</span> : 'Subscribe'}
              </button>
            </form>

            {!isSubmitSuccessful && (
              <div className="mt-5 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    className="w-4 h-4 border-gray-300 text-red-500 focus:ring-0 accent-red-500 cursor-pointer"
                    {...register('agree', { required: 'Agreement required' })}
                  />
                  <label htmlFor="agree" className="text-xs text-gray-500 cursor-pointer select-none">
                    I agree to the privacy policy
                  </label>
                </div>
                {errors.agree && (
                  <p className="text-xs text-red-600 font-medium">Required</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
