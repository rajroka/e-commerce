'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { BellIcon, Mail01Icon, SmartPhone01Icon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import type { Notifications } from './types';

const STROKE = 1.5;
interface Props { notifications: Notifications; onUpdate: (n: Notifications) => void; }

export default function NotificationsTab({ notifications, onUpdate }: Props) {
  const [saving, setSaving] = useState<string | null>(null);

  const toggle = async (key: keyof Notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setSaving(key);
    try {
      const res  = await fetch('/api/user/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [key]: next[key] }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to update'); return; }
      onUpdate(next);
    } catch { toast.error('Network error'); }
    finally { setSaving(null); }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <Toggle icon={<HugeiconsIcon icon={Mail01Icon} size={16} color="#9ca3af" strokeWidth={STROKE} />}
            label="Email notifications" description="Receive updates via email"
            checked={notifications.emailEnabled} loading={saving === 'emailEnabled'} onChange={() => toggle('emailEnabled')} />
          <Toggle icon={<HugeiconsIcon icon={SmartPhone01Icon} size={16} color="#9ca3af" strokeWidth={STROKE} />}
            label="Push notifications" description="Browser push notifications"
            checked={notifications.pushEnabled} loading={saving === 'pushEnabled'} onChange={() => toggle('pushEnabled')} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={BellIcon} size={16} color="#9ca3af" strokeWidth={STROKE} />
          <h3 className="text-sm font-semibold text-gray-900">What to notify me about</h3>
        </div>
        <div className="space-y-4">
          {([
            { key: 'orderUpdates',  label: 'Order updates',      desc: 'Shipping, delivery, and status changes' },
            { key: 'promotions',    label: 'Promotions & offers', desc: 'Exclusive discounts and sales' },
            { key: 'newArrivals',   label: 'New arrivals',        desc: 'Be first to know about new products' },
            { key: 'priceDrops',    label: 'Price drops',         desc: 'Alerts when wishlist items go on sale' },
          ] as { key: keyof Notifications; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <Toggle key={key} label={label} description={desc}
              checked={notifications[key]} loading={saving === key} onChange={() => toggle(key)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ icon, label, description, checked, loading, onChange }: {
  icon?: React.ReactNode; label: string; description: string;
  checked: boolean; loading: boolean; onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button onClick={onChange} disabled={loading} role="switch" aria-checked={checked}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-60 ${checked ? 'bg-red-500' : 'bg-gray-200'}`}>
        {loading
          ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={12} color="white" strokeWidth={1.5} className="absolute inset-0 m-auto animate-spin" />
          : <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />}
      </button>
    </div>
  );
}


