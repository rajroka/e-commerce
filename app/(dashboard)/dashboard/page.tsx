"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package01Icon,
  ShoppingCart01Icon,
  UserIcon,
  MoneyBag01Icon,
  TruckIcon,
  ArrowRight01Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
} from "@hugeicons/core-free-icons";

// MUI X Charts — lazy-loaded to avoid SSR issues
const LineChart   = dynamic(() => import("@mui/x-charts/LineChart").then(m => m.LineChart),   { ssr: false });
const PieChart    = dynamic(() => import("@mui/x-charts/PieChart").then(m => m.PieChart),     { ssr: false });
const SparkLineChart = dynamic(() => import("@mui/x-charts/SparkLineChart").then(m => m.SparkLineChart), { ssr: false });

const STROKE = 1.5;

type AnalyticsData = {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  deliveredOrders: number;
  statusCounts: Record<string, number>;
  topProducts: { productId: string; name: string; revenue: number; units: number }[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
};

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

const STATUS_COLOR_MAP: Record<string, string> = {
  pending:    "#f59e0b",
  processing: "#3b82f6",
  shipped:    "#a855f7",
  delivered:  "#ef4444",
  cancelled:  "#6b7280",
};

const STATUS_DOT: Record<string, string> = {
  pending:    "bg-amber-400",
  processing: "bg-blue-400",
  shipped:    "bg-purple-400",
  delivered:  "bg-red-500",
  cancelled:  "bg-gray-400",
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/analytics").then(r => r.json()),
      fetch("/api/products?limit=6").then(r => r.json()),
    ])
      .then(([ana, prod]) => {
        setAnalytics(ana);
        setProducts(prod.products ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const months       = analytics?.monthlyRevenue ?? [];
  const monthLabels  = months.map(m => m.month);
  const revenueData  = months.map(m => m.revenue);
  const ordersData   = months.map(m => m.orders);

  const prevRev  = months[months.length - 2]?.revenue ?? 0;
  const currRev  = months[months.length - 1]?.revenue ?? 0;
  const revDelta = prevRev > 0 ? (((currRev - prevRev) / prevRev) * 100).toFixed(0) : null;

  const deliveredPct = analytics && analytics.totalOrders > 0
    ? Math.round((analytics.deliveredOrders / analytics.totalOrders) * 100)
    : 0;

  const statusEntries = Object.entries(analytics?.statusCounts ?? {});

  // Pie data for status donut
  const pieData = statusEntries.length > 0
    ? statusEntries.map(([status, count]) => ({
        id:    status,
        value: count,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: STATUS_COLOR_MAP[status] ?? "#9ca3af",
      }))
    : [{ id: "none", value: 1, label: "No orders", color: "#e5e7eb" }];

  // Sparkline fallback values
  const sparkRevenue = revenueData.length >= 2 ? revenueData : [0, 0, 1, 0, 0, 0];
  const sparkOrders  = ordersData.length  >= 2 ? ordersData  : [0, 0, 1, 0, 0, 0];

  const kpis = [
    {
      label:  "Total Revenue",
      value:  analytics ? `$${analytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}` : "—",
      sub:    "Last 30 days",
      spark:  sparkRevenue,
      color:  "#ef4444",
      delta:  revDelta ? `${Number(revDelta) >= 0 ? "+" : ""}${revDelta}%` : null,
      up:     revDelta ? Number(revDelta) >= 0 : null,
      icon:   MoneyBag01Icon,
      iconClr: "#ef4444",
    },
    {
      label:  "Total Orders",
      value:  analytics?.totalOrders.toLocaleString() ?? "—",
      sub:    "Last 30 days",
      spark:  sparkOrders,
      color:  "#6366f1",
      delta:  null, up: null,
      icon:   ShoppingCart01Icon,
      iconClr: "#6366f1",
    },
    {
      label:  "Total Customers",
      value:  analytics?.totalUsers.toLocaleString() ?? "—",
      sub:    "Last 30 days",
      spark:  sparkOrders,
      color:  "#f97316",
      delta:  null, up: null,
      icon:   UserIcon,
      iconClr: "#f97316",
    },
    {
      label:  "Pending Delivery",
      value:  analytics?.statusCounts?.pending?.toString() ?? "0",
      sub:    "Last 30 days",
      spark:  sparkOrders,
      color:  "#ec4899",
      delta:  null, up: null,
      icon:   TruckIcon,
      iconClr: "#ec4899",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Overview</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{k.sub}</p>
              </div>
              <div className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon icon={k.icon} size={16} color={k.iconClr} strokeWidth={STROKE} />
              </div>
            </div>

            <div>
              {loading
                ? <div className="h-7 w-24 bg-gray-100 animate-pulse rounded-lg" />
                : <p className="text-2xl font-bold text-gray-900 leading-none">{k.value}</p>
              }
              {k.delta !== null && !loading && (
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${k.up ? "text-green-500" : "text-red-400"}`}>
                  <HugeiconsIcon icon={k.up ? ArrowUpIcon : ArrowDownIcon} size={11} color="currentColor" strokeWidth={2} />
                  {k.delta}
                </div>
              )}
            </div>

            {/* MUI SparkLineChart */}
            <div className="mt-auto h-8">
              {!loading && (
                <SparkLineChart
                  data={k.spark}
                  height={32}
                  color={k.color}
                  area
                  curve="monotoneX"
                  showHighlight={false}
                  showTooltip={false}
                  margin={2}
                  sx={{
                    "& .MuiAreaElement-root": { fillOpacity: 0.15 },
                    "& .MuiLineElement-root": { strokeWidth: 2 },
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sales Analytics + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area / Line chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-gray-900">Sales Analytics</h2>
            {months.length > 0 && (
              <span className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5">
                {months[months.length - 1]?.month ?? ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-48 animate-pulse rounded-xl mt-4 border border-gray-100" />
          ) : analytics ? (
            <>
              <div className="flex gap-6 mt-3 mb-2">
                <div>
                  <p className="text-[11px] text-gray-400">Revenue</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-sm font-bold text-gray-900">
                      ${analytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    {revDelta && (
                      <span className="text-[10px] font-semibold text-red-500 border border-red-200 px-1.5 py-0.5 rounded-full">
                        +{revDelta}%
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Orders</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{analytics.totalOrders}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Delivered</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{analytics.deliveredOrders}</p>
                </div>
              </div>

              <LineChart
                xAxis={[{ scaleType: "point", data: monthLabels, tickLabelStyle: { fontSize: 11, fill: "#9ca3af" } }]}
                yAxis={[{ tickLabelStyle: { fontSize: 11, fill: "#9ca3af" } }]}
                series={[
                  {
                    data:     revenueData,
                    label:    "Revenue ($)",
                    color:    "#ef4444",
                    area:     true,
                    curve:    "monotoneX" as const,
                    showMark: false,
                  },
                  {
                    data:     ordersData,
                    label:    "Orders",
                    color:    "#6366f1",
                    area:     false,
                    curve:    "monotoneX" as const,
                    showMark: false,
                  },
                ]}
                height={180}
                margin={{ top: 10, right: 16, bottom: 28, left: 48 }}
                sx={{
                  "& .MuiAreaElement-series-auto-generated-id-0": { fillOpacity: 0.12 },
                  "& .MuiChartsLegend-root": { display: "none" },
                  "& .MuiChartsAxis-line":   { stroke: "#f3f4f6" },
                  "& .MuiChartsAxis-tick":   { stroke: "#f3f4f6" },
                }}
                grid={{ horizontal: true }}
              />
            </>
          ) : null}
        </div>

        {/* Donut — order status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-base font-bold text-gray-900 mb-2">Order Distribution</h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100 animate-pulse" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center">
              <PieChart
                series={[{
                  data:        pieData,
                  innerRadius: 44,
                  outerRadius: 68,
                  paddingAngle: 2,
                  cornerRadius: 3,
                  cx:          84,
                  cy:          84,
                }]}
                width={168}
                height={168}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                slotProps={{ legend: { hidden: true } as any }}
              />

              <div className="w-full space-y-2 mt-4">
                {statusEntries.map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: STATUS_COLOR_MAP[status] ?? "#9ca3af" }}
                      />
                      <span className="text-gray-600 capitalize">{status}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
                {statusEntries.length === 0 && (
                  <p className="text-xs text-gray-400 text-center">No orders yet.</p>
                )}
              </div>
            </div>
          )}

          <Link
            href="/all-orders"
            className="mt-4 flex items-center justify-between text-xs text-gray-400 hover:text-red-500 transition-colors pt-3 border-t border-gray-100"
          >
            View all orders
            <HugeiconsIcon icon={ChevronRightIcon} size={14} color="currentColor" strokeWidth={STROKE} />
          </Link>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Top Selling Products</h2>
          <Link href="/all-products" className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} size={13} color="currentColor" strokeWidth={STROKE} />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex-shrink-0 w-32">
                <div className="aspect-square bg-gray-100 rounded-xl animate-pulse mb-2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse mb-1" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {(analytics?.topProducts?.length ?? 0) > 0
              ? analytics!.topProducts.map(p => {
                  const match = products.find(pr =>
                    pr.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 8))
                  );
                  return (
                    <div key={p.productId} className="flex-shrink-0 w-32">
                      <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 mb-2 relative">
                        {match?.image
                          ? <Image src={match.image} alt={p.name} fill className="object-contain p-2" sizes="128px" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <HugeiconsIcon icon={Package01Icon} size={32} color="#d1d5db" strokeWidth={STROKE} />
                            </div>
                        }
                      </div>
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.units} units</p>
                    </div>
                  );
                })
              : products.slice(0, 5).map(p => (
                  <div key={p._id} className="flex-shrink-0 w-32">
                    <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 mb-2 relative">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="128px" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Stock: {p.stock}</p>
                  </div>
                ))
            }
            {(analytics?.topProducts?.length === 0) && products.length === 0 && (
              <p className="text-sm text-gray-400 py-4">No products yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
