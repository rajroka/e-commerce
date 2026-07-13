'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RefreshCw, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { Order } from './types';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending:    'outline',
  processing: 'secondary',
  shipped:    'secondary',
  delivered:  'default',
  cancelled:  'destructive',
};

const STEPS = ['Order placed', 'Processing', 'Shipped', 'Delivered'];
const STATUS_STEP: Record<string, number> = {
  pending: 1, processing: 2, shipped: 3, delivered: 4, cancelled: 0,
};

interface Props {
  orders:     Order[];
  loading:    boolean;
  onRefresh?: () => void;
}

export default function OrdersTab({ orders, loading, onRefresh }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
    </div>
  );

  if (orders.length === 0) return (
    <Card>
      <CardContent className="p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto">
          <Package size={26} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-1.5 text-muted-foreground">
            <RefreshCw size={13} /> Refresh
          </Button>
        )}
        <div>
          <Button asChild className="bg-red-500 hover:bg-red-600 text-white rounded-full">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-1.5 text-muted-foreground h-7">
            <RefreshCw size={13} /> Refresh
          </Button>
        )}
      </div>

      {orders.map(order => {
        const step     = STATUS_STEP[order.status] ?? 1;
        const open     = expanded === order._id;
        const total    = order.total    ?? 0;
        const subtotal = order.subtotal ?? total;
        const discount = order.discount ?? 0;

        return (
          <Card key={order._id} className="overflow-hidden">
            {/* Header row — clickable to expand */}
            <button
              onClick={() => setExpanded(open ? null : order._id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">${total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>

              {open ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" />
                     : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
            </button>

            {open && (
              <div className="border-t border-border px-5 py-4 space-y-5">
                {/* Progress tracker */}
                {order.status !== 'cancelled' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3">Order Progress</p>
                    <div className="flex">
                      {STEPS.map((s, i) => {
                        const active = step > i;
                        return (
                          <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="flex items-center w-full">
                              {i > 0 && <div className={`flex-1 h-0.5 ${active ? 'bg-red-400' : 'bg-border'}`} />}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 text-[10px] font-bold
                                ${active ? 'bg-red-500 border-red-500 text-white' : 'border-border bg-background text-muted-foreground'}`}>
                                {active ? '✓' : i + 1}
                              </div>
                              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${active ? 'bg-red-400' : 'bg-border'}`} />}
                            </div>
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 border border-border rounded-xl p-3">
                      <Link href={`/products/${item.productId}`}>
                        <Image src={item.image} alt={item.name} width={44} height={44} className="rounded-lg object-contain bg-white" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">×{item.quantity}</p>
                        {(item.color || item.size) && (
                          <p className="text-[11px] text-muted-foreground">
                            {[item.color, item.size].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1.5 text-sm pt-3 border-t border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-border">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {order.shippingAddress && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-gray-700">Ship to: </span>
                    {order.shippingAddress.name}, {order.shippingAddress.line1},{' '}
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
