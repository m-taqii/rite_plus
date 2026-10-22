'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/scenes/Header';
import Footer from '@/components/scenes/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import PrescriptionModal from '@/components/ui/PrescriptionModal';
import { usePharmacy } from '@/context/PharmacyContext';
import { fetchCategories, fetchProducts, type ApiCategory, type ApiProduct } from '@/lib/api';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Tag,
  Snowflake,
  AlertTriangle,
  Loader2,
  PackageX,
  Layers,
} from 'lucide-react';

interface CategoryWithProducts {
  category: ApiCategory;
  subcategories: ApiCategory[];
  products: ApiProduct[];
}

export default function ProductsPage() {
  const { addToCart, isPrescriptionModalOpen, setIsPrescriptionModalOpen } = usePharmacy();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 250, activeOnly: true }),
    ])
      .then(([catList, prodRes]) => {
        if (Array.isArray(catList)) {
          setCategories(catList);
        }
        if (prodRes && prodRes.items) {
          setProducts(prodRes.items);
        }
      })
      .catch((err) => {
        console.error('Error fetching products page data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Organize products under their top-level categories
  const categoriesWithProducts: CategoryWithProducts[] = useMemo(() => {
    // 1. Get all top level categories (where parentId is null)
    const topCats = categories.filter((c) => !c.parentId);

    return topCats
      .map((top) => {
        const subs = categories.filter((c) => c.parentId === top.id);
        const validCategoryIds = new Set([top.id, ...subs.map((s) => s.id)]);

        // Find products belonging to top category OR any of its subcategories
        const matchingProducts = products.filter((p) => {
          if (!p.categoryId) return false;
          if (!validCategoryIds.has(p.categoryId)) return false;

          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const text = `${p.name} ${p.genericName || ''} ${p.brand || ''} ${p.description || ''}`.toLowerCase();
            return text.includes(q);
          }
          return true;
        });

        return {
          category: top,
          subcategories: subs,
          products: matchingProducts,
        };
      })
      .filter((group) => {
        // If there's an active search query, only show groups with matching products
        if (searchQuery.trim()) {
          return group.products.length > 0;
        }
        return true;
      });
  }, [categories, products, searchQuery]);

  const handleScroll = (categoryId: string, direction: 'left' | 'right') => {
    const el = scrollRowRefs.current[categoryId];
    if (!el) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleAddToCart = (p: ApiProduct) => {
    addToCart({
      id: p.id,
      name: p.name,
      genericName: p.genericName || 'Pharmaceutical Compound',
      dosage: p.strength || p.form || 'Standard Dose',
      manufacturer: p.brand || 'Licensed Manufacturer',
      category: 'Medicines',
      price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price)) || 0,
      inStock: p.stock > 0,
      requiresPrescription: Boolean(p.requiresRx),
      isColdChain: Boolean(
        p.form?.toLowerCase().includes('injection') ||
        p.name.toLowerCase().includes('insulin') ||
        p.name.toLowerCase().includes('lantus')
      ),
      batchCode: p.code,
      rating: 4.9,
      unit: p.packSize || 'Pack',
      description: p.description || p.name,
      usage: 'Take as directed by doctor.',
      image: p.image || '/images/panadol.jpg',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-gray-800">
      <Header />
      <CartDrawer />
      <PrescriptionModal />

      <main className="flex-1 pt-32 pb-20">
        {/* ── Page Header & Search Bar ── */}
        <section className="bg-linear-to-b from-sky-500/10 via-sky-500/5 to-transparent border-b border-gray-200/70 pb-8 pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3">
              <Link href="/" className="hover:text-[#0369A1] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#0369A1]">Formulary & Products</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                  Pharmaceutical & Healthcare Catalog
                </h1>
                <p className="mt-2 text-sm text-[#475569] max-w-2xl leading-relaxed">
                  Browse authentic prescription medicines, beauty & dermatological care, cold-chain insulin, and daily wellness products grouped by category.
                </p>
              </div>

              {/* Quick Search */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter products across all categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#0284C7] shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Category Anchor Quick Pills */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-gray-400 shrink-0 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#0369A1]" /> Jump to:
              </span>
              {categoriesWithProducts.map(({ category, products: catProds }) => (
                <a
                  key={category.id}
                  href={`#category-${category.slug}`}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-[#0369A1] hover:border-[#0369A1] transition-all shadow-2xs"
                >
                  {category.name} ({catProds.length})
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Category Product Rows ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 space-y-14">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#0369A1] mb-3" />
              <p className="text-sm font-semibold text-gray-600">
                Loading authentic pharmacy inventory...
              </p>
            </div>
          ) : categoriesWithProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
              <PackageX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-gray-800">
                No matching products found
              </h3>
              <p className="text-xs text-gray-500 mt-1 mb-5">
                We couldn&apos;t find any products matching &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-lg bg-[#0369A1] text-white text-xs font-bold hover:bg-[#0284C7] transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            categoriesWithProducts.map(({ category, subcategories, products: catProds }) => (
              <div
                key={category.id}
                id={`category-${category.slug}`}
                className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-7 shadow-xs relative"
              >
                {/* ── Category Row Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="font-display text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                        {category.name}
                      </h2>
                      <span className="text-xs font-bold text-[#0369A1] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                        {catProds.length} {catProds.length === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1 max-w-xl">
                        {category.description}
                      </p>
                    )}

                    {/* Subcategories tags */}
                    {subcategories.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-gray-400">
                          Subcategories:
                        </span>
                        {subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/products/category/${sub.slug}`}
                            className="text-[11px] font-medium bg-[#F8FAF9] hover:bg-[#E0F2FE] hover:text-[#0369A1] text-gray-600 px-2 py-0.5 rounded-md border border-gray-200 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Carousel Nav & View All */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    {/* Carousel Nav Arrows */}
                    {catProds.length > 3 && (
                      <div className="flex items-center gap-1 bg-[#F8FAF9] p-1 rounded-lg border border-gray-200">
                        <button
                          onClick={() => handleScroll(category.id, 'left')}
                          className="p-1.5 rounded-md text-gray-600 hover:text-[#0369A1] hover:bg-white transition-all cursor-pointer"
                          aria-label="Scroll left"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleScroll(category.id, 'right')}
                          className="p-1.5 rounded-md text-gray-600 hover:text-[#0369A1] hover:bg-white transition-all cursor-pointer"
                          aria-label="Scroll right"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* The Prominent "View All" Button */}
                    <Link
                      href={`/products/category/${category.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0369A1] hover:bg-[#0284C7] text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* ── Horizontally Scrollable Products Row ── */}
                {catProds.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    No products currently listed in this category.
                  </div>
                ) : (
                  <div
                    ref={(el) => {
                      scrollRowRefs.current[category.id] = el;
                    }}
                    className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-2 px-2"
                  >
                    {catProds.map((product) => {
                      const numPrice =
                        typeof product.price === 'number'
                          ? product.price
                          : parseFloat(String(product.price)) || 0;

                      const isColdChain = Boolean(
                        product.form?.toLowerCase().includes('injection') ||
                        product.name.toLowerCase().includes('insulin') ||
                        product.name.toLowerCase().includes('lantus')
                      );

                      return (
                        <div
                          key={product.id}
                          className="w-64 sm:w-72 shrink-0 flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-[#0369A1] transition-all group"
                        >
                          <div>
                            {/* Badges */}
                            <div className="flex items-center justify-between gap-1 text-[10px] font-semibold mb-2">
                              {isColdChain ? (
                                <span className="border border-sky-200 bg-sky-50 px-2 py-0.5 rounded text-sky-800 flex items-center gap-1">
                                  <Snowflake className="w-3 h-3 text-sky-600" />
                                  2°C–8°C
                                </span>
                              ) : (
                                <span className="border border-gray-200 bg-gray-50 px-2 py-0.5 rounded text-gray-600 truncate max-w-30">
                                  {product.brand || 'Authentic'}
                                </span>
                              )}

                              {product.requiresRx ? (
                                <span className="border border-amber-200 bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-bold">
                                  Rx Required
                                </span>
                              ) : (
                                <span className="border border-sky-200 bg-sky-50 px-2 py-0.5 rounded text-sky-800">
                                  OTC
                                </span>
                              )}
                            </div>

                            {/* Product Image */}
                            <Link
                              href={`/products/${product.id}`}
                              className="relative h-44 w-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-2 cursor-pointer group-hover:bg-white transition-colors"
                            >
                              <Image
                                src={product.image || '/images/panadol.jpg'}
                                alt={product.name}
                                width={200}
                                height={180}
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            </Link>

                            {/* Product Info */}
                            <div className="mt-3">
                              {product.genericName && (
                                <p className="text-[11px] font-medium text-gray-400 line-clamp-1">
                                  {product.genericName}
                                </p>
                              )}
                              <Link href={`/products/${product.id}`}>
                                <h3 className="font-sans text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#0369A1] transition-colors mt-0.5 cursor-pointer">
                                  {product.name}
                                </h3>
                              </Link>
                              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                {(product.strength || product.form) && (
                                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    {product.strength || product.form}
                                  </span>
                                )}
                                {product.packSize && (
                                  <span className="text-[10px] text-gray-400">
                                    {product.packSize}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Pricing & Add to Cart */}
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-baseline justify-between mb-2.5">
                              <div>
                                <span className="text-xs font-semibold text-gray-400">
                                  Rs.{' '}
                                </span>
                                <span className="font-sans text-lg font-extrabold text-gray-900">
                                  {numPrice.toLocaleString()}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(product)}
                              type="button"
                              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] py-2 px-3 text-xs font-bold text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
