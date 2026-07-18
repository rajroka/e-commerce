'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Save, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PASSWORD_RULES, passwordStrength, STRENGTH_LABEL, STRENGTH_COLOR } from '@/lib/password';

interface FormValues {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
}

export default function SecurityTab() {
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>();
  const newPw    = watch('newPassword', '');
  const strength = passwordStrength(newPw);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const res  = await fetch('/api/user/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to change password'); return; }
      toast.success('Password updated. Other devices have been signed out.');
      reset();
    } catch { toast.error('Network error — please try again'); }
    finally { setSaving(false); }
  };

  const toggle = (f: keyof typeof showPw) => setShowPw(p => ({ ...p, [f]: !p[f] }));

  const PwField = ({ field, label, errorMsg }: { field: 'current' | 'next' | 'confirm'; label: string; errorMsg?: string }) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={showPw[field] ? 'text' : 'password'}
          autoComplete={field === 'current' ? 'current-password' : 'new-password'}
          aria-invalid={!!errorMsg}
          className="pr-10"
          {...(field === 'current'
            ? register('currentPassword', { required: 'Required' })
            : field === 'next'
            ? register('newPassword', {
                required: 'Required',
                validate: {
                  differsFromCurrent: v => v !== watch('currentPassword') || 'Must differ from current password',
                  strong: v => { for (const r of PASSWORD_RULES) { if (!r.test(v)) return `Must include: ${r.label.toLowerCase()}.`; } return true; },
                },
              })
            : register('confirmPassword', { required: 'Required', validate: v => v === newPw || 'Passwords do not match' })
          )}
        />
        <button type="button" onClick={() => toggle(field)}
          aria-label={showPw[field] ? 'Hide' : 'Show'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield size={16} className="text-muted-foreground" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <PwField field="current" label="Current Password" errorMsg={errors.currentPassword?.message} />
            <div>
              <PwField field="next" label="New Password" errorMsg={errors.newPassword?.message} />
              {newPw.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {PASSWORD_RULES.map((_, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLOR[strength] : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{STRENGTH_LABEL[strength]}</p>
                  <ul className="space-y-0.5">
                    {PASSWORD_RULES.map(rule => {
                      const ok = rule.test(newPw);
                      return (
                        <li key={rule.id} className={`text-[11px] flex items-center gap-1.5 ${ok ? 'text-green-500' : 'text-muted-foreground'}`}>
                          <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${ok ? 'bg-green-500' : 'bg-gray-200'}`} />
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <PwField field="confirm" label="Confirm New Password" errorMsg={errors.confirmPassword?.message} />
            <Button type="submit" disabled={saving} className="bg-red-500 hover:bg-red-600 text-white rounded-full gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Update Password</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield size={16} className="text-muted-foreground" /> Account Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {[
              { label: 'Email verified',            badge: 'Verified',     variant: 'default'    as const },
              { label: 'Two-factor authentication', badge: 'Not enabled',  variant: 'secondary'  as const },
              { label: 'Active sessions',           badge: 'This device',  variant: 'outline'    as const },
            ].map((row, idx, arr) => (
              <div key={row.label}>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <Badge variant={row.variant}>{row.badge}</Badge>
                </div>
                {idx < arr.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


