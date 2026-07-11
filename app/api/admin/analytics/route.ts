import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import connect from "@/lib/db";
import Order from "@/lib/modals/Order";
import Product from "@/lib/modals/Product";
import clientPromise from "@/lib/mongodb";

// ─── GET /api/admin/analytics ─────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connect();

  const [orders, productCount, client] = await Promise.all([
    Order.find().lean(),
    Product.countDocuments(),
    clientPromise,
  ]);

  const db = client.db();
  const userCount = await db.collection("user").countDocuments();

  // Revenue metrics
  const totalRevenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const deliveredRevenue = deliveredOrders.reduce((s, o) => s + (o.total ?? 0), 0);

  // Orders by status
  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  // Top products by revenue
  const productRevenue: Record<string, { name: string; revenue: number; units: number }> = {};
  for (const order of orders) {
    for (const item of order.items ?? []) {
      if (!productRevenue[item.productId]) {
        productRevenue[item.productId] = { name: item.name, revenue: 0, units: 0 };
      }
      productRevenue[item.productId].revenue += item.price * item.quantity;
      productRevenue[item.productId].units   += item.quantity;
    }
  }
  const topProducts = Object.entries(productRevenue)
    .map(([id, v]) => ({ productId: id, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Monthly revenue (last 6 months)
  const now = new Date();
  const monthlyRevenue: { month: string; revenue: number; orders: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const monthOrders = orders.filter((o) => {
      const created = new Date(o.createdAt as string);
      return (
        created.getFullYear() === d.getFullYear() &&
        created.getMonth()    === d.getMonth()
      );
    });
    monthlyRevenue.push({
      month:   label,
      revenue: monthOrders.reduce((s, o) => s + (o.total ?? 0), 0),
      orders:  monthOrders.length,
    });
  }

  return NextResponse.json({
    totalRevenue,
    deliveredRevenue,
    totalOrders:      orders.length,
    deliveredOrders:  deliveredOrders.length,
    totalProducts:    productCount,
    totalUsers:       userCount,
    statusCounts,
    topProducts,
    monthlyRevenue,
  });
}
