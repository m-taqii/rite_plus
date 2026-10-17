'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

interface SplitHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export default function SplitHeading({
  children,
  as: Component = 'h2',
  className = '',
  delay = 0,
  triggerOnScroll = true,
}: SplitHeadingProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      // Desktop & full motion experience
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        try {
          const split = new SplitText(containerRef.current, {
            type: 'lines,words',
            linesClass: 'overflow-hidden inline-block leading-tight',
            wordsClass: 'inline-block',
          });

          const animConfig: gsap.TweenVars = {
            yPercent: 115,
            opacity: 0,
            duration: 1.1,
            stagger: 0.04,
            ease: 'power3.out',
            delay,
          };

          if (triggerOnScroll) {
            animConfig.scrollTrigger = {
              trigger: containerRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            };
          }

          gsap.from(split.words, animConfig);

          return () => {
            split.revert();
          };
        } catch {
          // Fallback if SplitText cannot parse raw children (e.g. complex DOM)
          gsap.from(containerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay,
          });
        }
      });

      // Reduced motion: instant, accessible display
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [delay, triggerOnScroll] }
  );

  return (
    // @ts-expect-error dynamic polymorphic heading tag
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
}
