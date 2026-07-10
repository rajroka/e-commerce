import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://e-commerce-yq58.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/add-product', '/all-products', '/edit-product', '/all-orders', '/all-users', '/analytics', '/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
