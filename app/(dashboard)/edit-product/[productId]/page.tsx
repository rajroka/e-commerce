'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, LoaderPinwheelIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import TagInput from '@/components/ui/TagInput';

const STROKE = 1.5;

type ProductFormData = {
  name:           string;
  description:    string;
  price:          number;
  image:          string;
  category:       string;
  stock:          number;
  rating:         number;
  reviews:        number;
  discountPct:    number;
  discountEndsAt: string;
};

const inputCls = (err = false) =>
  `w-full border ${err ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition-colors`;

const Lbl = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-gray-600 mb-1.5">{children}</label>
);

export default function EditProductPage() {
  const { productId } = useParams() as { productId: string };
  const router        = useRouter();

  const [fetching,   setFetching]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [colors,     setColors]     = useState<string[]>([]);
  const [sizes,      setSizes]      = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(product => {
        reset({
          name:           product.name        ?? '',
          description:    product.description ?? '',
          price:          product.price       ?? 0,
          image:          product.image       ?? '',
          category:       product.category    ?? '',
          stock:          product.stock       ?? 0,
          rating:         product.rating      ?? 0,
          reviews:        product.reviewCount ?? product.reviews ?? 0,
          discountPct:    product.discountPct    ?? 0,
          discountEndsAt: product.discountEndsAt
            ? new Date(product.discountEndsAt).toISOString().slice(0, 16)
            : '',
        });
        setColors(product.colors ?? []);
        setSizes(product.sizes   ?? []);
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
          name:           data.name,
          description:    data.description,
          price:          data.price,
          image:          data.image,
          category:       data.category,
          stock:          data.stock,
          rating:         data.rating,
          reviewCount:    data.reviews,
          colors,
          sizes,
          discountPct:    data.discountPct    || 0,
          discountEndsAt: data.discountEndsAt || null,
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
            <Lbl>Product Name <span className="text-red-400">*</span></Lbl>
            <input {...register('name', { required: 'Required' })} className={inputCls(!!errors.name)} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Lbl>Description <span className="text-red-400">*</span></Lbl>
            <textarea {...register('description', { required: 'Required' })} rows={3}
              className={`${inputCls(!!errors.description)} resize-none`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl>Price ($) <span className="text-red-400">*</span></Lbl>
              <input type="number" step="0.01"
                {...register('price', { required: 'Required', valueAsNumber: true, min: 0 })}
                className={inputCls(!!errors.price)} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Lbl>Stock <span className="text-red-400">*</span></Lbl>
              <input type="number"
                {...register('stock', { required: 'Required', valueAsNumber: true, min: 0 })}
                className={inputCls(!!errors.stock)} />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <Lbl>Image URL <span className="text-red-400">*</span></Lbl>
            <input {...register('image', { required: 'Required' })} placeholder="https://…"
              className={inputCls(!!errors.image)} />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>}
          </div>

          <div>
            <Lbl>Category <span className="text-red-400">*</span></Lbl>
            <input {...register('category', { required: 'Required' })}
              className={inputCls(!!errors.category)} />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl>Rating (0–5)</Lbl>
              <input type="number" step="0.1" min="0" max="5"
                {...register('rating', { valueAsNumber: true, min: 0, max: 5 })}
                className={inputCls(!!errors.rating)} />
            </div>
            <div>
              <Lbl>Review Count</Lbl>
              <input type="number" min="0"
                {...register('reviews', { valueAsNumber: true, min: 0 })}
                className={inputCls(!!errors.reviews)} />
            </div>
          </div>

          {/* ── Variants ── */}
          <div className="space-y-4 pt-1 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3">
              Variants <span className="font-normal normal-case text-gray-400">(optional)</span>
            </p>
            <TagInput
              label="Available Colors"
              placeholder="e.g. Red, Blue, Black…"
              tags={colors}
              onChange={setColors}
              hint="Press Enter or comma to add. Leave empty if not applicable."
            />
            <TagInput
              label="Available Sizes"
              placeholder="e.g. S, M, L, XL or 38, 40, 42…"
              tags={sizes}
              onChange={setSizes}
              hint="Press Enter or comma to add. Leave empty if not applicable."
            />
          </div>

          {/* ── Discount ── */}
          <div className="space-y-4 pt-1 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3">
              Discount <span className="font-normal normal-case text-gray-400">(optional)</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Lbl>Discount %</Lbl>
                <input type="number" min="0" max="100" step="1" placeholder="0"
                  {...register('discountPct', { valueAsNumber: true, min: 0, max: 100 })}
                  className={inputCls()} />
                <p className="text-xs text-gray-400 mt-1">0 = no discount</p>
              </div>
              <div>
                <Lbl>Ends At</Lbl>
                <input type="datetime-local"
                  {...register('discountEndsAt')}
                  className={inputCls()} />
                <p className="text-xs text-gray-400 mt-1">Leave empty for permanent</p>
              </div>
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
