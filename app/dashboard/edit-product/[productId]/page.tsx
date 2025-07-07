'use client';

import { FiUpload } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { updateProductByID } from '@/app/api/products'; // 
import {  getByID } from '@/app/api/products'; // Adjust the import path as needed
import { toast , ToastContainer } from 'react-toastify';


type ProductFormData = {
  name: string;
  description: string;
  price: number;
   image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
};

export default  function AddProductPage({params}: { params: { productId: string } }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProductFormData>();

   useEffect(()=>{
      async function edit(){
    const id = params.productId;
     const raj  = await getByID(id)
    // console.log('Fetched Product:', raj);
    setImageId(raj.image);
    reset(raj);
    }
    edit();
   } ,[])

  const [imageId, setImageId] = useState('');


  const onSubmit = async ( data: ProductFormData) => {
    try {
        const id = params.productId; 
      const res = await updateProductByID( id ,  data);
      
reset();
      setImageId('');
      toast.success('Product edited successfully!');
      
    } catch (error) {
      console.error('Failed to post product:', error);
      toast.error('Failed to edit product. Please try again.');
    }
  };

  return (
    <div className=" min-h-screen flex items-center p-10 bg-gray-100 justify-center w-screen">
    <div className="max-w-xl mx-auto p-6  bg-white  rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">Edit product </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  ">

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            {...register('name', { required: 'Product name is required' })}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Image Preview */}
        {imageId && (
          <div className="mb-4 flex justify-center">
            <CldImage
              src={imageId}
              alt="Uploaded product image"
              width={480}
              height={300}
              className="rounded-md object-contain"
            />
          </div>
        )}

        {/* Image Upload Button */}
        <CldUploadWidget
          uploadPreset="unsigned"
          onSuccess={({ event, info }) => {
            if (event === 'success') {
              setImageId(info?.public_id || '');
            
              setValue('image', info?.url || '');
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <FiUpload className="text-lg" />
              Upload Image
            </button>
          )}
        </CldUploadWidget>
        <input type="hidden" {...register('image', { required: 'Image is required' })} />
        {errors.image && (
          <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            className={`w-full rounded-md border px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-1 font-medium text-gray-700">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price cannot be negative' },
            })}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block mb-1 font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            {...register('category', { required: 'Category is required' })}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter category"
          />
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block mb-1 font-medium text-gray-700">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            id="stock"
            type="number"
            {...register('stock', {
              required: 'Stock quantity is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Stock cannot be negative' },
            })}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter stock quantity"
          />
          {errors.stock && (
            <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block mb-1 font-medium text-gray-700">
            Rating (0 to 5) <span className="text-red-500">*</span>
          </label>
          <input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register('rating', {
              required: 'Rating is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Rating cannot be less than 0' },
              max: { value: 5, message: 'Rating cannot be more than 5' },
            })}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.rating ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter rating"
          />
          {errors.rating && (
            <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Reviews */}
        <div>
          <label htmlFor="reviews" className="block mb-1 font-medium text-gray-700">
            Number of Reviews <span className="text-red-500">*</span>
          </label>
          <input
            id="reviews"
            type="number"
            {...register('reviews', {
              required: 'Reviews count is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Reviews cannot be negative' },
            })}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.reviews ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter number of reviews"
          />
          {errors.reviews && (
            <p className="text-red-600 text-sm mt-1">{errors.reviews.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Add Product
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
    </div>
  );
}
