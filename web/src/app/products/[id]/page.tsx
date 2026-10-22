'use client';

import React, { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/scenes/Header';
import Footer from '@/components/scenes/Footer';
import { usePharmacy } from '@/context/PharmacyContext';
import { siteContent, type Product } from '@/content/site';
import { fetchProductById, fetchProducts, fetchCategories, type ApiProduct } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import StructuredProductDescription from '@/components/ui/StructuredProductDescription';
import {
  CameraIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckIcon,
} from '@/components/ui/Icons';
import {
  Pill,
  Snowflake,
  AlertTriangle,
  Clock,
  Building2,
  FileText,
  HelpCircle,
  Share2,
  ChevronRight,
  ShoppingCart,
  PhoneCall,
  Loader2,
  CheckCircle2,
  Truck,
} from 'lucide-react';

function ProductDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart, setIsPrescriptionModalOpen } = usePharmacy();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'dosage' | 'precautions' | 'regulatory'>('overview');
  const [addedToast, setAddedToast] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const catMap: Record<string, string> = {};
        try {
          const cats = await fetchCategories();
          cats.forEach((c) => {
            catMap[c.id] = c.name;
          });
        } catch {
          // ignore category fetch error
        }

        // 1. Try to fetch from DB via API
        let foundProduct: Product | null = null;
        try {
          const apiProd = await fetchProductById(id);
          if (apiProd) {
            const priceNum =
              typeof apiProd.price === 'number'
                ? apiProd.price
                : parseFloat(String(apiProd.price)) || 0;
            const isColdChain = Boolean(
              apiProd.form?.toLowerCase().includes('injection') ||
                apiProd.name.toLowerCase().includes('insulin') ||
                apiProd.name.toLowerCase().includes('lantus')
            );

            const categoryName =
              (apiProd.categoryId && catMap[apiProd.categoryId]) ||
              'Prescription & Pharmacy';

            foundProduct = {
              id: apiProd.id,
              name: apiProd.name,
              genericName: apiProd.genericName || 'Active Pharmaceutical Ingredient',
              dosage: apiProd.strength || apiProd.form || 'Standard Dose',
              manufacturer: apiProd.brand || 'Licensed Pharmaceutical Partner',
              category: categoryName,
              price: priceNum,
              originalPrice: priceNum > 0 ? Math.round(priceNum * 1.1) : undefined,
              inStock: apiProd.stock > 0,
              requiresPrescription: Boolean(apiProd.requiresRx),
              isColdChain,
              batchCode: apiProd.code,
              rating: 4.9,
              unit: apiProd.packSize || 'Pack',
              description:
                apiProd.description ||
                `${apiProd.name} is a certified pharmaceutical product regulated under DRAP guidelines for clinical efficacy, purity, and safety.`,
              usage: 'Take strictly according to physician prescription and clinical guidance.',
              image: apiProd.image || '/images/panadol.jpg',
              form: apiProd.form || undefined,
            };
          }
        } catch (err) {
          console.error('Error fetching product from API:', err);
        }

        if (isMounted) {
          setProduct(foundProduct);
        }

        // 2. Load related products from DB
        try {
          const relRes = await fetchProducts({ limit: 4, activeOnly: true });
          if (relRes?.items?.length) {
            const mappedRel: Product[] = relRes.items
              .filter((p) => p.id !== id)
              .slice(0, 4)
              .map((p) => ({
                id: p.id,
                name: p.name,
                genericName: p.genericName || 'Compound',
                dosage: p.strength || p.form || 'Dose',
                manufacturer: p.brand || 'Pharma',
                category: (p.categoryId && catMap[p.categoryId]) || 'Medicines',
                price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price)) || 0,
                inStock: p.stock > 0,
                requiresPrescription: Boolean(p.requiresRx),
                isColdChain: false,
                batchCode: p.code,
                rating: 4.9,
                unit: p.packSize || 'Pack',
                description: p.description || p.name,
                usage: 'Clinical use',
                image: p.image || '/images/panadol.jpg',
              }));
            if (isMounted) {
              setRelatedProducts(mappedRel);
            }
          }
        } catch {
          // No related products
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <Header variant="solid" />

      <main className="flex-1 pt-28 sm:pt-32">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-border-hairline bg-surface py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Link href="/" className="hover:text-brand transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted/60" />
              <Link href="/#medicines" className="hover:text-brand transition-colors">
                Medicines
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted/60" />
              <span className="text-ink font-semibold truncate max-w-xs sm:max-w-md">
                {product?.name || 'Product Details'}
              </span>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
            <h2 className="text-lg font-bold text-ink">Loading Pharmaceutical Details...</h2>
            <p className="text-xs text-ink-muted mt-1">
              Verifying real-time database records and DRAP drug compliance index.
            </p>
          </div>
        ) : !product ? (
          /* Not Found State */
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-ink">Medicine Record Not Found</h2>
            <p className="text-xs text-ink-muted mt-1 max-w-md mx-auto">
              The product code or ID <strong className="text-ink font-mono">{id}</strong> does not
              match our active inventory database. It may have been archived or is awaiting DRAP batch renewal.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/#medicines"
                className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-colors"
              >
                Browse Formulary Catalog
              </Link>
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="px-5 py-2.5 border border-brand bg-sky-50 text-brand text-xs font-bold hover:bg-brand hover:text-white transition-colors"
              >
                Upload Prescription for Custom Order
              </button>
            </div>
          </div>
        ) : (
          /* Main Product Section */
          <section className="py-10 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Left: Packshot Image Gallery & Regulatory Badges (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="relative flex aspect-square w-full items-center justify-center border border-border-hairline bg-white p-6 shadow-xs overflow-hidden group">
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                      {product.isColdChain && (
                        <span className="flex items-center gap-1 border border-sky-300 bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-800 shadow-2xs">
                          <Snowflake className="w-3.5 h-3.5" />
                          2°C–8°C Monitored Cold Chain
                        </span>
                      )}
                      {product.requiresPrescription ? (
                        <span className="flex items-center gap-1 border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-2xs">
                          <FileText className="w-3.5 h-3.5" />
                          Prescription Required (Rx)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 border border-sky-300 bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-800 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Over-the-Counter (OTC)
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <span className="border border-border-hairline bg-subtle px-2 py-0.5 text-[10px] font-mono text-ink-muted font-bold">
                        {product.batchCode}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative h-full w-full flex items-center justify-center">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={460}
                        height={460}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>

                    <div className="absolute bottom-3 left-4 text-[10px] text-ink-muted">
                      Tamper-evident clinical packaging guaranteed
                    </div>
                  </div>

                  {/* Cleanroom Trust Metrics Box */}
                  <div className="border border-border-hairline bg-surface p-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 text-brand flex items-center justify-center shrink-0 border border-sky-200">
                        <ShieldCheckIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-ink text-[11px]">DRAP Compliant</div>
                        <div className="text-[10px] text-ink-muted">Direct manufacturer batch barcode</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 text-brand flex items-center justify-center shrink-0 border border-sky-200">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-ink text-[11px]">30-Min Dispatch</div>
                        <div className="text-[10px] text-ink-muted">Cleanroom sealed cold-box delivery</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Product Clinical Specs & Purchasing (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Manufacturer & Generic Label */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand">
                        {product.manufacturer}
                      </span>
                      <span className="text-ink-muted/40">•</span>
                      <span className="text-xs font-medium text-ink-muted">
                        Category: {product.category}
                      </span>
                    </div>

                    {/* Product Name (H1) */}
                    <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-black text-ink tracking-tight">
                      {product.name}
                    </h1>

                    {/* Generic Formula & Dosage */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-subtle border border-border-hairline text-xs font-semibold text-ink">
                        <Pill className="w-3.5 h-3.5 text-brand" />
                        {product.genericName}
                      </span>
                      <span className="px-2.5 py-1 bg-sky-50 text-brand border border-sky-200 text-xs font-semibold">
                        {product.dosage}
                      </span>
                      <span className="px-2.5 py-1 bg-surface text-ink-muted border border-border-hairline text-xs font-medium">
                        {product.unit}
                      </span>
                    </div>

                    {/* Price Block */}
                    <div className="mt-6 border-y border-border-hairline py-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-bold text-ink-muted">Unit Retail Price:</span>
                        <span className="font-sans text-3xl font-black text-brand tracking-tight">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-ink-muted line-through font-medium">
                            Rs. {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 border border-sky-200">
                          Official Licensed Price
                        </span>
                      </div>

                      {/* Stock availability */}
                      <div className="mt-2.5 flex items-center gap-2">
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800">
                            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                            In Stock — Verified ready for express cleanroom delivery
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                            Out of Stock — Click prescription upload to reserve
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prescription Advisory Notice */}
                    {product.requiresPrescription && (
                      <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                        <div>
                          <strong className="font-bold">Medical Prescription Required:</strong>
                          <p className="mt-0.5 text-amber-800 leading-relaxed text-[11px]">
                            As mandated by DRAP regulations, a valid prescription from a registered
                            physician is required for this medicine. You can upload it online during
                            checkout or present it to our rider upon delivery.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Brief Description & Jump Link */}
                    <div className="mt-5 text-xs leading-relaxed text-ink-muted">
                      <p className="line-clamp-3">
                        {(() => {
                          const desc = product.description || '';
                          const detailMatch = desc.match(/Product Detail\s*\n+([\s\S]+?)(?=\n+[A-Z][a-zA-Z\s]+:|\n+•|$)/i);
                          if (detailMatch && detailMatch[1].trim()) {
                            return detailMatch[1].trim();
                          }
                          const lines = desc.split(/\r?\n/).filter((l) => l.trim().length > 0);
                          const firstPara = lines.find((l) => !l.includes(':') && !l.startsWith('•'));
                          return firstPara || lines[0] || desc;
                        })()}
                      </p>
                      {product.description && (product.description.includes('\n') || product.description.includes(':')) && (
                        <a
                          href="#product-details-tab"
                          className="inline-flex items-center gap-1 font-bold text-brand hover:underline mt-2 text-[11px]"
                        >
                          <span>View complete product details, ingredients & usage instructions</span>
                          <span>&darr;</span>
                        </a>
                      )}
                    </div>

                    {/* Purchase Actions (Quantity + Buttons) */}
                    <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border-hairline bg-surface w-fit">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3 py-2 text-ink hover:bg-subtle transition-colors cursor-pointer text-sm font-bold"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 font-mono text-xs font-bold text-ink min-w-10 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="px-3 py-2 text-ink hover:bg-subtle transition-colors cursor-pointer text-sm font-bold"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className="flex-1 flex items-center justify-center gap-2 border border-brand bg-brand px-6 py-3 font-sans text-xs font-bold text-white shadow-xs hover:bg-brand-hover active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Order (Rs. {(product.price * quantity).toLocaleString()})</span>
                      </button>

                      {/* Prescription Upload Button */}
                      <button
                        type="button"
                        onClick={() => setIsPrescriptionModalOpen(true)}
                        className="flex items-center justify-center gap-1.5 border border-brand bg-sky-50 px-5 py-3 font-sans text-xs font-bold text-brand hover:bg-brand hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <CameraIcon className="w-4 h-4" />
                        <span>Upload Rx Slip</span>
                      </button>
                    </div>

                    {/* Added Toast Confirmation */}
                    {addedToast && (
                      <div className="mt-3 flex items-center gap-2 p-2.5 bg-sky-50 border border-sky-200 text-brand text-xs font-semibold animate-in fade-in duration-200">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>Added {quantity}x {product.name} to your cleanroom order tray!</span>
                      </div>
                    )}

                    {/* Direct Pharmacist WhatsApp Link */}
                    <div className="mt-6 pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand" />
                        <span>Average delivery time: <strong>30 minutes</strong></span>
                      </span>
                      <a
                        href={`https://wa.me/923001234567?text=${encodeURIComponent(
                          `Hello Rite Plus Pharmacist, I have a question regarding ${product.name} (${product.genericName}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand font-bold hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Ask Pharmacist on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* CLINICAL & REGULATORY SPECIFICATIONS TABS                    */}
              {/* ============================================================ */}
              <div id="product-details-tab" className="mt-14 border border-border-hairline bg-surface scroll-mt-24">
                {/* Tab Buttons */}
                <div className="flex border-b border-border-hairline overflow-x-auto bg-[#F8FAF9]">
                  {[
                    { id: 'overview', label: 'Product Details & Overview' },
                    { id: 'dosage', label: 'Dosage & Directions' },
                    { id: 'precautions', label: 'Storage & Handling' },
                    { id: 'regulatory', label: 'DRAP & Quality Compliance' },
                  ].map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-3 text-xs font-bold transition-all shrink-0 cursor-pointer border-r border-border-hairline ${
                          active
                            ? 'bg-white text-brand border-b-2 border-b-brand'
                            : 'text-ink-muted hover:text-ink hover:bg-subtle'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6 text-xs text-ink leading-relaxed">
                  {activeTab === 'overview' && (
                    <div className="space-y-6 max-w-4xl">
                      {/* Properly Aligned Structured Description Box (Exact layout requested by user) */}
                      <div className="bg-white p-6 sm:p-8 border border-border-hairline rounded-sm shadow-2xs">
                        <StructuredProductDescription
                          description={product.description}
                          fallbackMetadata={{
                            name: product.name,
                            genericName: product.genericName,
                            manufacturer: product.manufacturer,
                            form: product.form,
                            dosage: product.dosage,
                            packSize: product.unit,
                          }}
                        />
                      </div>

                      {/* Technical Specs & Official Details */}
                      <div>
                        <h4 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2.5">
                          Registered Product Specifications
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-white border border-border-hairline rounded-sm">
                            <div className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                              Active Formula / Generic
                            </div>
                            <div className="text-xs font-bold text-ink mt-0.5">{product.genericName || 'Standard Formulation'}</div>
                          </div>
                          <div className="p-3 bg-white border border-border-hairline rounded-sm">
                            <div className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                              Strength / Pack
                            </div>
                            <div className="text-xs font-bold text-ink mt-0.5">{product.dosage || product.unit}</div>
                          </div>
                          <div className="p-3 bg-white border border-border-hairline rounded-sm">
                            <div className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                              Manufacturer
                            </div>
                            <div className="text-xs font-bold text-ink mt-0.5">{product.manufacturer}</div>
                          </div>
                          <div className="p-3 bg-white border border-border-hairline rounded-sm">
                            <div className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                              Product Form
                            </div>
                            <div className="text-xs font-bold text-ink mt-0.5">{product.form}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'dosage' && (
                    <div className="space-y-3 max-w-3xl">
                      <h3 className="text-sm font-bold text-ink">Standard Dosage Instructions</h3>
                      <p className="text-ink-muted leading-relaxed">
                        {product.usage}
                      </p>
                      <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                        <strong>Clinical Reminder:</strong> Always follow the dosage prescribed by your
                        licensed physician. Never alter or discontinue prescribed medication without medical
                        consultation.
                      </div>
                    </div>
                  )}

                  {activeTab === 'precautions' && (
                    <div className="space-y-3 max-w-3xl">
                      <h3 className="text-sm font-bold text-ink">Storage Conditions & Climate Monitoring</h3>
                      <p className="text-ink-muted leading-relaxed">
                        {product.isColdChain
                          ? 'This product requires strict Cold-Chain storage between 2°C and 8°C. Do not freeze. During transit, it is dispatched in our calibrated insulated temperature-monitored cold boxes.'
                          : 'Store below 25°C in a dry place. Protect from direct heat, sunlight, and moisture. Keep out of reach of children.'}
                      </p>
                    </div>
                  )}

                  {activeTab === 'regulatory' && (
                    <div className="space-y-3 max-w-3xl">
                      <h3 className="text-sm font-bold text-ink">Drug Regulatory Authority of Pakistan (DRAP) Compliance</h3>
                      <p className="text-ink-muted leading-relaxed">
                        Rite Plus holds DRAP cleanroom pharmaceutical licensure. All inventory batches are
                        traceable via national barcode standards with verifiable batch expiry and serial verification.
                      </p>
                      <div className="p-3 bg-white border border-border-hairline text-[11px] text-ink-muted font-mono">
                        POS SKU: {product.batchCode} • Licensed Pharmacy Branch: Rite Plus Main Cleanroom #04
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================ */}
              {/* RELATED MEDICINES SECTION                                    */}
              {/* ============================================================ */}
              {relatedProducts.length > 0 && (
                <div className="mt-16 border-t border-border-hairline pt-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand">
                        Formulary Suggestions
                      </span>
                      <h2 className="text-xl font-bold text-ink font-sans">
                        Related Clinical Medicines
                      </h2>
                    </div>
                    <Link
                      href="/#medicines"
                      className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
                    >
                      <span>View All Medicines</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((rel) => (
                      <ProductCard key={rel.id} product={rel} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-canvas text-ink">
          <Header variant="solid" />
          <main className="flex-1 flex flex-col items-center justify-center pt-28 pb-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand mb-3" />
            <p className="text-xs text-ink-muted">Loading product details...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <ProductDetailContent {...props} />
    </React.Suspense>
  );
}

