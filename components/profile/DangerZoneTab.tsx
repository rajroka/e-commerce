'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signOut } from '@/lib/auth-client';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertDiamondIcon, LoaderPinwheelIcon, EyeIcon, EyeOffIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;
type DeleteForm = { password: string; confirmText: string };

export default function DangerZoneTab() {
  const router = useRouter();
  const [showDelete,   setShowDelete]   = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showPw,       setShowPw]       = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DeleteForm>();
  const confirmText = watch('confirmText', '');

  const handleDeactivate = async () => {
    if (!confirm('Deactivate your account? You can reactivate by signing back in.')) return;
    setDeactivating(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'PATCH' });
      if (!res.ok) { toast.error('Failed to deactivate'); return; }
      await signOut({ fetchOptions: { onSuccess: () => router.push('/') } });
    } catch { toast.error('Network error'); }
    finally { setDeactivating(false); }
  };

  const onDelete = async (values: DeleteForm) => {
    if (values.confirmText !== 'DELETE MY ACCOUNT') { toast.error('Please type the confirmation text exactly'); return; }
    setDeleting(true);
    try {
      const res  = await fetch('/api/user/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: values.password, confirmText: values.confirmText }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to delete account'); return; }
      await signOut({ fetchOptions: { onSuccess: () => router.push('/') } });
    } catch { toast.error('Network error'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      {/* Deactivate */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <HugeiconsIcon icon={AlertDiamondIcon} size={18} color="#f59e0b" strokeWidth={STROKE} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Deactivate Account</h3>
            <p className="text-xs text-gray-500 mt-1">Temporarily hide your account. You can reactivate by signing back in.</p>
          </div>
        </div>
        <button onClick={handleDeactivate} disabled={deactivating}
          className="inline-flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 hover:bg-amber-50 text-sm font-semibold rounded-full transition-colors disabled:opacity-60">
          {deactivating
            ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={13} color="currentColor" strokeWidth={STROKE} className="animate-spin" />Deactivating…</>
            : 'Deactivate Account'}
        </button>
      </div>

      {/* Delete */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <HugeiconsIcon icon={AlertDiamondIcon} size={18} color="#ef4444" strokeWidth={STROKE} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Delete Account</h3>
            <p className="text-xs text-gray-500 mt-1">Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
        </div>

        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors">
            Delete My Account
          </button>
        ) : (
          <form onSubmit={handleSubmit(onDelete)} className="space-y-4 max-w-md mt-4 border-t border-red-100 pt-4">
            <p className="text-xs text-red-600 font-medium">
              Type <strong>DELETE MY ACCOUNT</strong> below and enter your password to confirm.
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirmation Text</label>
              <input type="text" placeholder="DELETE MY ACCOUNT" {...register('confirmText', { required: true })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 font-mono" />
              {confirmText && confirmText !== 'DELETE MY ACCOUNT' && <p className="text-xs text-red-400 mt-1">Text does not match</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} {...register('password', { required: 'Password required' })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-400" />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <HugeiconsIcon icon={showPw ? EyeOffIcon : EyeIcon} size={15} color="currentColor" strokeWidth={STROKE} />
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={deleting || confirmText !== 'DELETE MY ACCOUNT'}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50">
                {deleting
                  ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={13} color="white" strokeWidth={STROKE} className="animate-spin" />Deleting…</>
                  : 'Permanently Delete'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
