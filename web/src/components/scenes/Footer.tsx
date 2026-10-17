'use client';

import React from 'react';
import { siteContent } from '@/content/site';

export default function Footer() {
  return (
    <footer className="border-t border-border-hairline bg-surface text-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Summary */}
          <div className="lg:col-span-5">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center bg-brand text-white font-black text-base">
                R+
              </div>
              <span className="font-sans text-2xl font-black text-ink">
                RITE<span className="text-brand">PLUS</span>
              </span>
            </a>

            <p className="mt-3 max-w-md text-xs leading-relaxed text-ink-secondary">
              {siteContent.footer.about}
            </p>

            <div className="mt-3 flex items-start gap-2 border border-border-hairline bg-subtle p-3 text-xs leading-relaxed text-ink-secondary">
              <strong className="text-ink shrink-0">Store Location:</strong>
              <span>{siteContent.brand.address}</span>
            </div>

            <div className="mt-3 border border-border-hairline bg-subtle p-3 text-xs leading-relaxed text-ink-secondary">
              <strong className="text-ink">DRAP Regulation: </strong>
              {siteContent.footer.drapNotice}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7">
            {siteContent.footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-sans text-xs font-bold text-ink uppercase tracking-wider border-b border-border-hairline pb-2">
                  {col.title}
                </h4>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs text-ink-secondary hover:text-brand transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border-hairline pt-6 text-xs text-ink-muted sm:flex-row">
          <div>{siteContent.footer.copyright}</div>
          <div className="flex gap-4">
            <span>DRAP License #PH-LHR-88419</span>
            <span>•</span>
            <span>24/7 Qualified Pharmacists on Duty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
