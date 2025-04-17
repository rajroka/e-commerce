
"use client";
import { login } from '@/app/api/Auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm,  } from 'react-hook-form';




type SignInFormInputs = {
    email: string;
    password: string;
};

const SignIn = async  () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
         
      
    });
const router = useRouter()


    const onSubmit = async ({username  , password}:{ username :any , password : any}  ) => {
            
         const response =  await  login(username  , password)
         console.log(response)
        console.log('Form Data:', { username, password })

         router.push('/sign-up/dashboard')

        
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="text"
                            
                            {...register('username' , { required : " username is required"}  )}
                            className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring focus:ring-purple-500`}
                        />
                         <p className="text-red-500 text-sm">{errors.username?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password' , { required: "Password is required" })}
                            className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring focus:ring-purple-500`}
                        />
                 <p className="text-red-500 text-sm">{errors.password?.message as string}</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;