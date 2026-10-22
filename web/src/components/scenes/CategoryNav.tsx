'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { headerCategories, type CategoryGroup } from '@/data/categories';
import { usePharmacy } from '@/context/PharmacyContext';
import { fetchCategories, type ApiCategory } from '@/lib/api';
import { ChevronDown, ChevronRight, LayoutGrid, ArrowRight } from 'lucide-react';

interface NavSubCategory {
  id: string;
  name: string;
  slug: string;
  items: string[];
}

interface NavCategoryGroup {
  id: string;
  name: string;
  slug: string;
  subcategories: NavSubCategory[];
}

export default function CategoryNav() {
  const router = useRouter();
  const { setActiveCategory, setSearchQuery } = usePharmacy();
  const [dbCategories, setDbCategories] = useState<ApiCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string | null>(null);
  const [menuStyle, setMenuStyle] = useState<{ left?: number; right?: number }>({ left: 16 });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setDbCategories(cats);
        }
      })
      .catch(() => {});
  }, []);

  // Build hierarchical categories from DB if available, else fallback to headerCategories
  const categoriesList: NavCategoryGroup[] = useMemo(() => {
    if (dbCategories.length === 0) {
      return headerCategories;
    }

    // Top level categories
    const topCats = dbCategories.filter((c) => !c.parentId);
    if (topCats.length === 0) {
      return headerCategories;
    }

    return topCats.map((top) => {
      const subs = dbCategories.filter((c) => c.parentId === top.id);

      // Find if we have static sample items for this slug
      const staticMatch = headerCategories.find(
        (hc) => hc.slug === top.slug || hc.name.toLowerCase() === top.name.toLowerCase()
      );

      const mappedSubs: NavSubCategory[] = subs.map((sub) => {
        const staticSubMatch = staticMatch?.subcategories.find(
          (sc) => sc.slug === sub.slug || sc.name.toLowerCase() === sub.name.toLowerCase()
        );

        return {
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          items: staticSubMatch?.items || [
            `Top ${sub.name} Formulas`,
            `Genuine ${sub.name} Brands`,
            `Certified Pharmacist Pick`,
            `View All ${sub.name}`,
          ],
        };
      });

      // If no subcategories found in DB for this top category, keep a default "General" subcategory
      if (mappedSubs.length === 0) {
        mappedSubs.push({
          id: `${top.id}-all`,
          name: `All ${top.name}`,
          slug: top.slug,
          items: [`Browse All ${top.name}`],
        });
      }

      return {
        id: top.id,
        name: top.name,
        slug: top.slug,
        subcategories: mappedSubs,
      };
    });
  }, [dbCategories]);

  // Active category object
  const activeCategory = categoriesList.find((c) => c.id === activeCategoryId);

  // Position calculation for dropdown
  const updateMenuPosition = (categoryId: string) => {
    const btn = buttonRefs.current[categoryId];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const dropdownWidth = 560;

    const leftOffset = btnRect.left - containerRect.left;
    const rightOffset = containerRect.right - btnRect.right;

    if (leftOffset + dropdownWidth > containerRect.width - 16) {
      setMenuStyle({ right: Math.max(16, rightOffset), left: undefined });
    } else {
      setMenuStyle({ left: Math.max(16, leftOffset), right: undefined });
    }
  };

  const handleMouseEnterCategory = (category: NavCategoryGroup) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveCategoryId(category.id);
    setActiveSubCategoryId(category.subcategories[0]?.id || null);
    updateMenuPosition(category.id);
  };

  const handleMouseLeaveNav = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategoryId(null);
      setActiveSubCategoryId(null);
    }, 180);
  };

  const handleMouseEnterDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleCategoryClick = (category: NavCategoryGroup) => {
    setActiveCategory(category.name);
    setActiveCategoryId(null);
    setActiveSubCategoryId(null);
    router.push(`/products/category/${category.slug}`);
  };

  const handleSubCategoryClick = (sub: NavSubCategory, cat: NavCategoryGroup) => {
    setActiveCategory(cat.name);
    setSearchQuery(sub.name);
    setActiveCategoryId(null);
    setActiveSubCategoryId(null);
    router.push(`/products/category/${sub.slug}`);
  };

  const handleItemClick = (itemText: string, cat: NavCategoryGroup, sub?: NavSubCategory) => {
    setActiveCategory(cat.name);
    setSearchQuery(itemText);
    setActiveCategoryId(null);
    setActiveSubCategoryId(null);
    if (sub) {
      router.push(`/products/category/${sub.slug}?search=${encodeURIComponent(itemText)}`);
    } else {
      router.push(`/products/category/${cat.slug}?search=${encodeURIComponent(itemText)}`);
    }
  };

  // Find active subcategory object
  const currentSubCategory =
    activeCategory?.subcategories.find((s) => s.id === activeSubCategoryId) ||
    activeCategory?.subcategories[0];

  return (
    <div
      className="relative z-40 bg-white border-b border-gray-200 select-none shadow-2xs"
      onMouseLeave={handleMouseLeaveNav}
    >
      <div ref={containerRef} className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Horizontal Navigation List */}
        <nav
          className="flex items-center justify-between overflow-x-auto py-2 no-scrollbar gap-5 sm:gap-7"
          aria-label="Departments Navigation"
        >
          {/* Direct Link to All Products Catalog */}
          <div className="shrink-0">
            <Link
              href="/products"
              className="group flex items-center gap-1.5 py-1 text-xs sm:text-[13px] font-bold text-[#0369A1] hover:text-[#0284C7] transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">All Products</span>
            </Link>
          </div>

          {categoriesList.map((cat) => {
            const isOpen = activeCategoryId === cat.id;

            return (
              <div key={cat.id} className="shrink-0">
                <button
                  ref={(el) => {
                    buttonRefs.current[cat.id] = el;
                  }}
                  type="button"
                  onMouseEnter={() => handleMouseEnterCategory(cat)}
                  onClick={() => handleCategoryClick(cat)}
                  className={`group flex items-center gap-1.5 py-1 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                    isOpen
                      ? 'text-[#0369A1] font-bold'
                      : 'text-gray-700 hover:text-[#0369A1]'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="whitespace-nowrap">{cat.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 group-hover:text-[#0369A1] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0369A1]' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </nav>

        {/* ── 2-Column Cascading Mega Menu Dropdown ── */}
        {activeCategoryId && activeCategory && (
          <div
            onMouseEnter={handleMouseEnterDropdown}
            className="absolute top-full z-50 pt-1"
            style={
              menuStyle.left !== undefined
                ? { left: `${menuStyle.left}px` }
                : { right: `${menuStyle.right}px` }
            }
          >
            <div
              className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
              style={{ width: '560px', maxHeight: '440px' }}
            >
              {/* LEFT COLUMN: Subcategories */}
              <div className="w-56 shrink-0 border-r border-gray-100 bg-[#F8FAF9] p-2.5 flex flex-col justify-between">
                <div>
                  <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {activeCategory.name} Subcategories
                  </div>
                  <div className="max-h-75 space-y-1 overflow-y-auto pr-1">
                    {activeCategory.subcategories.map((sub) => {
                      const isSubActive = currentSubCategory?.id === sub.id;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onMouseEnter={() => setActiveSubCategoryId(sub.id)}
                          onClick={() => handleSubCategoryClick(sub, activeCategory)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all sm:text-[13px] cursor-pointer ${
                            isSubActive
                              ? 'bg-[#0369A1] text-white shadow-xs'
                              : 'text-gray-700 hover:bg-gray-200/60 hover:text-[#0369A1]'
                          }`}
                        >
                          <span className="truncate pr-1.5">{sub.name}</span>
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 transition-transform ${
                              isSubActive ? 'text-white' : 'text-gray-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* View whole parent category */}
                <Link
                  href={`/products/category/${activeCategory.slug}`}
                  onClick={() => {
                    setActiveCategoryId(null);
                    setActiveSubCategoryId(null);
                  }}
                  className="mt-2 flex items-center justify-between rounded-lg border border-[#0369A1]/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#0369A1] hover:bg-[#E0F2FE] transition-colors"
                >
                  <span>View All {activeCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* RIGHT COLUMN: Specific Products & Conditions */}
              <div className="flex-1 bg-white p-3.5 flex flex-col justify-between">
                <div>
                  <div className="mb-2.5 flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[11px] font-bold tracking-wider text-[#0369A1] uppercase truncate">
                      {currentSubCategory?.name}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {currentSubCategory?.items.length || 0} items
                    </span>
                  </div>

                  <div className="max-h-65 space-y-1 overflow-y-auto pr-1">
                    {currentSubCategory?.items.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleItemClick(item, activeCategory, currentSubCategory)}
                        className="group/item flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-[#E0F2FE] hover:text-[#0369A1] sm:text-[13px]"
                      >
                        <span className="truncate group-hover/item:font-medium">
                          {item}
                        </span>
                        <span className="text-[10px] text-gray-400 opacity-0 transition-opacity group-hover/item:opacity-100 group-hover/item:text-[#0369A1]">
                          Explore →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deep Dive Action */}
                <Link
                  href={`/products/category/${currentSubCategory?.slug || activeCategory.slug}`}
                  onClick={() => {
                    setActiveCategoryId(null);
                    setActiveSubCategoryId(null);
                  }}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#0369A1] hover:bg-[#0284C7] px-3 py-2 text-xs font-bold text-white transition-colors shadow-xs"
                >
                  <span>Browse All {currentSubCategory?.name || activeCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
