import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { PharmacyProvider } from '@/context/PharmacyContext';
import Grain from '@/components/ui/Grain';
import PrescriptionModal from '@/components/ui/PrescriptionModal';
import CartDrawer from '@/components/ui/CartDrawer';

export const metadata: Metadata = {
  title: 'Rite Plus | Online Pharmacy — Genuine Medicines in 30 Minutes',
  description:
    'Order 100% original medicines, cold-chain insulin, and baby & wellness care with 30-minute home delivery. DRAP licensed with qualified pharmacist support.',
  keywords: [
    'Rite Plus', 'online pharmacy', 'buy medicine online',
    'insulin delivery Pakistan', '30 minute medicine delivery', 'genuine pharmacy',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-canvas text-ink selection:bg-brand selection:text-white">
        <PharmacyProvider>
          <SmoothScroll>
            <Grain />
            <PrescriptionModal />
            <CartDrawer />
            {children}
          </SmoothScroll>
        </PharmacyProvider>
      </body>
    </html>
  );
}
