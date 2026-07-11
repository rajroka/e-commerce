'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { postProduct } from '@/app/api/products';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, AddCircleIcon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

const inputCls = (err = false) =>
  `w-full border ${err ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition-colors`;

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-gray-600 mb-1.5">{children}</label>
);

export default function AddProductPage() {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ProductFormData>();
  const [imageId,    setImageId]    = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ProductFormData) => {
    if (!data.image) { toast.error('Please upload a product image'); return; }
    setSubmitting(true);
    try {
      await postProduct(data);
      toast.success('Product added!');
      reset();
      setImageId('');
    } catch {
      toast.error('Failed to add product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <HugeiconsIcon icon={AddCircleIcon} size={22} color="#ef4444" strokeWidth={STROKE} />
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Image upload */}
          <div>
            <Label>Product Image <span className="text-red-400">*</span></Label>
            {imageId && (
              <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
                <CldImage src={imageId} alt="Product" width={480} height={300} className="w-full object-contain max-h-52" />
              </div>
            )}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned'}
              onSuccess={({ event, info }) => {
                if (event === 'success') {
                  const i = info as { public_id: string; secure_url: string };
                  setImageId(i.public_id);
                  setValue('image', i.secure_url, { shouldValidate: true });
                }
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  <HugeiconsIcon icon={Upload01Icon} size={15} color="white" strokeWidth={STROKE} />
                  {imageId ? 'Change Image' : 'Upload Image'}
                </button>
              )}
            </CldUploadWidget>
            <input type="hidden" {...register('image', { required: 'Image is required' })} />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>}
          </div>

          {/* Name */}
          <div>
            <Label>Product Name <span className="text-red-400">*</span></Label>
            <input {...register('name', { required: 'Required' })} placeholder="Enter product name" className={inputCls(!!errors.name)} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label>Description <span className="text-red-400">*</span></Label>
            <textarea {...register('description', { required: 'Required' })} rows={3} placeholder="Enter description"
              className={`${inputCls(!!errors.description)} resize-none`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price ($) <span className="text-red-400">*</span></Label>
              <input type="number" step="0.01" placeholder="0.00"
                {...register('price', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Min 0' } })}
                className={inputCls(!!errors.price)} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label>Stock <span className="text-red-400">*</span></Label>
              <input type="number" placeholder="0"
                {...register('stock', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Min 0' } })}
                className={inputCls(!!errors.stock)} />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>Category <span className="text-red-400">*</span></Label>
            <input {...register('category', { required: 'Required' })} placeholder="e.g. shirt, shoes, bag"
              className={inputCls(!!errors.category)} />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          {/* Rating + Reviews — removed from admin form (managed automatically) */}

          <button type="submit" disabled={submitting}
            className="w-full btn-primary py-3 rounded-xl mt-2">
            {submitting
              ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />Adding…</>
              : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
