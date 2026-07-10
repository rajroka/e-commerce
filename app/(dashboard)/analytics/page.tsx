'use client';

import { useEffect, useState } from 'react';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';

type AnalyticsData = {
  totalRevenue: number;
  deliveredRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  totalUsers: number;
  statusCounts: Record<string, number>;
  topProducts: { productId: string; name: string; revenue: number; units: number }[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400',
  processing: 'bg-blue-400',
  shipped: 'bg-purple-400',
  delivered: 'bg-green-400',
  cancelled: 'bg-red-400',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-28 bg-white animate-pulse rounded-lg" />)}
      </div>
    );
  }
  if (!data) return <p className="text-red-500">Failed to load analytics.</p>;

  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <FiTrendingUp /> Analytics &amp; Reports
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${data.totalRevenue.toFixed(2)}`, icon: <FiDollarSign />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Orders', value: data.totalOrders, icon: <FiShoppingBag />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Users', value: data.totalUsers, icon: <FiUsers />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Products', value: data.totalProducts, icon: <FiPackage />, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow p-6">
            <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-lg flex items-center justify-center text-xl mb-4`}>
              {card.icon}
            </div>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart (pure CSS bar chart) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Revenue (Last 6 Months)</h2>
        <div className="flex items-end gap-3 h-40">
          {data.monthlyRevenue.map((m) => (
            <div key={m.month} className="flex flex-col items-center flex-1 gap-2">
              <span className="text-xs font-bold text-gray-600">${m.revenue > 0 ? m.revenue.toFixed(0) : '0'}</span>
              <div
                className="w-full bg-indigo-500 rounded-t transition-all duration-500"
                style={{ height: `${Math.max((m.revenue / maxRevenue) * 120, m.revenue > 0 ? 4 : 0)}px` }}
              />
              <span className="text-[10px] text-gray-500 whitespace-nowrap">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`} />
                <span className="text-sm text-gray-700 capitalize flex-1">{status}</span>
                <span className="text-sm font-bold text-gray-900">{count}</span>
                <div className="w-24 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`}
                    style={{ width: `${(count / data.totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(data.statusCounts).length === 0 && (
              <p className="text-sm text-gray-400">No orders yet.</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top Products by Revenue</h2>
          <div className="space-y-3">
            {data.topProducts.length === 0 && (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
            {data.topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-800 flex-1 line-clamp-1">{p.name}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${p.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{p.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
