'use client';

import React from 'react';
import { siteContent } from '@/content/site';
import { usePharmacy } from '@/context/PharmacyContext';
import {
  PillIcon,
  SnowflakeIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  BabyIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons';

export default function CategoryMatrix() {
  const { setActiveCategory } = usePharmacy();

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    const catalogEl = document.getElementById('medicines');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'pill':
        return <PillIcon className="h-6 w-6 text-brand" />;
      case 'cold':
        return <SnowflakeIcon className="h-6 w-6 text-brand-accent" />;
      case 'heart':
        return <HeartPulseIcon className="h-6 w-6 text-rose-600" />;
      case 'device':
        return <StethoscopeIcon className="h-6 w-6 text-brand" />;
      case 'baby':
        return <BabyIcon className="h-6 w-6 text-amber-600" />;
      case 'wellness':
        return <SparklesIcon className="h-6 w-6 text-emerald-600" />;
      default:
        return <PillIcon className="h-6 w-6 text-brand" />;
    }
  };

  return (
    <section id="categories" className="border-b border-border-hairline bg-canvas py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border-hairline pb-6">
          <div>
            <span className="text-xs font-bold text-brand tracking-wider uppercase">
              {siteContent.categories.tag}
            </span>
            <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-black text-ink">
              {siteContent.categories.title}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {siteContent.categories.subtitle}
            </p>
          </div>

          <span className="text-xs font-medium text-ink-muted">
            All categories checked for authentic stock
          </span>
        </div>

        {/* Categories Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.categories.items.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group cursor-pointer border border-border-hairline bg-surface p-5 transition-all duration-300 hover:border-brand hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-border-hairline bg-subtle">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <span className="bg-subtle px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                    {cat.itemCount.toLocaleString()} items
                  </span>
                </div>

                <h3 className="mt-3 font-sans text-base font-bold text-ink group-hover:text-brand transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border-hairline pt-3">
                <span className="text-[11px] font-semibold text-brand">
                  {cat.highlight}
                </span>
                <span className="inline-flex items-center gap-1 font-sans text-xs font-bold text-ink group-hover:text-brand group-hover:translate-x-1 transition-all">
                  <span>View Products</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
