'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { usePharmacy } from '@/context/PharmacyContext';
import { gsap, useGSAP } from '@/lib/gsap';
import { ArrowRight, Camera } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setIsPrescriptionModalOpen } = usePharmacy();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.h-line-1', { y: 36, opacity: 0, duration: 0.7 })
          .from('.h-line-2', { y: 36, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('.h-line-3', { y: 36, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('.h-sub', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
          .from('.h-cta', { y: 18, opacity: 0, duration: 0.55 }, '-=0.3')
          .from(
            '.h-img',
            { scale: 0.95, opacity: 0, duration: 0.95, transformOrigin: 'bottom center' },
            0.2
          )
          .from('.h-band', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            '.h-line-1',
            '.h-line-2',
            '.h-line-3',
            '.h-sub',
            '.h-cta',
            '.h-img',
            '.h-band',
          ],
          { opacity: 1, y: 0, x: 0, scale: 1 }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="upload-rx"
      className="relative overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 65% 35%, #0284C7 0%, #0369A1 42%, #0C4A6E 100%)',
      }}
    >
      {/* ── Ambient ethereal lighting & mist ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-130 w-130 rounded-full bg-sky-400/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/3 h-112.5 w-112.5 rounded-full bg-blue-400/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#38BDF8]/10 to-transparent"
      />

      {/* ── Main Hero Content ── */}
      <div className="relative mx-auto max-w-7xl px-5 pt-32 pb-0 sm:px-8 sm:pt-36 lg:grid lg:grid-cols-12 lg:items-end lg:gap-12 lg:pt-40">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LEFT COLUMN (7 cols)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="lg:col-span-7 pb-12 sm:pb-16 lg:pb-20">
          {/* ── Main Big Heading (VEDA GLOW style) ── */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.15rem] font-black uppercase tracking-tight text-white leading-[1.04]">
            <span className="h-line-1 block">Science-Backed</span>
            <span className="h-line-2 block text-white/95">Medicines For</span>
            <span className="h-line-3 block text-sky-200">Better Health</span>
          </h1>

          {/* Subheadline */}
          <p className="h-sub mt-5 max-w-xl text-base text-white/85 sm:text-lg leading-relaxed font-normal">
            Skip the waiting line at the medical store. Get 100% genuine
            medicines, cold-storage insulin, and daily health essentials
            verified by licensed pharmacists and delivered to your doorstep in
            30 minutes.
          </p>

          {/* ── CTA Action Buttons (VEDA GLOW pills) ── */}
          <div className="h-cta mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Primary Pill Button */}
            <a
              href="#medicines"
              className="inline-flex items-center gap-2 rounded-full bg-[#0284C7] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition-all hover:scale-105 hover:bg-[#0369A1] active:scale-95 sm:text-base"
            >
              <span>Order Medicines</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            {/* Glassmorphic Upload Prescription Button */}
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md shadow-lg shadow-black/10 transition-all hover:scale-105 hover:bg-white/30 active:scale-95 sm:text-base"
            >
              <Camera className="h-4 w-4 text-sky-200" />
              <span>Upload Prescription</span>
            </button>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RIGHT COLUMN (5 cols)
            Seamless Transparent Doctor Portrait (Grounded Flush to Stats Band)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="relative mt-8 lg:col-span-5 lg:mt-0 flex justify-center items-end self-end">
          <div className="h-img relative mx-auto w-full flex items-end justify-center -mb-px">
            <div className="relative h-115 w-full sm:h-130 lg:h-150 max-w-120">
              <Image
                src="/images/hero_doctor_grounded.png"
                alt="Rite Plus Licensed Consulting Pharmacist & Medical Doctor"
                fill
                priority
                className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM SPLIT BAND (VEDA GLOW 3-column stats band)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="h-band relative border-t border-white/20 bg-black/15 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/20 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-white/20">
          {/* Column 1 */}
          <div className="px-6 py-6 sm:px-8">
            <h3 className="font-display text-base font-bold text-white sm:text-lg">
              Define your wellness routine with RITE PLUS
            </h3>
            <p className="mt-1 text-xs text-white/75 sm:text-sm">
              Pakistan&apos;s trusted DRAP-licensed digital pharmacy service.
            </p>
          </div>

          {/* Column 2 */}
          <div className="px-6 py-6 sm:px-8">
            <h3 className="font-display text-base font-bold text-white sm:text-lg">
              Powered by Clinical Science
            </h3>
            <p className="mt-1 text-xs text-white/75 sm:text-sm">
              Every prescription reviewed by Pharm-D · Insulated cold-chain ice
              packs for insulin.
            </p>
          </div>

          {/* Column 3 */}
          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl sm:text-2xl font-black text-emerald-200">
                1.5M+
              </span>
              <span className="font-display text-base font-bold text-white">
                Doses Delivered
              </span>
            </div>
            <p className="mt-1 text-xs text-white/75 sm:text-sm">
              Sourced direct from verified manufacturers with guaranteed 30-min
              dispatch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
