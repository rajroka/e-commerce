import axios from 'axios';
import Individual from "@/components/Individual";

async function getProductbyCategory(productId: string) {
  const res = await axios.get(`https://fakestoreapi.com/products/${productId}`);
  return res.data;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; categoryId: string }> }) {
  const { category, categoryId } = await params;  // await params

  const product = await getProductbyCategory(categoryId);

  return (
    <>
      <Individual product={product} category={category} />
    </>
  );
}
