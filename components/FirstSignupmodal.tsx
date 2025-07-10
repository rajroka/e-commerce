'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useModalStore } from '@/store/modalStore';

type FormData = {
  username: string;
  email: string;
  password: string;
};

const FirstSignupmodal = () => {
  const { isSignupOpen, closeSignup } = useModalStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/users/signup', data);

      toast.success('Signup successful!', {
        autoClose: 2000,
        position: 'bottom-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '5px',
        },
      });

      reset();
      closeSignup();

    } catch (error: any) {
      toast.error('Signup failed. Please try again.', {
        autoClose: 2000,
        position: 'bottom-right',
        style: {
          background: '#F44336',
          color: '#fff',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '5px',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative bg-white w-full max-w-md rounded shadow-2xl p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={closeSignup}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900">Create Your Account</h2>
        <p className='text-base font-medium text-center text-gray-900'>
          Please use a unique email and username.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password with eye icon */}
          <div className="space-y-1 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default FirstSignupmodal;
