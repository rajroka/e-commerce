'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

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
      // Simulated API call
      await new Promise((res) => setTimeout(res, 1500));
      console.log('Subscribed:', data);
      reset(); // Reset the form after success
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10 bg-white">
      <div className="rounded-2xl shadow-xl p-6 sm:p-10 bg-gray-100 w-full max-w-xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Subscribe to our Newsletter</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Get the latest updates, offers, and arrivals straight to your inbox.
        </p>

        {isSubmitSuccessful && !loading ? (
          <p className="text-green-600 font-semibold text-center">Thank you for subscribing! 🎉</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Your Email*"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-black'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree"
                className="mt-1 mr-2"
                {...register('agree', { required: 'You must agree to subscribe' })}
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                Yes, subscribe me to your newsletter.*
              </label>
            </div>
            {errors.agree && <p className="text-red-500 text-sm mt-1">{errors.agree.message}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
