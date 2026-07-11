'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { AddCircleIcon, Edit01Icon, Delete01Icon, MapPinIcon, LoaderPinwheelIcon, CheckIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import type { Address } from './types';

const STROKE = 1.5;
interface Props { addresses: Address[]; onUpdate: (addresses: Address[]) => void; }
type FormValues = Omit<Address, 'id' | 'isDefault'> & { isDefault: boolean };
const EMPTY: FormValues = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '', isDefault: false };
const LABELS = ['Home', 'Work', 'Other'];

export default function AddressesTab({ addresses, onUpdate }: Props) {
  const [editing,  setEditing]  = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: EMPTY });

  const openNew  = () => { reset(EMPTY); setEditing('new'); };
  const openEdit = (a: Address) => { reset({ ...a }); setEditing(a.id); };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const method = editing === 'new' ? 'POST' : 'PATCH';
      const body   = editing === 'new' ? values : { id: editing, ...values };
      const res    = await fetch('/api/user/addresses', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data   = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      const list = await (await fetch('/api/user/addresses')).json();
      onUpdate(list.addresses ?? []);
      toast.success(editing === 'new' ? 'Address added' : 'Address updated');
      setEditing(null);
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Failed to delete'); return; }
      onUpdate(addresses.filter(a => a.id !== id));
      toast.success('Address removed');
    } catch { toast.error('Network error'); }
    finally { setDeleting(null); }
  };

  const setAsDefault = async (id: string) => {
    const res = await fetch('/api/user/addresses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isDefault: true }) });
    if (!res.ok) { toast.error('Failed to set default'); return; }
    onUpdate(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  const cls = (err = false) => `w-full border ${err ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition-colors`;

  return (
    <div className="space-y-4">
      {/* Cards */}
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-white rounded-2xl border shadow-sm p-5 relative ${addr.isDefault ? 'border-red-300' : 'border-gray-100'}`}>
              {addr.isDefault && <span className="absolute top-3 right-3 text-[10px] font-semibold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Default</span>}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HugeiconsIcon icon={MapPinIcon} size={14} color="#9ca3af" strokeWidth={STROKE} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">{addr.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{addr.fullName}</p>
                  {addr.phone && <p className="text-xs text-gray-500">{addr.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                    {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}<br />{addr.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                {!addr.isDefault && <button onClick={() => setAsDefault(addr.id)} className="text-xs text-gray-500 hover:text-red-500 font-medium transition-colors">Set as default</button>}
                <button onClick={() => openEdit(addr)} aria-label="Edit address" className="ml-auto p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <HugeiconsIcon icon={Edit01Icon} size={14} color="currentColor" strokeWidth={STROKE} />
                </button>
                <button onClick={() => handleDelete(addr.id)} disabled={deleting === addr.id} aria-label="Delete address" className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
                  {deleting === addr.id
                    ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={14} color="currentColor" strokeWidth={STROKE} className="animate-spin" />
                    : <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={STROKE} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {addresses.length === 0 && editing !== 'new' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <HugeiconsIcon icon={MapPinIcon} size={22} color="#d1d5db" strokeWidth={STROKE} />
          </div>
          <p className="text-sm font-medium text-gray-500">No saved addresses yet</p>
        </div>
      )}

      {/* Form */}
      {editing !== null && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">{editing === 'new' ? 'Add New Address' : 'Edit Address'}</h3>
            <button onClick={() => setEditing(null)} className="p-1 text-gray-400 hover:text-gray-700">
              <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Label</label>
              <div className="flex gap-3">
                {LABELS.map(l => (
                  <label key={l} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" value={l} {...register('label')} className="accent-red-500" />
                    <span className="text-sm text-gray-700">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F label="Full Name *" error={errors.fullName?.message}><input {...register('fullName', { required: 'Required' })} placeholder="Jane Smith" className={cls(!!errors.fullName)} /></F>
              <F label="Phone"><input {...register('phone')} placeholder="+1 555 000 0000" className={cls()} /></F>
              <F label="Address Line 1 *" error={errors.line1?.message} className="sm:col-span-2"><input {...register('line1', { required: 'Required' })} placeholder="123 Main St" className={cls(!!errors.line1)} /></F>
              <F label="Address Line 2" className="sm:col-span-2"><input {...register('line2')} placeholder="Apt 4B" className={cls()} /></F>
              <F label="City *" error={errors.city?.message}><input {...register('city', { required: 'Required' })} placeholder="New York" className={cls(!!errors.city)} /></F>
              <F label="State / Province"><input {...register('state')} placeholder="NY" className={cls()} /></F>
              <F label="Postal Code *" error={errors.postalCode?.message}><input {...register('postalCode', { required: 'Required' })} placeholder="10001" className={cls(!!errors.postalCode)} /></F>
              <F label="Country *" error={errors.country?.message}><input {...register('country', { required: 'Required' })} placeholder="United States" className={cls(!!errors.country)} /></F>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isDefault')} className="accent-red-500 w-4 h-4" />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60">
                {saving
                  ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={13} color="white" strokeWidth={STROKE} className="animate-spin" />Saving…</>
                  : <><HugeiconsIcon icon={CheckIcon} size={13} color="white" strokeWidth={STROKE} />{editing === 'new' ? 'Add Address' : 'Save Changes'}</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add button */}
      {editing === null && addresses.length < 5 && (
        <button onClick={openNew} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500 rounded-2xl text-sm font-medium transition-colors">
          <HugeiconsIcon icon={AddCircleIcon} size={16} color="currentColor" strokeWidth={STROKE} /> Add New Address
        </button>
      )}
    </div>
  );
}

function F({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string; }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
