import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/modals/Product";
import connect from "@/lib/db";

// GET: Fetch all products
export async function GET(request: NextRequest) {
  await connect();

  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    const filter = category ? { category } : {};

    const products = await Product.find(filter);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
// POST: Create a new product
export async function POST(request: NextRequest) {
  await connect();

  try {
    const body = await request.json();

    // Remove any `id` field sent from frontend (MongoDB uses `_id`)
    delete body.id;

    const { name, description, price, image, category, stock = 0, rating = 0, reviews = [] } = body;

    // Basic validation
    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
      rating,
      reviews,
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connect();

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    ); 
   

  } catch (error) {
    
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );

  }

}


export async function PUT(request: NextRequest) {
   
  try {
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connect();

    const body = await request.json();

    // Remove any `id` field sent from frontend (MongoDB uses `_id`)
    delete body.id;

    const updatedProduct = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );

  } catch (error) {
    
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );

  }

}