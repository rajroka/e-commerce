import { fetchproducts } from '@/lib/fetchproducts';
import ProductList  from "@/components/Productlist"

const Page = async () => {
  const products = await fetchproducts();

  return <ProductList products={products} />;
};

export default Page;
