'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, LoaderPinwheelIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

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

const inputCls = (err = false) =>
  `w-full border ${err ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition-colors`;

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-gray-600 mb-1.5">{children}</label>
);

export default function EditProductPage() {
  const { productId } = useParams() as { productId: string };
  const router        = useRouter();
  const [fetching,   setFetching]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(product => {
        // API returns the Mongoose document — map fields to form shape
        reset({
          name:        product.name        ?? '',
          description: product.description ?? '',
          price:       product.price       ?? 0,
          image:       product.image       ?? '',
          category:    product.category    ?? '',
          stock:       product.stock       ?? 0,
          rating:      product.rating      ?? 0,
          reviews:     product.reviewCount ?? product.reviews ?? 0,
        });
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setFetching(false));
  }, [productId, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        data.name,
          description: data.description,
          price:       data.price,
          image:       data.image,
          category:    data.category,
          stock:       data.stock,
          rating:      data.rating,
          reviewCount: data.reviews,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Product updated!');
      router.push('/all-products');
    } catch {
      toast.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center py-20">
      <HugeiconsIcon icon={LoaderPinwheelIcon} size={28} color="#ef4444" strokeWidth={STROKE} className="animate-spin" />
    </div>
  );

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} color="currentColor" strokeWidth={STROKE} />
        </button>
        <HugeiconsIcon icon={Edit01Icon} size={22} color="#ef4444" strokeWidth={STROKE} />
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <Label>Product Name <span className="text-red-400">*</span></Label>
            <input {...register('name', { required: 'Required' })} className={inputCls(!!errors.name)} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Description <span className="text-red-400">*</span></Label>
            <textarea {...register('description', { required: 'Required' })} rows={3}
              className={`${inputCls(!!errors.description)} resize-none`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price ($) <span className="text-red-400">*</span></Label>
              <input type="number" step="0.01"
                {...register('price', { required: 'Required', valueAsNumber: true, min: 0 })}
                className={inputCls(!!errors.price)} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label>Stock <span className="text-red-400">*</span></Label>
              <input type="number"
                {...register('stock', { required: 'Required', valueAsNumber: true, min: 0 })}
                className={inputCls(!!errors.stock)} />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <Label>Image URL <span className="text-red-400">*</span></Label>
            <input {...register('image', { required: 'Required' })} placeholder="https://..."
              className={inputCls(!!errors.image)} />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>}
          </div>

          <div>
            <Label>Category <span className="text-red-400">*</span></Label>
            <input {...register('category', { required: 'Required' })}
              className={inputCls(!!errors.category)} />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rating (0–5)</Label>
              <input type="number" step="0.1" min="0" max="5"
                {...register('rating', { valueAsNumber: true, min: 0, max: 5 })}
                className={inputCls(!!errors.rating)} />
            </div>
            <div>
              <Label>Review Count</Label>
              <input type="number" min="0"
                {...register('reviews', { valueAsNumber: true, min: 0 })}
                className={inputCls(!!errors.reviews)} />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full btn-primary py-3 rounded-xl mt-2">
            {submitting
              ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />Saving…</>
              : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
