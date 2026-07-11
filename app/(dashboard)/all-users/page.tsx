'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Shield01Icon, Mail01Icon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  image?: string;
};

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
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HugeiconsIcon icon={UserIcon} size={22} color="#ef4444" strokeWidth={STROKE} />
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        {!loading && (
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {users.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-white animate-pulse rounded-xl border border-gray-100" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500">User</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Email</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500">Role</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{user.name ?? '—'}</p>
                    <p className="text-xs text-gray-400 md:hidden">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Mail01Icon} size={13} color="#9ca3af" strokeWidth={STROKE} />
                      {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      user.role === 'admin'
                        ? 'border-red-300 text-red-600'
                        : 'border-gray-200 text-gray-600'
                    }`}>
                      {user.role === 'admin' && (
                        <HugeiconsIcon icon={Shield01Icon} size={10} color="currentColor" strokeWidth={STROKE} />
                      )}
                      {user.role ?? 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleRole(user._id, user.role ?? 'user')}
                      disabled={updating === user._id}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                        user.role === 'admin'
                          ? 'border border-red-300 text-red-600 hover:bg-red-50'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {updating === user._id && (
                        <HugeiconsIcon icon={LoaderPinwheelIcon} size={11} color="currentColor" strokeWidth={STROKE} className="animate-spin" />
                      )}
                      {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-400 py-12 text-sm">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
