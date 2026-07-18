import { getProductsByCategory } from '@/lib/fetchproducts';
import Relatedcatcard from './Relatedcatcard';

async function RelatedProducts({ category }: { category: string }) {
  const products = await getProductsByCategory(category);

  return (
    <section className="bg-gray-50 py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
          <p className="text-sm text-gray-500 mt-1">You might also like</p>
        </div>
        <Relatedcatcard products={products} />
      </div>
    </section>
  );
}

export default RelatedProducts;


