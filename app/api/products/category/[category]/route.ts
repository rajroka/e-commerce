import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Product from '@/lib/modals/Product';

interface RouteContext {
  params: Promise<{ category: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { category } = await context.params; // ✅ must await in Next.js 15+

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    await connect();
    const products = await Product.find({ category });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Category API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
