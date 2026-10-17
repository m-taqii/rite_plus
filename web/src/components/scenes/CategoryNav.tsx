'use client';

import React, { useState, useRef } from 'react';
import { headerCategories, CategoryGroup } from '@/data/categories';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function CategoryNav() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string | null>(null);
  const [menuStyle, setMenuStyle] = useState<{ left?: number; right?: number }>({ left: 16 });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active category object
  const activeCategory = headerCategories.find((c) => c.id === activeCategoryId);

  // Position calculation
  const updateMenuPosition = (categoryId: string) => {
    const btn = buttonRefs.current[categoryId];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const dropdownWidth = 520;

    const leftOffset = btnRect.left - containerRect.left;
    const rightOffset = containerRect.right - btnRect.right;

    // If aligning to button left would cause the 520px dropdown to overflow the container on the right:
    if (leftOffset + dropdownWidth > containerRect.width - 16) {
      // Align to the right side of the container / button
      setMenuStyle({ right: Math.max(16, rightOffset), left: undefined });
    } else {
      setMenuStyle({ left: Math.max(16, leftOffset), right: undefined });
    }
  };

  const handleMouseEnterCategory = (category: CategoryGroup) => {
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

  const handleItemClick = () => {
    setActiveCategoryId(null);
    setActiveSubCategoryId(null);
    const searchSection = document.getElementById('medicines') || document.getElementById('upload-rx');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find active subcategory object
  const currentSubCategory =
    activeCategory?.subcategories.find((s) => s.id === activeSubCategoryId) ||
    activeCategory?.subcategories[0];

  return (
    <div
      className="relative z-50 border-t border-b border-border-hairline bg-surface select-none"
      onMouseLeave={handleMouseLeaveNav}
    >
      <div ref={containerRef} className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Horizontal Navigation List */}
        <nav
          className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar lg:overflow-visible lg:justify-between"
          aria-label="Category Navigation"
        >
          {headerCategories.map((cat) => {
            const isOpen = activeCategoryId === cat.id;

            return (
              <div key={cat.id} className="shrink-0">
                <button
                  ref={(el) => {
                    buttonRefs.current[cat.id] = el;
                  }}
                  type="button"
                  onMouseEnter={() => handleMouseEnterCategory(cat)}
                  onClick={() => {
                    if (isOpen) {
                      setActiveCategoryId(null);
                    } else {
                      setActiveCategoryId(cat.id);
                      setActiveSubCategoryId(cat.subcategories[0]?.id || null);
                      updateMenuPosition(cat.id);
                    }
                  }}
                  className={`group flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:text-[13px] ${
                    isOpen
                      ? 'bg-accent-soft text-brand font-bold shadow-2xs'
                      : 'text-ink-secondary hover:bg-subtle hover:text-brand'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-ink-muted transition-transform duration-200 group-hover:text-brand ${
                      isOpen ? 'rotate-180 text-brand' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </nav>

        {/* ── 2-Column Cascading Mega Menu Dropdown ── */}
        {/* Rendered at the non-overflowing container level so it never gets clipped! */}
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
              className="flex overflow-hidden rounded-xl border border-border-hairline bg-surface shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
              style={{ width: '520px', maxHeight: '420px' }}
            >
              {/* LEFT COLUMN: Subcategories */}
              <div className="w-56 shrink-0 border-r border-border-hairline bg-subtle/60 p-2.5">
                <div className="max-h-95 space-y-1 overflow-y-auto pr-1">
                  {activeCategory.subcategories.map((sub) => {
                    const isSubActive = currentSubCategory?.id === sub.id;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onMouseEnter={() => setActiveSubCategoryId(sub.id)}
                        onClick={() => setActiveSubCategoryId(sub.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all sm:text-[13px] ${
                          isSubActive
                            ? 'bg-brand text-white shadow-xs'
                            : 'text-ink hover:bg-slate-200/60 hover:text-brand'
                        }`}
                      >
                        <span className="truncate pr-1.5">{sub.name}</span>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            isSubActive ? 'text-white' : 'text-ink-muted'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Items / Conditions */}
              <div className="flex-1 bg-surface p-3.5">
                <div className="mb-2.5 flex items-center justify-between border-b border-border-hairline pb-2">
                  <span className="text-[11px] font-bold tracking-wider text-brand uppercase">
                    {currentSubCategory?.name}
                  </span>
                  <span className="text-[10px] text-ink-faint">
                    {currentSubCategory?.items.length || 0} categories
                  </span>
                </div>

                <div className="max-h-85 space-y-1 overflow-y-auto pr-1">
                  {currentSubCategory?.items.map((item, i) => (
                    <div
                      key={i}
                      onClick={handleItemClick}
                      className="group/item flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-ink transition-colors hover:bg-accent-soft/50 hover:text-brand sm:text-[13px]"
                    >
                      <span className="truncate group-hover/item:font-medium">
                        {item}
                      </span>
                      <span className="text-[10px] text-ink-faint opacity-0 transition-opacity group-hover/item:opacity-100 group-hover/item:text-brand">
                        Explore →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
