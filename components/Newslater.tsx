'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Check } from 'lucide-react';

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
    <section className="w-full bg-white  py-20 px-4 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        {/* Title - Tracking tighter for luxury feel */}
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
          GG SHOP List
        </h2>
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-10">
          Exclusive updates and curated content.
        </p>

        {isSubmitSuccessful && !loading ? (
          <div className="flex flex-col items-center justify-center text-gray-900 py-4 animate-in fade-in duration-500">
            <Check className="w-8 h-8 mb-2" strokeWidth={3} />
            <p className="text-sm font-bold uppercase tracking-widest">You're on the list.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
              noValidate
            >
              {/* Underlined Email Input */}
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className={`w-full bg-transparent rounded  px-2 py-3 text-sm uppercase tracking-widest placeholder-gray-400 outline-none transition-colors duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'
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
                  <p role="alert" className="text-[10px] text-red-600 uppercase rounded  font-bold mt-2 text-left tracking-wider">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Square Button - Gray-800 to Black */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 rounded  text-white py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-black active:scale-[0.98] disabled:bg-gray-400 flex items-center justify-center"
              >
                {loading ? (
                  <span className="animate-pulse">Subscribing...</span>
                ) : (
                  'Join the list'
                )}
              </button>
            </form>

            {/* Checkbox Agreement - Square & Minimal */}
            {!isSubmitSuccessful && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    className="w-4 h-4 rounded-none border-gray-300 text-black focus:ring-0 accent-black cursor-pointer"
                    {...register('agree', { required: 'Agreement required' })}
                  />
                  <label htmlFor="agree" className="text-[11px] text-gray-500 uppercase tracking-widest cursor-pointer select-none">
                    I agree to the privacy policy
                  </label>
                </div>
                {errors.agree && (
                  <p className="text-[10px] text-red-600 uppercase font-bold tracking-wider">
                    Required
                  </p>
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