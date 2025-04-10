"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

interface LogintoggleProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

type FormData = {
  username: string;
  password?: string; // Make password optional
};

const Logintoggle = ({ isLogin, setIsLogin }: LogintoggleProps) => {
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const router =  useRouter()
  // Handle form submission
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    // You can add your API call or login logic here
        event?.preventDefault()
    // Hide the modal after form submission
    setIsLogin(false);
    router.push('/sign-up/dashboard')
  };

  return (
    <>
      {isLogin && (
        <div className='inset-0 fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register('username', { required: 'Username is required' })}
                  className={`mt-1 block w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>

              <div className='mb-6'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password (Optional, but must be at least 8 characters)
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', {
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must contain at least one letter and one number"
                    }
                  })}
                  className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className='flex justify-between items-center'>
                <button
                  type="submit"
                  className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md focus:outline-none'
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className='ml-2 text-red-500 hover:text-red-700'
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Logintoggle;
