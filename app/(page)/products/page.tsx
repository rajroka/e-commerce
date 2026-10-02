import type { Metadata } from 'next';
import { fetchProductsPaginated } from '@/lib/fetchproducts';
import ProductList from '@/components/Productlist';
import ProductErrorBoundary from '@/components/ProductErrorBoundary';

export const metadata: Metadata = {
  title: 'Shop All Products — GG Shop',
  description:
    'Browse our full collection of premium cosmetics — lips, face, and skincare. Consciously crafted in Pokhara.',
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) => {
  const resolvedParams = await searchParams;
  const page   = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search?.trim() || undefined;
  const limit  = 12;

  const { products, totalCount, totalPages, page: currentPage } =
    await fetchProductsPaginated(page, limit, search);

  return (
    <ProductErrorBoundary>
      <ProductList
        products={products}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </ProductErrorBoundary>
  );
};

export default Page;
