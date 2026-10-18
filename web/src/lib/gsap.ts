import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

// Shared precision easings for surgical cinematic feel
export const EASINGS = {
  surgical: 'cubic-bezier(0.16, 1, 0.3, 1)',
  snap: 'cubic-bezier(0.25, 1, 0.5, 1)',
  cinema: 'cubic-bezier(0.76, 0, 0.24, 1)',
  entrance: 'power3.out',
  cinematicExpose: 'power4.inOut',
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
