'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  LockPasswordIcon, EyeIcon, EyeOffIcon,
  LoaderPinwheelIcon, Shield01Icon, FloppyDiskIcon,
} from '@hugeicons/core-free-icons';
import {
  PASSWORD_RULES, passwordStrength,
  STRENGTH_LABEL, STRENGTH_COLOR,
} from '@/lib/password';

const STROKE = 1.5;

interface FormValues {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
}

export default function SecurityTab() {
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const {
    register, handleSubmit, watch, reset,
    formState: { errors },
  } = useForm<FormValues>();

  const newPw    = watch('newPassword', '');
  const strength = passwordStrength(newPw);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const res  = await fetch('/api/user/password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to change password'); return; }
      toast.success('Password updated. Other devices have been signed out.');
      reset();
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setSaving(false);
    }
  };

  const toggle = (f: keyof typeof showPw) => setShowPw((p) => ({ ...p, [f]: !p[f] }));

  // Reusable password input component
  const PwField = ({
    field, label, errorMsg,
  }: {
    field:    'current' | 'next' | 'confirm';
    label:    string;
    errorMsg?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPw[field] ? 'text' : 'password'}
          autoComplete={field === 'current' ? 'current-password' : 'new-password'}
          {...(field === 'current'
            ? register('currentPassword', { required: 'Required' })
            : field === 'next'
            ? register('newPassword', {
                required: 'Required',
                validate: {
                  differsFromCurrent: (v) =>
                    v !== watch('currentPassword') || 'Must differ from your current password',
                  strong: (v) => {
                    for (const rule of PASSWORD_RULES) {
                      if (!rule.test(v)) return `Password must include: ${rule.label.toLowerCase()}.`;
                    }
                    return true;
                  },
                },
              })
            : register('confirmPassword', {
                required: 'Required',
                validate: (v) => v === newPw || 'Passwords do not match',
              }))}
          className={`w-full border ${
            errorMsg ? 'border-red-400' : 'border-gray-200'
          } rounded-xl px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors`}
        />
        <button
          type="button"
          onClick={() => toggle(field)}
          aria-label={showPw[field] ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <HugeiconsIcon icon={showPw[field] ? EyeOffIcon : EyeIcon} size={15} color="currentColor" strokeWidth={STROKE} />
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* ── Change Password ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <HugeiconsIcon icon={LockPasswordIcon} size={16} color="#9ca3af" strokeWidth={STROKE} />
          <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <PwField field="current" label="Current Password" errorMsg={errors.currentPassword?.message} />

          {/* New password + strength meter */}
          <div>
            <PwField field="next" label="New Password" errorMsg={errors.newPassword?.message} />
            {newPw.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {/* Strength bar */}
                <div className="flex gap-1">
                  {PASSWORD_RULES.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        i < strength ? STRENGTH_COLOR[strength] : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">{STRENGTH_LABEL[strength]}</p>

                {/* Per-rule checklist */}
                <ul className="space-y-0.5">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(newPw);
                    return (
                      <li
                        key={rule.id}
                        className={`text-[11px] flex items-center gap-1.5 ${ok ? 'text-green-500' : 'text-gray-400'}`}
                      >
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

          <div className="pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60"
            >
              {saving ? (
                <><HugeiconsIcon icon={LoaderPinwheelIcon} size={14} color="white" strokeWidth={STROKE} className="animate-spin" />Saving…</>
              ) : (
                <><HugeiconsIcon icon={FloppyDiskIcon} size={14} color="white" strokeWidth={STROKE} />Update Password</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Account Security info ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={Shield01Icon} size={16} color="#9ca3af" strokeWidth={STROKE} />
          <h3 className="text-sm font-semibold text-gray-900">Account Security</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          {[
            { label: 'Email verified',            badge: 'Verified',    color: 'bg-green-50 text-green-600' },
            { label: 'Two-factor authentication', badge: 'Not enabled', color: 'bg-gray-50 text-gray-400'  },
            { label: 'Active sessions',           badge: 'This device', color: ''                           },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span>{row.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.color}`}>{row.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
