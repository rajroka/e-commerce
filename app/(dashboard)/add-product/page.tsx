'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { postProduct } from '@/app/api/products';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, AddCircleIcon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const STROKE = 1.5;

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

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
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <HugeiconsIcon icon={AddCircleIcon} size={22} color="#ef4444" strokeWidth={STROKE} />
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label>Product Image <span className="text-red-400">*</span></Label>
              {imageId && (
                <div className="mb-3 rounded-xl overflow-hidden border border-border">
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
                  <Button type="button" variant="secondary" onClick={() => open()}>
                    <HugeiconsIcon icon={Upload01Icon} size={15} color="currentColor" strokeWidth={STROKE} />
                    {imageId ? 'Change Image' : 'Upload Image'}
                  </Button>
                )}
              </CldUploadWidget>
              <input type="hidden" {...register('image', { required: 'Image is required' })} />
              {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Product Name <span className="text-red-400">*</span></Label>
              <Input id="p-name" {...register('name', { required: 'Required' })}
                placeholder="Enter product name" aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Description <span className="text-red-400">*</span></Label>
              <Textarea id="p-desc" {...register('description', { required: 'Required' })}
                rows={3} placeholder="Enter description" aria-invalid={!!errors.description} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price ($) <span className="text-red-400">*</span></Label>
                <Input id="p-price" type="number" step="0.01" placeholder="0.00"
                  {...register('price', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Min 0' } })}
                  aria-invalid={!!errors.price} />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-stock">Stock <span className="text-red-400">*</span></Label>
                <Input id="p-stock" type="number" placeholder="0"
                  {...register('stock', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Min 0' } })}
                  aria-invalid={!!errors.stock} />
                {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="p-cat">Category <span className="text-red-400">*</span></Label>
              <Input id="p-cat" {...register('category', { required: 'Required' })}
                placeholder="e.g. shirt, shoes, bag" aria-invalid={!!errors.category} />
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">
              {submitting
                ? <><Loader2 size={15} className="animate-spin" />Adding…</>
                : <><HugeiconsIcon icon={AddCircleIcon} size={15} color="white" strokeWidth={STROKE} />Add Product</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
