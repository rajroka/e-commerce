import ProductDetailsClient from '@/components/ProductDetailsClient';
import { fetchProductById } from '@/lib/fetchproducts';
import RelatedProducts from '@/components/RelatedProducts';

type FetchedProduct = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  image: string;
};

const Page = async ({ params }: { params:  Promise<{productId : string}> }) => {

  const { productId } = await  params;

  let fetchedProduct: FetchedProduct | null = null;
  try {
    fetchedProduct = await fetchProductById(productId);
  } catch (err) {
    return <p className="text-center py-20">Product not found or failed to load.</p>;
  }

  const product = {
    id: fetchedProduct._id,
    title: fetchedProduct.name,
    price: fetchedProduct.price,
    description: fetchedProduct.description || 'No description available',
    category: fetchedProduct.category,
    image: fetchedProduct.image,
  };

  return (
    <>
      <ProductDetailsClient product={product} />
      <RelatedProducts category={product.category} />
    </>
  );
};

export default Page;
