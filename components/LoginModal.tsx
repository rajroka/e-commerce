"use client";

import { login } from '@/app/api/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginn  } from '@/redux/slice/authSlice';
interface LogintoggleProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}


type FormData = {
  email: string;
  password: string;
};

const Logintoggle = ({ isLogin, setIsLogin }: LogintoggleProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
 const dispatch = useDispatch();
  const onSubmit = async ({ email, password }: FormData) => {
    try {
        const response =  await login(email, password);
        const token = response.token;
         
         console.log('Login successful:', token);
        
      toast.success('Login successful!', { autoClose: 2000, position: 'top-right' });
      localStorage.setItem("token", response.token);
       dispatch( loginn({email, token}) );
      interface MyJwtPayload {
        isAdmin?: boolean;
        [key: string]: any;
      }
      const decode = jwtDecode<MyJwtPayload>(token);
      
      if (decode.isAdmin) {
        localStorage.setItem("isAdmin", "true");
              router.push('/dashboard'); 

      }
      else {
        localStorage.setItem("isAdmin", "false");
              // router.push('/products'); 

      }

    
      reset();
      setIsLogin(false);
      
            
       
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to TechShed</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="email " className="block text-sm font-medium text-gray-700">
                  email 
                </label>
                <input
                  id="email"
                  type="text"
                  {...register('email', { required: 'Email is required' })}
                  className={`w-full px-4 py-2 mt-1 rounded-lg border text-black ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-gray-900`}
                  placeholder="Enter your email"
                />
                
                  <p className="text-red-600 text-sm mt-1">{errors.email?.message }</p>
                
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className={`w-full px-4 py-2 mt-1 rounded-lg border text-black ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10`}
                    placeholder="Enter your password"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200"
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
