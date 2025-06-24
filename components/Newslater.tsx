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
    <section className="w-full bg-[#f7f7f7] py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Stay in the Loop
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-8">
          Subscribe to our newsletter for exclusive updates, deals, and content.
        </p>

        {isSubmitSuccessful && !loading ? (
          <div className="flex flex-col items-center justify-center text-green-600 space-y-2">
            <CheckCircle className="w-8 h-8" />
            <p className="font-medium text-base">Thank you for subscribing! 🎉</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Email Input */}
            <div className="w-full sm:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className={`w-full sm:w-80 px-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-900'
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
                <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-200 disabled:opacity-60"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {/* Checkbox Agreement */}
        {!isSubmitSuccessful && (
          <div className="mt-4 text-sm flex justify-center items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              className="mt-1 cursor-pointer"
              {...register('agree', { required: 'You must agree to subscribe' })}
            />
            <label htmlFor="agree" className="text-gray-700 cursor-pointer">
              I agree to receive emails and updates.
            </label>
          </div>
        )}
        {errors.agree && <p className="text-red-500 text-sm mt-1">{errors.agree.message}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
