// app/api/category/[category]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import  connect  from '@/lib/db'; // your DB connection logic
import Product from "@/lib/modals/Product"; // your Mongoose model

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = decodeURIComponent(params.category);

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    await connect(); // connect to MongoDB

    const products = await Product.find({ category });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Category API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
