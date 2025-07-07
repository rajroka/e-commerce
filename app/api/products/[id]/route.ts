
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Product from '@/lib/modals/Product';

// This is the correct way to define a GET handler in the App Router
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}




export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const body = await request.json();

    // Optional: validate the body shape here before update
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error('Error updating product:', error.message || error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(  req: NextRequest, {params } :{ params : {id : string}}  ){
    try {
        

      await connect();

      const {id} =    params;
   const deletedProduct = await Product.findByIdAndDelete(id);
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


