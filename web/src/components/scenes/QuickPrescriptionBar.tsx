'use client';

import React from 'react';
import { siteContent } from '@/content/site';
import { usePharmacy } from '@/context/PharmacyContext';
import { CameraIcon, ArrowRightIcon } from '@/components/ui/Icons';

export default function QuickPrescriptionBar() {
  const { setIsPrescriptionModalOpen } = usePharmacy();

  return (
    <section className="border-b border-border-hairline bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-border-hairline pb-6">
          <div>
            <span className="text-xs font-bold text-brand tracking-wider uppercase">
              {siteContent.quickRx.tag}
            </span>
            <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-black text-ink">
              {siteContent.quickRx.title}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {siteContent.quickRx.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="flex items-center justify-center gap-2 border border-brand bg-brand px-6 py-3 font-sans text-sm font-bold text-white transition-all hover:bg-brand-hover shrink-0"
          >
            <CameraIcon className="h-4 w-4" />
            <span>{siteContent.quickRx.buttonText}</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Simple Steps */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {siteContent.quickRx.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="relative border border-border-hairline bg-canvas p-6 transition-colors hover:border-brand"
            >
              <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                <span className="flex h-8 w-8 items-center justify-center bg-brand font-sans text-sm font-bold text-white">
                  {step.stepNumber}
                </span>
                <span className="text-xs font-semibold text-brand">
                  Quick & Simple
                </span>
              </div>
              <h3 className="mt-4 font-sans text-base font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
