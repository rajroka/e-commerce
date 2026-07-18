'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Camera, Loader2, Save } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { UserProfile } from './types';

const STROKE = 1.5;
interface Props { profile: UserProfile; onUpdate: (updated: Partial<UserProfile>) => void; }
interface FormValues { name: string; phone: string; bio: string; dateOfBirth: string; gender: string; }

export default function PersonalInfoTab({ profile, onUpdate }: Props) {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [preview,       setPreview]       = useState<string | null>(null);
  const [gender,        setGender]        = useState(profile.gender ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isDirty }, setValue } = useForm<FormValues>({
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
      const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
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
      const payload = { ...values, gender };
      const res  = await fetch('/api/user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
      <Card>
        <CardHeader><CardTitle className="text-sm">Profile Photo</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              {avatarSrc
                ? <Image src={avatarSrc} alt={profile.name} width={80} height={80} className="rounded-full ring-2 ring-border object-cover w-20 h-20" />
                : <div className="w-20 h-20 rounded-full border-2 border-border flex items-center justify-center">
                    <HugeiconsIcon icon={UserIcon} size={30} color="#9ca3af" strokeWidth={STROKE} />
                  </div>
              }
              {avatarLoading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin text-white" />
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} disabled={avatarLoading}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors disabled:opacity-60">
                <Camera size={13} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{profile.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
              <button onClick={() => fileRef.current?.click()} disabled={avatarLoading}
                className="mt-2 text-xs text-red-500 hover:underline font-medium disabled:opacity-50">
                {avatarLoading ? 'Uploading…' : 'Change photo'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Personal Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pi-name">Full Name <span className="text-red-400">*</span></Label>
                <Input id="pi-name" {...register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' }, maxLength: { value: 60, message: 'Max 60 chars' } })} aria-invalid={!!errors.name} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pi-phone">Phone Number</Label>
                <Input id="pi-phone" type="tel" placeholder="+1 555 000 0000"
                  {...register('phone', { pattern: { value: /^\+?[\d\s\-()]{0,20}$/, message: 'Invalid phone format' } })} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pi-dob">Date of Birth</Label>
                <Input id="pi-dob" type="date" max={new Date().toISOString().slice(0, 10)} {...register('dateOfBirth')} />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={v => { setGender(v); setValue('gender', v, { shouldDirty: true }); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prefer not to say" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Prefer not to say</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pi-bio">Bio</Label>
              <Textarea id="pi-bio" rows={3} placeholder="Tell us a little about yourself…" maxLength={300}
                {...register('bio', { maxLength: { value: 300, message: 'Max 300 characters' } })} />
              {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input type="email" value={profile.email} readOnly disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saving || !isDirty} className="bg-red-500 hover:bg-red-600 text-white rounded-full gap-2">
                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save Changes</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


