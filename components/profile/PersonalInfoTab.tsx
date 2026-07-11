'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Camera01Icon, FloppyDiskIcon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import type { UserProfile } from './types';

const STROKE = 1.5;

interface Props { profile: UserProfile; onUpdate: (updated: Partial<UserProfile>) => void; }
interface FormValues { name: string; phone: string; bio: string; dateOfBirth: string; gender: string; }

export default function PersonalInfoTab({ profile, onUpdate }: Props) {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [preview,       setPreview]       = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    defaultValues: { name: profile.name ?? '', phone: profile.phone ?? '', bio: profile.bio ?? '', dateOfBirth: profile.dateOfBirth ?? '', gender: profile.gender ?? '' },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast.error('Image must be under 4 MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setAvatarLoading(true);
    try {
      const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'gg_shop_avatars';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'gg-shop/avatars');
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? 'Upload failed');
      const patchRes = await fetch('/api/user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: data.secure_url }) });
      if (!patchRes.ok) throw new Error('Failed to save avatar');
      onUpdate({ image: data.secure_url });
      toast.success('Profile photo updated');
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed');
      setPreview(null);
    } finally {
      setAvatarLoading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const res  = await fetch('/api/user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to save changes'); return; }
      onUpdate(data);
      toast.success('Profile updated');
    } catch { toast.error('Network error — please try again'); }
    finally { setSaving(false); }
  };

  const avatarSrc = preview ?? profile.image ?? null;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">Profile Photo</h3>
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {avatarSrc
              ? <Image src={avatarSrc} alt={profile.name} width={80} height={80} className="rounded-full ring-4 ring-red-100 object-cover w-20 h-20" />
              : <div className="w-20 h-20 rounded-full bg-red-50 ring-4 ring-red-100 flex items-center justify-center">
                  <HugeiconsIcon icon={UserIcon} size={30} color="#fca5a5" strokeWidth={STROKE} />
                </div>}
            {avatarLoading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <HugeiconsIcon icon={LoaderPinwheelIcon} size={18} color="white" strokeWidth={STROKE} className="animate-spin" />
              </div>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={avatarLoading} aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors disabled:opacity-60">
              <HugeiconsIcon icon={Camera01Icon} size={13} color="white" strokeWidth={STROKE} />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{profile.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
            <button onClick={() => fileRef.current?.click()} disabled={avatarLoading}
              className="mt-2 text-xs text-red-500 hover:underline font-medium disabled:opacity-50">
              {avatarLoading ? 'Uploading…' : 'Change photo'}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">Personal Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="p-name">Full Name <span className="text-red-400">*</span></label>
              <input id="p-name" type="text" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' }, maxLength: { value: 60, message: 'Max 60 characters' } })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="p-phone">Phone Number</label>
              <input id="p-phone" type="tel" placeholder="+1 555 000 0000" {...register('phone', { pattern: { value: /^\+?[\d\s\-()]{0,20}$/, message: 'Invalid phone format' } })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="p-dob">Date of Birth</label>
              <input id="p-dob" type="date" max={new Date().toISOString().slice(0, 10)} {...register('dateOfBirth')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="p-gender">Gender</label>
              <select id="p-gender" {...register('gender')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors bg-white">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="p-bio">Bio</label>
            <textarea id="p-bio" rows={3} placeholder="Tell us a little about yourself…" maxLength={300}
              {...register('bio', { maxLength: { value: 300, message: 'Max 300 characters' } })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors resize-none" />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
            <input type="email" value={profile.email} readOnly
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={saving || !isDirty}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {saving
                ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={14} color="white" strokeWidth={STROKE} className="animate-spin" />Saving…</>
                : <><HugeiconsIcon icon={FloppyDiskIcon} size={14} color="white" strokeWidth={STROKE} />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
