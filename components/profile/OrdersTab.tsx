'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Package01Icon, AlarmClockIcon, ChevronDownIcon, ChevronUpIcon } from '@hugeicons/core-free-icons';
import type { Order } from './types';

const STROKE = 1.5;

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; step: number }> = {
  pending:    { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  step: 1 },
  processing: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400',   step: 2 },
  shipped:    { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400', step: 3 },
  delivered:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400',  step: 4 },
  cancelled:  { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400',    step: 0 },
};

const STEPS = ['Order placed', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />)}
    </div>
  );

  if (orders.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <HugeiconsIcon icon={Package01Icon} size={26} color="#d1d5db" strokeWidth={STROKE} />
      </div>
      <p className="text-sm font-medium text-gray-500 mb-4">No orders yet</p>
      <Link href="/products" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map(order => {
        const cfg  = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
        const open = expanded === order._id;
        const total    = order.total    ?? 0;
        const subtotal = order.subtotal ?? total;
        const discount = order.discount ?? 0;
        return (
          <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setExpanded(open ? null : order._id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{order.status}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                  <HugeiconsIcon icon={AlarmClockIcon} size={10} color="currentColor" strokeWidth={STROKE} />
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">${total.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
              </div>
              <HugeiconsIcon icon={open ? ChevronUpIcon : ChevronDownIcon} size={16} color="#9ca3af" strokeWidth={STROKE} className="flex-shrink-0" />
            </button>

            {open && (
              <div className="border-t border-gray-50 px-5 py-4 space-y-5">
                {/* Progress tracker */}
                {order.status !== 'cancelled' && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-3">Order Progress</p>
                    <div className="flex">
                      {STEPS.map((step, i) => {
                        const active = cfg.step > i;
                        return (
                          <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="flex items-center w-full">
                              {i > 0 && <div className={`flex-1 h-0.5 ${active ? 'bg-red-400' : 'bg-gray-100'}`} />}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${active ? 'bg-red-500 border-red-500' : 'border-gray-200 bg-white'}`}>
                                {active && <span className="text-white text-[10px] font-bold">✓</span>}
                              </div>
                              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${active ? 'bg-red-400' : 'bg-gray-100'}`} />}
                            </div>
                            <span className="text-[10px] text-gray-500 text-center leading-tight">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <Link href={`/products/${item.productId}`}>
                        <Image src={item.image} alt={item.name} width={44} height={44} className="rounded-lg object-contain bg-white" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-gray-400">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-50 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-50 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>

                {order.shippingAddress && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Ship to: </span>
                    {order.shippingAddress.name}, {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.country}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
