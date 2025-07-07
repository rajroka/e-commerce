'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function EditProductPage() {
  const { productId } = useParams() as { productId: string };
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const product = await res.json();

        // Populate form values
        reset(product);
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update product');
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-2xl mb-6 font-bold text-center">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register('name', { required: 'Name required' })}
            className={`w-full border px-3 py-2 rounded ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register('description', { required: 'Description required' })}
            className={`w-full border px-3 py-2 rounded ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: 'Price required', valueAsNumber: true })}
            className={`w-full border px-3 py-2 rounded ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            {...register('image', { required: 'Image URL required' })}
            className={`w-full border px-3 py-2 rounded ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            {...register('category', { required: 'Category required' })}
            className={`w-full border px-3 py-2 rounded ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            {...register('stock', { required: 'Stock required', valueAsNumber: true })}
            className={`w-full border px-3 py-2 rounded ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Rating</label>
          <input
            type="number"
            step="0.1"
            {...register('rating', {
              required: 'Rating required',
              valueAsNumber: true,
              min: { value: 0, message: 'Min is 0' },
              max: { value: 5, message: 'Max is 5' },
            })}
            className={`w-full border px-3 py-2 rounded ${
              errors.rating ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.rating && <p className="text-red-600 text-sm">{errors.rating.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Reviews</label>
          <input
            type="number"
            {...register('reviews', { required: 'Reviews required', valueAsNumber: true })}
            className={`w-full border px-3 py-2 rounded ${
              errors.reviews ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.reviews && <p className="text-red-600 text-sm">{errors.reviews.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Update Product'}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
