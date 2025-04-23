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
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async ({ title, price, description, category, image }: FormData) => {
    try {
      const response = await postProduct(title, price, description, category, image);
      reset();
      toast.success('Product created successfully!', {
        autoClose: 2000,
        position: 'top-right',
        hideProgressBar: false,
        onClose: () => router.push('/dashboard'),
      });
    } catch (error) {
      toast.error('Failed to create product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-6 p-8 sm:p-10 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent">
            Create New Product
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Fill in the details below to add a new product to your inventory
          </p>
        </div>

        <div className="space-y-5">
          {[
            { label: 'Product Title', name: 'title', type: 'text', placeholder: 'Enter product name' },
            { 
              label: 'Price ($)', 
              name: 'price', 
              type: 'number', 
              step: '0.01',
              placeholder: '0.00',
              min: '0'
            },
            { 
              label: 'Description', 
              name: 'description', 
              type: 'textarea', 
              placeholder: 'Detailed product description...' 
            },
            { 
              label: 'Category', 
              name: 'category', 
              type: 'text', 
              placeholder: 'e.g. Electronics, Clothing' 
            },
            { 
              label: 'Image URL', 
              name: 'image', 
              type: 'url', 
              placeholder: 'https://example.com/image.jpg' 
            },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
                <span className="text-red-500">*</span>
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name as keyof FormData, { 
                    required: `${field.label} is required`,
                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                  })}
                  rows={4}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors[field.name as keyof FormData] 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 transition duration-200 bg-white dark:bg-gray-700`}
                />
              ) : (
                <input
                  type={field.type}
                  step={field.step || undefined}
                  min={field.min || undefined}
                  {...register(field.name as keyof FormData, { 
                    required: `${field.label} is required`,
                    ...(field.name === 'price' && { 
                      min: { value: 0.01, message: 'Price must be greater than 0' }
                    })
                  })}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors[field.name as keyof FormData] 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                  } focus:outline-none focus:ring-2 transition duration-200 bg-white dark:bg-gray-700`}
                />
              )}
              
              {errors[field.name as keyof FormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors[field.name as keyof FormData] as any)?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
              isSubmitting
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg'
            } flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Create Product'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Page;