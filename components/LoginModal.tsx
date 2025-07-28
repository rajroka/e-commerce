'use client';

import { login } from '@/app/api/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginn } from '@/redux/slice/authSlice';
import { useModalStore } from '@/store/modalStore';

type FormData = {
  email: string;
  password: string;
};

const Logintoggle = () => {
  const { isLoginOpen, openSignup, closeLogin } = useModalStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      const response = await login(email, password);
      const token = response.token;

      toast.success('Login successful!', { autoClose: 2000, position: 'top-right' });
      localStorage.setItem("token", token);
      dispatch(loginn({ email, token }));

      interface MyJwtPayload {
        isAdmin?: boolean;
        [key: string]: any;
      }

      const decode = jwtDecode<MyJwtPayload>(token);
      if (decode.isAdmin) {
        localStorage.setItem("isAdmin", "true");
        router.push('/dashboard');
      } else {
        localStorage.setItem("isAdmin", "false");
      }

      reset();
      closeLogin();
    } catch (error) {
      toast.error('Login failed. Please check your credentials.', {
        autoClose: 2000,
        position: 'top-right',
      });
    }
  };

  const handleSignupClick = () => {
    openSignup();
  };

  return (
    <>
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md p-8 rounded border border-gray-300">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to Ggshop</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  {...register('email', { required: 'Email is required' })}
                  className={`w-full px-4 py-2 rounded border text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-gray-900
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className={`w-full px-4 py-2 rounded border text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10
                      ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-red-600 text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gray-900 text-white font-semibold rounded hover:bg-gray-800 transition duration-200"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={closeLogin}
                  className="text-sm text-gray-500 hover:text-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-900">
              Don't have an account?{' '}
              <button
                onClick={handleSignupClick}
                className="text-gray-900 hover:underline font-semibold"
                type="button"
              >
                Sign up
              </button>
            </p>
          </div>

          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Logintoggle;
