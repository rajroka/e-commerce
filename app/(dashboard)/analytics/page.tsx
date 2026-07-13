"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon, ShoppingCart01Icon, UserIcon,
  Package01Icon, MoneyBag01Icon,
} from "@hugeicons/core-free-icons";

// MUI X Charts — lazy-loaded to avoid SSR issues
const BarChart  = dynamic(() => import("@mui/x-charts/BarChart").then(m => m.BarChart),   { ssr: false });
const PieChart  = dynamic(() => import("@mui/x-charts/PieChart").then(m => m.PieChart),   { ssr: false });
const LineChart = dynamic(() => import("@mui/x-charts/LineChart").then(m => m.LineChart), { ssr: false });

const STROKE = 1.5;

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

const STATUS_COLOR_MAP: Record<string, string> = {
  pending:    "#f59e0b",
  processing: "#3b82f6",
  shipped:    "#a855f7",
  delivered:  "#22c55e",
  cancelled:  "#6b7280",
};

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-28 bg-white animate-pulse rounded-2xl border border-gray-100" />
      ))}
    </div>
  );

  if (error || !data) return (
    <div className="bg-white rounded-2xl border border-red-200 p-10 text-center text-red-500 text-sm">
      Failed to load analytics. Try refreshing.
    </div>
  );

  const monthLabels = data.monthlyRevenue.map(m => m.month);
  const revenueData = data.monthlyRevenue.map(m => m.revenue);
  const ordersData  = data.monthlyRevenue.map(m => m.orders);

  const statusEntries = Object.entries(data.statusCounts);
  const pieData = statusEntries.length > 0
    ? statusEntries.map(([status, count]) => ({
        id:    status,
        value: count,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: STATUS_COLOR_MAP[status] ?? "#9ca3af",
      }))
    : [{ id: "none", value: 1, label: "No orders", color: "#e5e7eb" }];

  const kpis = [
    { label: "Total Revenue",  value: `$${data.totalRevenue.toFixed(2)}`,      icon: MoneyBag01Icon,     color: "#ef4444" },
    { label: "Total Orders",   value: String(data.totalOrders),                icon: ShoppingCart01Icon, color: "#3b82f6" },
    { label: "Total Users",    value: String(data.totalUsers),                 icon: UserIcon,           color: "#a855f7" },
    { label: "Total Products", value: String(data.totalProducts),              icon: Package01Icon,      color: "#f97316" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards — no coloured backgrounds */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center mb-4">
              <HugeiconsIcon icon={k.icon} size={18} color={k.color} strokeWidth={STROKE} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue — Bar + Line combo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Monthly Revenue &amp; Orders</h2>
        <p className="text-xs text-gray-400 mb-4">Last 6 months</p>
        <BarChart
          xAxis={[{
            scaleType: "band",
            data: monthLabels,
            tickLabelStyle: { fontSize: 11, fill: "#9ca3af" },
          }]}
          yAxis={[{ tickLabelStyle: { fontSize: 11, fill: "#9ca3af" } }]}          series={[
            {
              data:     revenueData,
              label:    "Revenue ($)",
              color:    "#ef4444",
            },
          ]}
          height={260}
          borderRadius={6}
          margin={{ top: 10, right: 16, bottom: 28, left: 56 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiChartsAxis-line": { stroke: "#f3f4f6" },
            "& .MuiChartsAxis-tick": { stroke: "#f3f4f6" },
            "& .MuiChartsLegend-root": { display: "none" },
          }}
        />
      </div>

      {/* Orders trend line */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Order Volume Trend</h2>
        <p className="text-xs text-gray-400 mb-4">Monthly order count over last 6 months</p>
        <LineChart
          xAxis={[{
            scaleType: "point",
            data: monthLabels,
            tickLabelStyle: { fontSize: 11, fill: "#9ca3af" },
          }]}
          yAxis={[{ tickLabelStyle: { fontSize: 11, fill: "#9ca3af" } }]}
          series={[{
            data:     ordersData,
            label:    "Orders",
            color:    "#6366f1",
            area:     true,
            curve:    "monotoneX" as const,
            showMark: true,
          }]}
          height={200}
          margin={{ top: 10, right: 16, bottom: 28, left: 40 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-root":  { fillOpacity: 0.1 },
            "& .MuiLineElement-root":  { strokeWidth: 2 },
            "& .MuiChartsAxis-line":   { stroke: "#f3f4f6" },
            "& .MuiChartsAxis-tick":   { stroke: "#f3f4f6" },
            "& .MuiChartsLegend-root": { display: "none" },
          }}
        />
      </div>

      {/* Status breakdown + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart — orders by status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Orders by Status</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <PieChart
              series={[{
                data:         pieData,
                innerRadius:  48,
                outerRadius:  80,
                paddingAngle: 2,
                cornerRadius: 4,
                cx:           84,
                cy:           84,
              }]}
              width={168}
              height={168}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              slotProps={{ legend: { hidden: true } as any }}
            />

            <div className="flex-1 space-y-2.5">
              {statusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLOR_MAP[status] ?? "#9ca3af" }}
                  />
                  <span className="text-sm text-gray-700 capitalize flex-1">{status}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${data.totalOrders ? (count / data.totalOrders) * 100 : 0}%`,
                        background: STATUS_COLOR_MAP[status] ?? "#9ca3af",
                      }}
                    />
                  </div>
                </div>
              ))}
              {statusEntries.length === 0 && (
                <p className="text-sm text-gray-400">No orders yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Top products — horizontal bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Top Products by Revenue</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No sales data yet.</p>
          ) : (
            <BarChart
              layout="horizontal"
              yAxis={[{
                scaleType: "band",
                data: data.topProducts.map(p => p.name.length > 16 ? p.name.slice(0, 14) + "…" : p.name),
                tickLabelStyle: { fontSize: 11, fill: "#6b7280" },
              }]}
              xAxis={[{ tickLabelStyle: { fontSize: 11, fill: "#9ca3af" } }]}
              series={[{
                data:  data.topProducts.map(p => p.revenue),
                label: "Revenue ($)",
                color: "#ef4444",
              }]}
              height={data.topProducts.length * 44 + 40}
              borderRadius={4}
              margin={{ top: 8, right: 16, bottom: 28, left: 120 }}
              grid={{ vertical: true }}
              sx={{
                "& .MuiChartsAxis-line":   { stroke: "#f3f4f6" },
                "& .MuiChartsAxis-tick":   { stroke: "#f3f4f6" },
                "& .MuiChartsLegend-root": { display: "none" },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
