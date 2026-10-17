'use client';

import React, { useMemo } from 'react';
import { siteContent } from '@/content/site';
import { usePharmacy } from '@/context/PharmacyContext';
import ProductCard from '@/components/ui/ProductCard';
import { CameraIcon, ArrowRightIcon, CloseIcon, SearchIcon } from '@/components/ui/Icons';

export default function ProductCatalog() {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsPrescriptionModalOpen,
  } = usePharmacy();

  const filteredProducts = useMemo(() => {
    return siteContent.catalog.products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.genericName.toLowerCase().includes(q) ||
        product.manufacturer.toLowerCase().includes(q) ||
        product.dosage.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="medicines" className="border-b border-border-hairline bg-canvas py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-border-hairline pb-6">
          <div>
            <span className="text-xs font-bold text-brand tracking-wider uppercase">
              {siteContent.catalog.tag}
            </span>
            <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-black text-ink">
              {siteContent.catalog.title}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {siteContent.catalog.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="flex items-center justify-center gap-2 border border-brand bg-emerald-50 px-5 py-2.5 text-xs font-bold text-brand hover:bg-brand hover:text-white transition-colors shrink-0"
          >
            <CameraIcon className="h-4 w-4" />
            <span>{siteContent.catalog.prescriptionButton}</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Counter */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={siteContent.catalog.searchPlaceholder}
              className="w-full border border-border-hairline bg-surface pl-10 pr-20 py-2.5 text-xs text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-xs font-bold text-ink-muted hover:text-ink"
              >
                <CloseIcon className="h-3 w-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-ink-muted">
            Showing <span className="font-bold text-ink">{filteredProducts.length}</span> items
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-border-hairline pb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`border px-3.5 py-1.5 text-xs font-semibold transition-all ${activeCategory === 'all'
                ? 'border-brand bg-brand text-white font-bold'
                : 'border-border-hairline bg-surface text-ink hover:border-brand'
              }`}
          >
            {siteContent.catalog.filterAll}
          </button>

          {siteContent.categories.items.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`border px-3.5 py-1.5 text-xs font-semibold transition-all ${activeCategory === cat.id
                  ? 'border-brand bg-brand text-white font-bold'
                  : 'border-border-hairline bg-surface text-ink hover:border-brand'
                }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="border border-border-hairline bg-surface p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border border-border-hairline bg-subtle">
                <SearchIcon className="h-8 w-8 text-ink-muted" />
              </div>
              <h3 className="mt-4 font-sans text-lg font-bold text-ink">
                No matching medicine found
              </h3>
              <p className="mt-1 text-xs text-ink-muted max-w-md mx-auto">
                We stock thousands more medicines in our cleanroom pharmacy. Upload your doctor&apos;s slip and our pharmacist will arrange it right away.
              </p>
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 border border-brand bg-brand px-6 py-3 text-xs font-bold text-white hover:bg-brand-hover"
              >
                <CameraIcon className="h-4 w-4" />
                <span>Upload Prescription for Pharmacist Assistance</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
