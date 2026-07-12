'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Shield01Icon, Mail01Icon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <Badge variant="secondary">{users.length}</Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <p className="font-semibold text-gray-900">{user.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Mail01Icon} size={13} color="#9ca3af" strokeWidth={STROKE} />
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="gap-1">
                        {user.role === 'admin' && (
                          <HugeiconsIcon icon={Shield01Icon} size={10} color="currentColor" strokeWidth={STROKE} />
                        )}
                        {user.role ?? 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={user.role === 'admin' ? 'destructive' : 'outline'}
                        disabled={updating === user._id}
                        onClick={() => toggleRole(user._id, user.role ?? 'user')}
                        className="gap-1.5"
                      >
                        {updating === user._id && <Loader2 size={11} className="animate-spin" />}
                        {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
