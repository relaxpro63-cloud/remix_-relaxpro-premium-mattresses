'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import ProductList from '@/components/product/ProductList';
import { Tier, MattressSize, Product } from '@/types';
import { useCart } from '@/features/cart/CartContext';

export default function CatalogPage() {
  const router = useRouter();
  const cart = useCart();
  const searchParams = useSearchParams();
  const tierFromUrl = searchParams.get('tier') as Tier | null;
  const [selectedTier, setSelectedTier] = useState<Tier | 'all'>(tierFromUrl || 'all');

  const handleNavigate = (page: string) => {
    if (page === 'home') router.push('/');
    else router.push(`/${page}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToPdp = (slug: string) => {
    router.push(`/mattresses/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', item: '/' }, { name: 'All Mattresses', item: '/catalog' }]} />
      <ProductList
        onAddToCartDirect={(product: Product, size: MattressSize, includeAcc: boolean) =>
          cart.addToCartDirect(product, size, includeAcc)}
        onNavigateToPdp={handleNavigateToPdp}
        onNavigate={handleNavigate}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
      />
    </>
  );
}
