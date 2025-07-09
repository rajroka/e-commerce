'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';

type FormData = {
  email: string;
  agree: boolean;
};

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
      await new Promise((res) => setTimeout(res, 1500)); // simulate API call
      console.log('Subscribed:', data);
      reset();
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f7f7f7] py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-4xl font-bold text-gray-900 mb-6">
          Join our newsletter for exclusive updates, special offers, and curated content—delivered straight to your inbox.
        </h2>

        {isSubmitSuccessful && !loading ? (
          <div className="flex flex-col items-center justify-center text-green-600 space-y-3">
            <CheckCircle className="w-10 h-10" aria-hidden="true" />
            <p className="font-semibold text-lg">Thank you for subscribing! 🎉</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
            noValidate
            aria-live="polite"
          >
            {/* Email Input */}
            <div className="w-full sm:flex-1">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email address"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby="email-error"
                className={`w-full px-4 py-3 border rounded text-sm focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-gray-900'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-red-600 text-sm mt-1 text-left"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition duration-200 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center gap-2 min-w-[130px]"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Loading"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        )}

        {/* Checkbox Agreement */}
        {!isSubmitSuccessful && (
          <div className="mt-6 max-w-xl mx-auto flex items-center gap-2 justify-center text-gray-700 text-sm">
            <input
              type="checkbox"
              id="agree"
              aria-invalid={errors.agree ? 'true' : 'false'}
              aria-describedby="agree-error"
              className="cursor-pointer rounded border-gray-300 text-black focus:ring-2 focus:ring-offset-1 focus:ring-black"
              {...register('agree', { required: 'You must agree to subscribe' })}
            />
            <label htmlFor="agree" className="cursor-pointer select-none">
              I agree to receive emails and updates.
            </label>
          </div>
        )}
        {errors.agree && (
          <p
            id="agree-error"
            role="alert"
            className="text-red-600 text-sm mt-1 max-w-xl mx-auto text-center"
          >
            {errors.agree.message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
