'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { postProduct } from '@/app/api/products';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, AddCircleIcon } from '@hugeicons/core-free-icons';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import TagInput from '@/components/ui/TagInput';
import { Loader2 } from 'lucide-react';

const STROKE = 1.5;

const SPORT_CATEGORIES = [
  { value: 'football',       label: '⚽ Football / Soccer' },
  { value: 'basketball',     label: '🏀 Basketball' },
  { value: 'cricket',        label: '🏏 Cricket' },
  { value: 'tennis',         label: '🎾 Tennis' },
  { value: 'badminton',      label: '🏸 Badminton' },
  { value: 'running',        label: '🏃 Running' },
  { value: 'cycling',        label: '🚴 Cycling' },
  { value: 'swimming',       label: '🏊 Swimming' },
  { value: 'gym-fitness',    label: '🏋️ Gym & Fitness' },
  { value: 'yoga',           label: '🧘 Yoga & Pilates' },
  { value: 'boxing-mma',     label: '🥊 Boxing & MMA' },
  { value: 'hiking-outdoor', label: '🥾 Hiking & Outdoor' },
  { value: 'team-sports',    label: '🏅 Team Sports' },
  { value: 'water-sports',   label: '🏄 Water Sports' },
  { value: 'winter-sports',  label: '⛷️ Winter Sports' },
  { value: 'apparel',        label: '👕 Sports Apparel' },
  { value: 'footwear',       label: '👟 Sports Footwear' },
  { value: 'accessories',    label: '🎒 Accessories & Gear' },
  { value: 'nutrition',      label: '💊 Nutrition & Supplements' },
  { value: 'other',          label: '🏆 Other' },
];

type ProductFormData = {
  name:            string;
  description:     string;
  price:           number;
  image:           string;
  category:        string;
  stock:           number;
  discountPct:     number;
  discountEndsAt:  string;
};

export default function AddProductPage() {
  const {
    register, handleSubmit, control,
    formState: { errors }, setValue, reset,
  } = useForm<ProductFormData>();

  const [imageId,    setImageId]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [colors,     setColors]     = useState<string[]>([]);
  const [sizes,      setSizes]      = useState<string[]>([]);

  const onSubmit = async (data: ProductFormData) => {
    if (!data.image) { toast.error('Please upload a product image'); return; }
    setSubmitting(true);
    try {
      await postProduct({ ...data, colors, sizes, discountPct: data.discountPct || 0, discountEndsAt: data.discountEndsAt || null });
      toast.success('Product added successfully!');
      reset();
      setImageId('');
      setColors([]);
      setSizes([]);
    } catch {
      toast.error('Failed to add product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Fill in the product details. All fields marked <span className="text-red-400">*</span> are required.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── Image upload ── */}
            <div className="space-y-1.5">
              <Label>Product Image <span className="text-red-400">*</span></Label>
              {imageId && (
                <div className="mb-3 rounded-xl overflow-hidden">
                  <CldImage
                    src={imageId} alt="Product preview"
                    width={480} height={300}
                    className="w-full object-contain max-h-52 rounded-xl"
                  />
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

            {/* ── Product name ── */}
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Product Name <span className="text-red-400">*</span></Label>
              <Input
                id="p-name"
                placeholder="e.g. Nike Air Zoom Pegasus Running Shoes"
                {...register('name', { required: 'Required' })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* ── Description ── */}
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Description <span className="text-red-400">*</span></Label>
              <Textarea
                id="p-desc"
                rows={3}
                placeholder="Describe the product — materials, features, suitable for…"
                {...register('description', { required: 'Required' })}
                aria-invalid={!!errors.description}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            {/* ── Category dropdown ── */}
            <div className="space-y-1.5">
              <Label>Category <span className="text-red-400">*</span></Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Please select a category' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className={`w-full ${errors.category ? 'border-red-400' : ''}`}>
                      <SelectValue placeholder="Select a sports category…" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {SPORT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            {/* ── Price + Stock ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price ($) <span className="text-red-400">*</span></Label>
                <Input
                  id="p-price" type="number" step="0.01" placeholder="0.00"
                  {...register('price', {
                    required: 'Required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Min $0' },
                  })}
                  aria-invalid={!!errors.price}
                />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-stock">Stock <span className="text-red-400">*</span></Label>
                <Input
                  id="p-stock" type="number" placeholder="0"
                  {...register('stock', {
                    required: 'Required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Min 0' },
                  })}
                  aria-invalid={!!errors.stock}
                />
                {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            {/* ── Variants ── */}
            <div className="space-y-4 pt-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Variants <span className="font-normal normal-case text-gray-400">(optional)</span>
              </p>
              <TagInput
                label="Available Colors"
                placeholder="e.g. Red, Blue, Black…"
                tags={colors}
                onChange={setColors}
                hint="Type a color and press Enter or comma to add. Leave empty if not applicable."
              />
              <TagInput
                label="Available Sizes"
                placeholder="e.g. S, M, L, XL or 38, 40, 42…"
                tags={sizes}
                onChange={setSizes}
                hint="Type a size and press Enter or comma to add. Leave empty if not applicable."
              />
            </div>

            {/* ── Discount ── */}
            <div className="space-y-4 pt-1 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3">
                Discount <span className="font-normal normal-case text-gray-400">(optional)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="p-discount">Discount %</Label>
                  <Input
                    id="p-discount" type="number" min="0" max="100" step="1" placeholder="0"
                    {...register('discountPct', { valueAsNumber: true, min: 0, max: 100 })}
                  />
                  <p className="text-xs text-gray-400">0 = no discount</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-discount-ends">Ends At</Label>
                  <Input
                    id="p-discount-ends" type="datetime-local"
                    {...register('discountEndsAt')}
                  />
                  <p className="text-xs text-gray-400">Leave empty for permanent</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" />Adding product…</>
                : <><HugeiconsIcon icon={AddCircleIcon} size={15} color="white" strokeWidth={STROKE} />Add Product</>
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
