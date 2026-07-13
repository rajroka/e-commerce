'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon, Mail01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const STROKE = 1.5;

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  image?: string;
};

function UserAvatar({ name, image }: { name: string; image?: string }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
      {image
        ? <img src={image} alt={name} className="w-full h-full object-cover" />
        : <span className="text-xs font-bold text-gray-500">{initials}</span>
      }
    </div>
  );
}

export default function AllUsersPage() {
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">

      {/* Summary */}
      {!loading && (
        <p className="text-xs text-gray-400">{users.length} total customer{users.length !== 1 ? 's' : ''}</p>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header row */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-x-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Customer</span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide hidden md:block">Email</span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Role</span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide hidden lg:block">Joined</span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Action</span>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No customers yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map(user => (
              <div
                key={user._id}
                className="grid grid-cols-[1fr_1fr_auto_auto] md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-x-4 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar name={user.name ?? ''} image={user.image} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name ?? '—'}</p>
                    <p className="text-xs text-gray-400 truncate md:hidden">{user.email}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="hidden md:flex items-center gap-1.5 min-w-0">
                  <HugeiconsIcon icon={Mail01Icon} size={12} color="#9ca3af" strokeWidth={STROKE} />
                  <span className="text-sm text-gray-500 truncate">{user.email}</span>
                </div>

                {/* Role badge */}
                <div>
                  <Badge
                    variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                    className="gap-1 capitalize text-[11px]"
                  >
                    {user.role === 'admin' && (
                      <HugeiconsIcon icon={Shield01Icon} size={9} color="currentColor" strokeWidth={STROKE} />
                    )}
                    {user.role ?? 'user'}
                  </Badge>
                </div>

                {/* Joined */}
                <span className="hidden lg:block text-xs text-gray-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </span>

                {/* Action */}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant={user.role === 'admin' ? 'destructive' : 'outline'}
                    disabled={updating === user._id}
                    onClick={() => toggleRole(user._id, user.role ?? 'customer')}
                    className="gap-1.5 rounded-xl text-xs h-8"
                  >
                    {updating === user._id && <Loader2 size={11} className="animate-spin" />}
                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
