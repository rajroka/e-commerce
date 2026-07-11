import type { Metadata } from 'next';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { fetchProductById } from '@/lib/fetchproducts';
import RelatedProducts from '@/components/RelatedProducts';
import ProductErrorBoundary from '@/components/ProductErrorBoundary';

type FetchedProduct = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  try {
    const { productId } = await params;
    const product = await fetchProductById(productId);
    return {
      title: `${product.name} — GG Shop`,
      description: product.description || 'View product details at GG Shop.',
      openGraph: {
        images: [{ url: product.image }],
      },
    };
  } catch {
    return {
      title: 'Product — GG Shop',
      description: 'View product details at GG Shop.',
    };
  }
}

const Page = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const { productId } = await params;

  let fetchedProduct: FetchedProduct | null = null;
  try {
    fetchedProduct = await fetchProductById(productId);
  } catch (err) {
    return <p className="text-center py-20">Product not found or failed to load.</p>;
  }

  const product = {
    id:          fetchedProduct._id,
    title:       fetchedProduct.name,
    price:       fetchedProduct.price,
    description: fetchedProduct.description || 'No description available',
    category:    fetchedProduct.category,
    image:       fetchedProduct.image,
    stock:       fetchedProduct.stock,
    rating:      fetchedProduct.rating,
    reviewCount: fetchedProduct.reviewCount,
  };

  return (
    <>
      <ProductErrorBoundary>
        <ProductDetailsClient product={product} />
      </ProductErrorBoundary>
      <RelatedProducts category={product.category} />
    </>
  );
};

export default Page;
