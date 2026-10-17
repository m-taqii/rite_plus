'use client';

import React from 'react';
import { siteContent } from '@/content/site';
import { CheckIcon, CloseIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function ClinicalStandards() {
  return (
    <section id="why-us" className="border-b border-border-hairline bg-surface py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-b border-border-hairline pb-6">
          <span className="text-xs font-bold text-brand tracking-wider uppercase">
            {siteContent.comparison.tag}
          </span>
          <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-black text-ink">
            {siteContent.comparison.title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {siteContent.comparison.subtitle}
          </p>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="mt-8 border border-border-hairline bg-canvas">
          <div className="grid grid-cols-1 divide-y divide-border-hairline">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-subtle p-4 text-xs font-bold text-ink">
              <div className="md:col-span-4 uppercase">Healthcare Standard</div>
              <div className="md:col-span-4 text-brand uppercase mt-2 md:mt-0 font-extrabold flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-700" />
                <span>Rite Plus Online Pharmacy</span>
              </div>
              <div className="md:col-span-4 text-ink-muted uppercase mt-2 md:mt-0 flex items-center gap-1.5">
                <CloseIcon className="h-4 w-4 text-red-500" />
                <span>Ordinary Neighborhood Medical Store</span>
              </div>
            </div>

            {/* Comparison Rows */}
            {siteContent.comparison.rows.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-1 md:grid-cols-12 p-5 text-xs transition-colors hover:bg-surface"
              >
                <div className="md:col-span-4 font-sans font-bold text-ink text-sm">
                  {row.feature}
                </div>
                <div className="md:col-span-4 leading-relaxed text-brand font-medium mt-2 md:mt-0 pr-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold mr-1">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {row.ritePlus}
                </div>
                <div className="md:col-span-4 leading-relaxed text-ink-muted mt-2 md:mt-0">
                  <span className="inline-flex items-center gap-1 text-red-500 font-bold mr-1">
                    <CloseIcon className="h-3.5 w-3.5" />
                  </span>
                  {row.localStore}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DRAP Certification Assurance */}
        <div className="mt-10 border border-emerald-200 bg-emerald-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand text-white">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-ink">
                Licensed by DRAP (Drug Regulatory Authority of Pakistan)
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                License #PH-LHR-88419. Compliant with Drugs Act 1976. Qualified resident pharmacists on duty 24/7.
              </p>
            </div>
          </div>

          <a
            href="tel:042111748375"
            className="shrink-0 border border-brand bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover transition-colors"
          >
            Speak with Pharmacist
          </a>
        </div>
      </div>
    </section>
  );
}
