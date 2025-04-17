'use client';

import { postProduct } from '@/app/api/Allblog';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchMedia.matches);
    matchMedia.addEventListener('change', (e) => setIsDarkMode(e.matches));
    return () => matchMedia.removeEventListener('change', () => {});
  }, []);

  const onSubmit = async ({ title, price, description, category, image }: FormData) => {
    try {
      const response = await postProduct(title, price, description, category, image);
      reset();
      toast.success('Product created successfully!', {
        autoClose: 2000,
        position: 'top-right',
        hideProgressBar: false,
        onClose: () => router.push('/sign-up/dashboard'),
      });
    } catch (error) {
      toast.error('Failed to create product. Please try again.');
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full max-w-2xl space-y-6 p-6 sm:p-8 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <h2 className="text-3xl font-bold text-center">Create New Product</h2>

        {/* Input Fields */}
        {[
          { label: 'Title', name: 'title', type: 'text' },
          { label: 'Price ($)', name: 'price', type: 'number', step: '0.01' },
          { label: 'Description', name: 'description', type: 'textarea' },
          { label: 'Category', name: 'category', type: 'text' },
          { label: 'Image URL', name: 'image', type: 'url' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                {...register(field.name as keyof FormData, { required: `${field.label} is required` })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
              />
            ) : (
              <input
                type={field.type}
                step={field.step || undefined}
                {...register(field.name as keyof FormData, { required: `${field.label} is required` })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
              />
            )}
            {errors[field.name as keyof FormData] && (
              <p className="text-red-500 text-sm mt-1">
                {(errors[field.name as keyof FormData] as any)?.message}
              </p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Submit
        </button>
      </form>
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
};

export default Page;