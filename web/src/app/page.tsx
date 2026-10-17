import Header from '@/components/scenes/Header';
import Hero from '@/components/scenes/Hero';
import QuickPrescriptionBar from '@/components/scenes/QuickPrescriptionBar';
import CategoryMatrix from '@/components/scenes/CategoryMatrix';
import SignatureColdChain from '@/components/scenes/SignatureColdChain';
import ProductCatalog from '@/components/scenes/ProductCatalog';
import ClinicalStandards from '@/components/scenes/ClinicalStandards';
import OrderConvert from '@/components/scenes/OrderConvert';
import Footer from '@/components/scenes/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {/* Precision Header */}
      <Header />

      <main className="flex-1">
        {/* Act 1 Hook: 0 to 3 seconds */}
        <Hero />

        {/* 3-Step Express Prescription Uplink */}
        <QuickPrescriptionBar />

        {/* Formulary Directory Grid */}
        <CategoryMatrix />

        {/* The Signature Moment: Pinned Horizontal Cold-Chain Inspection Strip */}
        <SignatureColdChain />

        {/* Live Searchable & Filterable Specimen Catalog */}
        <ProductCatalog />

        {/* Clinical Cleanroom Benchmarks & Licensure */}
        <ClinicalStandards />

        {/* Act 3 Convert: Rapid 30-Minute Dispatch Fulfillment */}
        <OrderConvert />
      </main>

      {/* Editorial Regulatory Footer */}
      <Footer />
    </div>
  );
}
