'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, Delete01Icon, Package01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Plus } from 'lucide-react';

const STROKE = 1.5;

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProducts(d.products ?? d))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Package01Icon} size={22} color="#ef4444" strokeWidth={STROKE} />
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            {!loading && <Badge variant="secondary">{products.length}</Badge>}
          </div>
          <Button asChild className="bg-red-500 hover:bg-red-600 text-white rounded-full gap-2">
            <Link href="/add-product"><Plus size={15} /> Add Product</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] rounded-none" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <HugeiconsIcon icon={Package01Icon} size={40} color="#d1d5db" strokeWidth={STROKE} className="mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No products yet.</p>
              <Button asChild className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                <Link href="/add-product">Add your first product</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
              <Card key={product._id} className="overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image src={product.image} alt={product.name} fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                  <Badge className="absolute top-2 left-2 text-[10px] capitalize bg-black/60 text-white border-0">
                    {product.category}
                  </Badge>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h2 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{product.name}</h2>
                  <p className="text-xs text-muted-foreground mb-1">Stock: {product.stock}</p>
                  <p className="text-base font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
                  <div className="mt-auto flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild size="sm" className="flex-1 bg-gray-900 hover:bg-red-500 text-white rounded-xl gap-1.5">
                          <Link href={`/edit-product/${product._id}`}>
                            <HugeiconsIcon icon={Edit01Icon} size={13} color="white" strokeWidth={STROKE} /> Edit
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit product</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="destructive"
                          onClick={() => deleteProduct(product._id)}
                          disabled={deleting === product._id}
                          className="px-3 rounded-xl">
                          {deleting === product._id
                            ? <Loader2 size={13} className="animate-spin" />
                            : <HugeiconsIcon icon={Delete01Icon} size={13} color="white" strokeWidth={STROKE} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete product</TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
