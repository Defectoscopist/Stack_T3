'use client';

import { useState, useEffect } from 'react';
import { Footer } from '~/components/shared/Footer';
import { Header } from '~/components/shared/Header';
import { ProductGrid } from '~/components/product-grid';

export default function HomePage() {
  return (
    <div className="pt-25 pb-16 min-h-screen flex flex-col">
      <Header/>
      <div className="px-6 max-w-360 mx-auto">
        <ProductGrid/>
      </div>
    </div>
  );
}
