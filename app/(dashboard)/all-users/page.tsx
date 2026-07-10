'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiShield, FiMail } from 'react-icons/fi';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  image?: string;
};

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
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
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiUser /> User Management
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 hidden lg:table-cell">Joined</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{user.name ?? '—'}</p>
                    <p className="text-xs text-gray-400 md:hidden">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                    <span className="flex items-center gap-1"><FiMail size={12} />{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' && <FiShield size={10} />}
                      {user.role ?? 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleRole(user._id, user.role ?? 'user')}
                      disabled={updating === user._id}
                      className={`text-xs font-bold px-3 py-1.5 rounded transition ${
                        user.role === 'admin'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                      } disabled:opacity-50`}
                    >
                      {updating === user._id ? '...' : user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-12">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
