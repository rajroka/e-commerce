"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/app/api/Auth';
import { toast, ToastContainer } from 'react-toastify';

interface LogintoggleProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

type FormData = {
  username: string;
  password: string;
};

const Logintoggle = ({ isLogin, setIsLogin }: LogintoggleProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async ({ username, password }: FormData) => {
    try {
      const response = await login(username, password);
      toast.success('Login successful!', { autoClose: 2000, position: 'top-right' });
      setIsLogin(false);
      router.push('/sign-up/dashboard');
      // console.log(response.token)
      
      localStorage.setItem("token" , response.token);

      //  localStorage.setItem("user" , JSON.stringify(response.data.user));

      reset();
    } catch (error) {
      toast.error('Login failed. Please check your credentials.', {
        autoClose: 2000,
        position: 'top-right',
      });
    }
  };

  return (
    <>
      {isLogin && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to TechShed</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className={`w-full px-4 py-2 mt-1 rounded-md border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter your username"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full px-4 py-2 mt-1 rounded-md border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-sm text-gray-500 hover:text-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Logintoggle;
