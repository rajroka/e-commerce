'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCart01Icon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const STROKE = 1.5;

type OrderItem = { name: string; quantity: number; price: number };
type Order = {
  _id: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  couponCode?: string;
};

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending:    'outline',
  processing: 'secondary',
  shipped:    'secondary',
  delivered:  'default',
  cancelled:  'destructive',
};

export default function AllOrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders ?? []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center text-sm text-muted-foreground">
            No orders yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Card key={order._id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-800 break-all">{order._id}</p>
                    <p className="text-sm text-muted-foreground mt-1">{order.userEmail}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                      {order.couponCode && (
                        <span className="ml-2 text-green-600 font-semibold">Coupon: {order.couponCode}</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap sm:flex-shrink-0">
                    <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize">
                      {order.status}
                    </Badge>
                    <span className="text-base font-bold text-gray-900">${(order.total ?? 0).toFixed(2)}</span>

                    <div className="relative">
                      {updating === order._id && (
                        <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                          <Loader2 size={12} className="animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <Select
                        value={order.status}
                        onValueChange={val => updateStatus(order._id, val)}
                        disabled={updating === order._id}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s} className="capitalize text-xs">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {order.items?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <Badge key={i} variant="secondary" className="font-normal">
                        {item.name} ×{item.quantity}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
