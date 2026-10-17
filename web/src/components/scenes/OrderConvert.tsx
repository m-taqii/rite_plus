'use client';

import React from 'react';
import Image from 'next/image';
import { siteContent } from '@/content/site';
import { usePharmacy } from '@/context/PharmacyContext';
import {
  BoltIcon,
  CameraIcon,
  ArrowRightIcon,
  MessageCircleIcon,
  PhoneIcon,
} from '@/components/ui/Icons';

export default function OrderConvert() {
  const { setIsPrescriptionModalOpen } = usePharmacy();

  return (
    <section className="relative overflow-hidden border-b border-border-hairline bg-brand py-14 text-white lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Text & Call to Action */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 border border-emerald-400/40 bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-300">
              <BoltIcon className="h-3.5 w-3.5 text-amber-300" />
              <span>30-MINUTE DOORSTEP DELIVERY</span>
            </span>

            <h2 className="mt-4 font-sans text-3xl font-black text-white sm:text-4xl lg:text-5xl leading-tight">
              {siteContent.bannerCta.title}
            </h2>

            <p className="mt-3 max-w-xl text-base text-white/85 leading-relaxed">
              {siteContent.bannerCta.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="flex items-center gap-2 border border-white bg-white px-7 py-3.5 font-sans text-xs font-bold text-brand transition-all hover:bg-emerald-100 active:scale-[0.99]"
              >
                <CameraIcon className="h-4 w-4" />
                <span>{siteContent.bannerCta.buttonUpload}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <a
                href={`https://wa.me/923001234567?text=Hi%20Rite%20Plus,%20I%20need%20medicine%20delivery`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-white/40 bg-emerald-800/40 px-6 py-3.5 font-sans text-xs font-bold text-white transition-colors hover:bg-emerald-800/70"
              >
                <MessageCircleIcon className="h-4 w-4" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href={`tel:${siteContent.brand.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2 border border-white/20 px-6 py-3.5 font-sans text-xs font-bold text-white/90 hover:border-white transition-colors"
              >
                <PhoneIcon className="h-4 w-4" />
                <span>{siteContent.brand.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Rider Image */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden border-2 border-white/20 shadow-2xl">
              <Image
                src="/images/delivery_rider.jpg"
                alt="Rite Plus 30 Minute Medicine Delivery"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-bold text-sm">Dedicated Chilled Delivery Riders</div>
                <div className="text-xs text-white/80">Delivering to homes across the city in 30 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
