'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { siteContent } from '@/content/site';
import { gsap, useGSAP } from '@/lib/gsap';
import { SnowflakeIcon, BoltIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function SignatureColdChain() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const mm = gsap.matchMedia();

      // Desktop: Pinned horizontal scroll sequence
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const totalScrollWidth = track.scrollWidth - window.innerWidth + 80;

        const scrollTween = gsap.to(track, {
          x: -totalScrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${totalScrollWidth * 1.1}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          scrollTween.kill();
        };
      });

      // Mobile or reduced motion: clean static vertical cards
      mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
        gsap.set(track, { x: 0 });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="cold-chain"
      className="relative overflow-hidden border-b border-border-hairline bg-subtle"
    >
      {/* Header Bar */}
      <div className="border-b border-border-hairline bg-surface px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-brand-accent tracking-wider uppercase">
                {siteContent.coldChain.tag}
              </span>
              <h2 className="mt-1 font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-ink">
                {siteContent.coldChain.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {siteContent.coldChain.explanation}
              </p>
            </div>

            <div className="flex items-center gap-3 border-2 border-brand-accent/30 bg-sky-50 p-4 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center bg-sky-100">
                <SnowflakeIcon className="h-7 w-7 text-brand-accent" />
              </div>
              <div>
                <div className="text-xs font-bold text-brand-accent uppercase">
                  Insulin & Vaccine Safety
                </div>
                <div className="font-sans text-lg font-black text-ink">
                  {siteContent.coldChain.temperatureBadge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Walkthrough Strip */}
      <div className="py-10 lg:py-16">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-8 lg:px-12 w-full lg:w-max"
        >
          {/* Visual Showcase Card with Delivery Rider Photo */}
          <div className="flex w-full flex-col justify-between border border-border-hairline bg-surface p-6 shadow-sm lg:w-110 lg:shrink-0">
            <div>
              <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                <span className="text-xs font-bold text-brand">EXPRESS RIDER FLEET</span>
                <span className="text-xs text-ink-muted">Chilled Delivery Box</span>
              </div>
              <div className="relative mt-4 h-56 w-full overflow-hidden border border-border-hairline">
                <Image
                  src="/images/delivery_rider.jpg"
                  alt="Rite Plus Cold Chain Medicine Delivery Rider"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-sans text-base font-bold text-ink">
                Insulated Cold Delivery to Your Doorstep
              </h3>
              <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                Our riders carry your insulin and temperature-sensitive drops in specialized thermal pouches with frozen ice packs so they never heat up in traffic.
              </p>
            </div>
            <div className="mt-4 border-t border-border-hairline pt-3 flex items-center gap-1.5 text-xs font-bold text-brand">
              <BoltIcon className="h-4 w-4 text-amber-500" />
              <span>30-Minute Average Arrival Time</span>
            </div>
          </div>

          {/* 4 Process Cards */}
          {siteContent.coldChain.steps.map((step, idx) => (
            <div
              key={step.step}
              className="flex w-full flex-col justify-between border border-border-hairline bg-surface p-7 shadow-sm transition-all duration-300 hover:border-brand-accent lg:w-105 lg:shrink-0"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                  <span className="text-xs font-bold text-brand-accent uppercase">
                    {step.step}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    Safety Check {idx + 1}/4
                  </span>
                </div>

                <div className="mt-5 border-b border-border-hairline pb-5">
                  <div className="font-sans text-4xl font-black text-ink">
                    {step.metric}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-brand-accent">
                    {step.metricLabel}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="font-sans text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                    {step.detail}
                  </p>
                </div>
              </div>

              <div className="mt-6 border border-border-hairline bg-subtle p-3 text-xs text-ink">
                <strong className="text-brand">Why this matters: </strong>
                {step.simpleExplanation}
              </div>
            </div>
          ))}

          {/* Guarantee Card */}
          <div className="flex w-full flex-col justify-between border border-brand bg-brand p-8 text-white shadow-lg lg:w-95 lg:shrink-0">
            <div>
              <div className="flex items-center justify-between border-b border-white/20 pb-3 text-xs">
                <span className="font-bold text-sky-300">OUR PROMISE</span>
                <span className="text-white/60">RITE PLUS GUARANTEE</span>
              </div>

              <div className="mt-8">
                <div className="font-sans text-3xl font-black text-white">
                  100% Effective
                </div>
                <div className="mt-1 text-xs text-sky-300 font-semibold">
                  Never Damaged by Power Outages
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-white/85">
                If your insulin is ever warm or unsealed upon delivery, our rider will replace it immediately at zero extra cost. Your health is our highest priority.
              </p>
            </div>

            <div className="mt-8 border-t border-white/20 pt-4 flex items-center gap-1.5 text-xs text-white/80">
              <ShieldCheckIcon className="h-4 w-4 text-sky-400" />
              <span>DRAP Approved Cold-Chain Standard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
