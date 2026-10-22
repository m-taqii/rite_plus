'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/content/site';
import { usePharmacy } from '@/context/PharmacyContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = usePharmacy();

  return (
    <div className="group relative flex flex-col justify-between border border-border-hairline bg-surface p-4 transition-all duration-300 hover:border-brand hover:shadow-md">
      <div>
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-1 text-[11px] font-semibold">
          {product.isColdChain ? (
            <span className="border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-800">
              ❄ 2°C–8°C Chilled
            </span>
          ) : (
            <span className="border border-border-hairline bg-subtle px-2 py-0.5 text-ink-muted">
              {product.manufacturer}
            </span>
          )}

          {product.requiresPrescription ? (
            <span className="border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-800 font-bold">
              Rx Required
            </span>
          ) : (
            <span className="border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-800 font-medium">
              Over The Counter
            </span>
          )}
        </div>

        {/* Product Packshot Image */}
        <Link
          href={`/products/${product.id}`}
          className="relative mt-3 h-48 w-full items-center justify-center overflow-hidden border border-border-hairline bg-white p-2 cursor-pointer block"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={240}
            height={200}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Product Details */}
        <div className="mt-4">
          <div className="text-xs font-medium text-ink-muted">
            {product.genericName}
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-1 font-sans text-base font-bold text-ink transition-colors group-hover:text-brand cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 inline-block bg-subtle px-2 py-0.5 text-[11px] font-medium text-ink-muted">
            {product.dosage}
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-5 border-t border-border-hairline pt-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-semibold text-ink-muted">Rs. </span>
            <span className="font-sans text-xl font-extrabold text-ink">
              {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-ink-muted line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-sky-700">
            ✓ In Stock
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 border border-brand bg-brand px-4 py-2.5 font-sans text-xs font-bold tracking-wide text-white transition-all duration-200 hover:bg-brand-hover active:scale-[0.99]"
        >
          <span>🛒 Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
