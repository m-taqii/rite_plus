'use client';

import React, { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/scenes/Header';
import Footer from '@/components/scenes/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import PrescriptionModal from '@/components/ui/PrescriptionModal';
import { usePharmacy } from '@/context/PharmacyContext';
import {
  fetchCategories,
  fetchProducts,
  type ApiCategory,
  type ApiProduct,
} from '@/lib/api';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Snowflake,
  PackageX,
  Loader2,
  Filter,
  Check,
  ChevronRight,
  FolderTree,
  Tag,
  ArrowUpDown,
} from 'lucide-react';

function CategoryProductsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { addToCart, isPrescriptionModalOpen, setIsPrescriptionModalOpen } =
    usePharmacy();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name_asc'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [requiresRxFilter, setRequiresRxFilter] = useState<'all' | 'rx' | 'otc'>('all');

  // Load category hierarchy & products
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
        console.error('Error loading category products:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  // Current category details
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.slug === slug);
  }, [categories, slug]);

  // If current category is a subcategory, find its parent
  const parentCategory = useMemo(() => {
    if (!currentCategory?.parentId) return null;
    return categories.find((c) => c.id === currentCategory.parentId);
  }, [categories, currentCategory]);

  // If current category is a top-level category, find its child subcategories
  const subcategories = useMemo(() => {
    if (!currentCategory) return [];
    // If it's a top level category (no parentId)
    if (!currentCategory.parentId) {
      return categories.filter((c) => c.parentId === currentCategory.id);
    }
    // If it's already a subcategory, return its siblings
    return categories.filter((c) => c.parentId === currentCategory.parentId);
  }, [categories, currentCategory]);

  // Filter products for this category
  const filteredProducts = useMemo(() => {
    if (!currentCategory) return [];

    // Valid category IDs for the root category
    const validCategoryIds = new Set<string>();

    if (!currentCategory.parentId) {
      // Top level category: includes its own ID + all child subcategory IDs
      validCategoryIds.add(currentCategory.id);
      subcategories.forEach((s) => validCategoryIds.add(s.id));
    } else {
      // Subcategory: only includes its own ID
      validCategoryIds.add(currentCategory.id);
    }

    // Filter by category membership
    let list = products.filter((p) => {
      if (!p.categoryId) return false;
      return validCategoryIds.has(p.categoryId);
    });

    // Subcategory pill selection (if viewing top-level and a subcategory pill is active)
    if (selectedSubSlug !== 'all') {
      const subCat = categories.find((c) => c.slug === selectedSubSlug);
      if (subCat) {
        list = list.filter((p) => p.categoryId === subCat.id);
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const text = `${p.name} ${p.genericName || ''} ${p.brand || ''} ${p.description || ''} ${p.code}`.toLowerCase();
        return text.includes(q);
      });
    }

    // In stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Rx filter
    if (requiresRxFilter === 'rx') {
      list = list.filter((p) => p.requiresRx);
    } else if (requiresRxFilter === 'otc') {
      list = list.filter((p) => !p.requiresRx);
    }

    // Sorting
    return [...list].sort((a, b) => {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price)) || 0;
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price)) || 0;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0; // newest / default
    });
  }, [
    currentCategory,
    subcategories,
    products,
    selectedSubSlug,
    searchQuery,
    inStockOnly,
    requiresRxFilter,
    sortBy,
    categories,
  ]);

  const handleAddToCart = (p: ApiProduct) => {
    addToCart({
      id: p.id,
      name: p.name,
      genericName: p.genericName || 'Pharmaceutical Compound',
      dosage: p.strength || p.form || 'Standard Dose',
      manufacturer: p.brand || 'Licensed Manufacturer',
      category: currentCategory?.name || 'Medicines',
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

  const displayName = currentCategory?.name || slug.replace(/-/g, ' ');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-gray-800">
      <Header />
      <CartDrawer />
      <PrescriptionModal />

      <main className="flex-1 pt-32 pb-20">
        {/* ── Category Header Banner ── */}
        <section className="bg-linear-to-b from-sky-500/10 via-sky-500/5 to-transparent border-b border-gray-200/70 pb-8 pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 flex-wrap">
              <Link href="/" className="hover:text-[#0369A1] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/products"
                className="hover:text-[#0369A1] transition-colors"
              >
                Products
              </Link>
              <span>/</span>
              {parentCategory && (
                <>
                  <Link
                    href={`/products/category/${parentCategory.slug}`}
                    className="hover:text-[#0369A1] transition-colors"
                  >
                    {parentCategory.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-[#0369A1] font-bold">{displayName}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight capitalize">
                    {displayName}
                  </h1>
                  <span className="text-xs font-bold text-[#0369A1] bg-[#E0F2FE] px-3 py-1 rounded-full border border-[#BAE6FD]">
                    {filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
                  </span>
                </div>

                <p className="mt-2 text-sm text-[#475569] max-w-2xl leading-relaxed">
                  {currentCategory?.description ||
                    `Explore licensed, authentic ${displayName} formulas sourced direct from verified manufacturers with clinical cold-chain handling.`}
                </p>
              </div>

              {/* Back to Products Catalog */}
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369A1] hover:text-[#0284C7] bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs self-start md:self-end"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Categories</span>
              </Link>
            </div>

            {/* Subcategories Filter Chips */}
            {subcategories.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-gray-400 shrink-0 flex items-center gap-1 mr-1">
                  <FolderTree className="w-3.5 h-3.5 text-[#0369A1]" /> Subcategories:
                </span>

                <button
                  onClick={() => setSelectedSubSlug('all')}
                  className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedSubSlug === 'all'
                      ? 'bg-[#0369A1] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0369A1]'
                  }`}
                >
                  All {displayName}
                </button>

                {subcategories.map((sub) => {
                  const isSelected = selectedSubSlug === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubSlug(sub.slug)}
                      className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0369A1] text-white font-bold shadow-xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0369A1] hover:text-[#0369A1]'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Filtering & Controls Bar ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search within ${displayName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F8FAF9] border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#0284C7] focus:bg-white transition-all"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#F8FAF9] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-gray-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>

              {/* In Stock Only Checkbox */}
              <label className="flex items-center gap-1.5 bg-[#F8FAF9] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#0369A1] focus:ring-0 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              {/* Rx Filter Select */}
              <div className="flex items-center gap-1 bg-[#F8FAF9] border border-gray-200 rounded-xl p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRequiresRxFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    requiresRxFilter === 'all'
                      ? 'bg-white text-[#0369A1] shadow-2xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setRequiresRxFilter('otc')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    requiresRxFilter === 'otc'
                      ? 'bg-white text-[#0369A1] shadow-2xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  OTC Only
                </button>
                <button
                  type="button"
                  onClick={() => setRequiresRxFilter('rx')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    requiresRxFilter === 'rx'
                      ? 'bg-white text-amber-700 shadow-2xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rx Required
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product Catalog Grid ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#0369A1] mb-3" />
              <p className="text-sm font-semibold text-gray-600">
                Fetching authentic {displayName} catalog...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
              <PackageX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-gray-800">
                No products found
              </h3>
              <p className="text-xs text-gray-500 mt-1 mb-5">
                {searchQuery
                  ? `No items match "${searchQuery}".`
                  : `There are currently no products available under this filter.`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubSlug('all');
                  setInStockOnly(false);
                  setRequiresRxFilter('all');
                }}
                className="px-4 py-2 rounded-lg bg-[#0369A1] text-white text-xs font-bold hover:bg-[#0284C7] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
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
                    className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs hover:shadow-lg hover:border-[#0369A1] transition-all duration-200 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 text-[10px] font-semibold mb-3">
                        {isColdChain ? (
                          <span className="border border-sky-200 bg-sky-50 px-2 py-0.5 rounded text-sky-800 flex items-center gap-1 font-bold">
                            <Snowflake className="w-3 h-3 text-sky-600" />
                            2°C–8°C Cold Chain
                          </span>
                        ) : (
                          <span className="border border-gray-200 bg-gray-50 px-2 py-0.5 rounded text-gray-600 truncate max-w-32.5">
                            {product.brand || 'Licensed Formula'}
                          </span>
                        )}

                        {product.requiresRx ? (
                          <span className="border border-amber-200 bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-bold">
                            Rx Required
                          </span>
                        ) : (
                          <span className="border border-sky-200 bg-sky-50 px-2 py-0.5 rounded text-sky-800 font-medium">
                            Over The Counter
                          </span>
                        )}
                      </div>

                      {/* Product Image */}
                      <Link
                        href={`/products/${product.id}`}
                        className="relative h-48 w-full flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-3 cursor-pointer group-hover:bg-white transition-colors"
                      >
                        <Image
                          src={product.image || '/images/panadol.jpg'}
                          alt={product.name}
                          width={220}
                          height={200}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      {/* Details */}
                      <div className="mt-3.5">
                        {product.genericName && (
                          <p className="text-xs font-medium text-gray-400 line-clamp-1">
                            {product.genericName}
                          </p>
                        )}
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-sans text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#0369A1] transition-colors mt-0.5 cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                          {(product.strength || product.form) && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium">
                              {product.strength || product.form}
                            </span>
                          )}
                          {product.packSize && (
                            <span className="text-[10px] text-gray-400">
                              {product.packSize}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="mt-5 pt-3.5 border-t border-gray-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-xs font-semibold text-gray-400">
                            Rs.{' '}
                          </span>
                          <span className="font-sans text-xl font-extrabold text-gray-900">
                            {numPrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          {product.stock > 0 ? '✓ In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        type="button"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] py-2.5 px-3 text-xs font-bold text-white transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                      >
                        <span>🛒 Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryProductsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-gray-800">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0369A1] mb-3" />
            <p className="text-xs text-gray-500 font-medium">Loading category formulary...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <CategoryProductsContent {...props} />
    </React.Suspense>
  );
}
