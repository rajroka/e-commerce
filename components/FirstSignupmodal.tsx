'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type FormData = {
  username: string;
  email: string;
  password: string;
  role: string;
};

const FirstSignupmodal = ({
  isSignup,
  setIsSignup,
}: {
  isSignup: boolean;
  setIsSignup: (val: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/api/users/signup', data);
      console.log('Signup successful:', res.data);
      alert('Signup successful!');
      reset();
      setIsSignup(false);
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  if (!isSignup) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl space-y-5">
        <button
          onClick={() => setIsSignup(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-center text-gray-800">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="w-full border border-gray-300 text-black  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
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
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              {...register('role', { required: 'Role is required' })}
              className="w-full border border-gray-300 text-black  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstSignupmodal;
