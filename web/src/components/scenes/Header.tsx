'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePharmacy } from '@/context/PharmacyContext';
import { headerCategories } from '@/data/categories';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
  Camera,
  Phone,
  MessageCircle,
  User,
} from 'lucide-react';

export default function Header() {
  const { cartCount, setIsCartOpen, setIsPrescriptionModalOpen } = usePharmacy();

  // Scroll detection for navbar background transition
  const [isScrolled, setIsScrolled] = useState(false);

  // Categories Mega-Menu state
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('medicine');
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string>('derma');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active Category & Subcategory objects
  const activeCategory =
    headerCategories.find((c) => c.id === activeCategoryId) || headerCategories[0];
  const activeSubCategory =
    activeCategory.subcategories.find((s) => s.id === activeSubCategoryId) ||
    activeCategory.subcategories[0];

  const handleCategoriesMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsCategoriesOpen(true);
  };

  const handleCategoriesMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 180);
  };

  const handleCategoryHover = (catId: string) => {
    setActiveCategoryId(catId);
    const cat = headerCategories.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setActiveSubCategoryId(cat.subcategories[0].id);
    }
  };

  const handleItemClick = () => {
    setIsCategoriesOpen(false);
    setMobileMenuOpen(false);
    const target = document.getElementById('medicines') || document.getElementById('upload-rx');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1C3E28]/95 backdrop-blur-md shadow-lg border-b border-white/10 py-3'
          : 'bg-black/10 sm:bg-transparent backdrop-blur-xs py-4 sm:py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* ── Brand Logo (VEDA GLOW style) ── */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-emerald-200 transition-colors">
            RITE PLUS
          </span>
          <span className="hidden sm:inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 border border-white/20">
            Rx
          </span>
        </a>

        {/* ── Center Navigation Links ── */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-white/90">
          {/* Categories Dropdown Link with 3-Pane Cascading Mega-Menu */}
          <div
            className="relative"
            onMouseEnter={handleCategoriesMouseEnter}
            onMouseLeave={handleCategoriesMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`flex items-center gap-1.5 py-1.5 font-semibold transition-colors ${
                isCategoriesOpen ? 'text-emerald-200' : 'hover:text-white'
              }`}
              aria-expanded={isCategoriesOpen}
            >
              <span>Categories</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isCategoriesOpen ? 'rotate-180 text-emerald-200' : 'text-white/70'
                }`}
              />
            </button>

            {/* ── 3-Column Cascading Mega-Menu Flyout ── */}
            {isCategoriesOpen && (
              <div
                className="absolute top-full left-0 pt-3 z-50"
                style={{ width: '740px', maxWidth: 'calc(100vw - 4rem)' }}
              >
                <div className="flex overflow-hidden rounded-2xl border border-border-hairline bg-surface text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)] animate-in fade-in-0 zoom-in-95 duration-150">
                  {/* PANE 1: Top Departments */}
                  <div className="w-52 shrink-0 border-r border-border-hairline bg-subtle/70 p-2.5">
                    <div className="mb-2 px-2 text-[10px] font-bold tracking-wider text-ink-faint uppercase">
                      Departments
                    </div>
                    <div className="space-y-1">
                      {headerCategories.map((cat) => {
                        const isCatActive = activeCategoryId === cat.id;

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onMouseEnter={() => handleCategoryHover(cat.id)}
                            onClick={() => handleCategoryHover(cat.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                              isCatActive
                                ? 'bg-brand text-white shadow-xs'
                                : 'text-ink hover:bg-slate-200/60 hover:text-brand'
                            }`}
                          >
                            <span className="truncate pr-1">{cat.name}</span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 shrink-0 ${
                                isCatActive ? 'text-white' : 'text-ink-muted'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PANE 2: Subcategories */}
                  <div className="w-56 shrink-0 border-r border-border-hairline bg-surface p-2.5">
                    <div className="mb-2 px-2 text-[10px] font-bold tracking-wider text-brand uppercase truncate">
                      {activeCategory.name}
                    </div>
                    <div className="max-h-90 space-y-1 overflow-y-auto pr-1">
                      {activeCategory.subcategories.map((sub) => {
                        const isSubActive = activeSubCategory.id === sub.id;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onMouseEnter={() => setActiveSubCategoryId(sub.id)}
                            onClick={() => setActiveSubCategoryId(sub.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all ${
                              isSubActive
                                ? 'bg-accent-soft text-brand shadow-2xs font-bold'
                                : 'text-ink hover:bg-subtle hover:text-brand'
                            }`}
                          >
                            <span className="truncate pr-1">{sub.name}</span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 shrink-0 ${
                                isSubActive ? 'text-brand' : 'text-ink-muted'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PANE 3: Conditions / Products */}
                  <div className="flex-1 bg-surface p-3.5">
                    <div className="mb-2 flex items-center justify-between border-b border-border-hairline pb-2 px-1">
                      <span className="text-[11px] font-bold tracking-wider text-brand uppercase truncate">
                        {activeSubCategory.name}
                      </span>
                      <span className="text-[10px] text-ink-faint">
                        {activeSubCategory.items.length} items
                      </span>
                    </div>

                    <div className="max-h-82.5 space-y-1 overflow-y-auto pr-1">
                      {activeSubCategory.items.map((item, i) => (
                        <div
                          key={i}
                          onClick={handleItemClick}
                          className="group/item flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-ink transition-colors hover:bg-accent-soft/50 hover:text-brand"
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

          <a href="#medicines" className="hover:text-white transition-colors">
            Popular Medicines
          </a>
          <a href="#cold-chain" className="hover:text-white transition-colors">
            Insulin Cold-Storage
          </a>
          <a href="#why-us" className="hover:text-white transition-colors">
            Why Rite Plus
          </a>
          <a href="#clinical" className="hover:text-white transition-colors">
            Quality Standards
          </a>
        </nav>

        {/* ── Right Actions (Cart, Upload Rx, Hamburger Menu) ── */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Sign In / Account Link */}
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-emerald-200 active:scale-95"
          >
            <User className="h-3.5 w-3.5 text-emerald-300" />
            <span>Sign In</span>
          </Link>

          {/* Upload Prescription Pill Button */}
          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
          >
            <Camera className="h-3.5 w-3.5 text-emerald-200" />
            <span>Upload Rx</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2 text-white hover:text-emerald-200 transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-black text-slate-900">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center text-white hover:text-emerald-200 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 stroke-[2.2]" />
            ) : (
              <Menu className="h-6 w-6 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Slide-Down Mobile Drawer Menu ── */}
      {mobileMenuOpen && (
        <div className="border-t border-white/15 bg-[#1C3E28]/98 backdrop-blur-xl px-6 py-6 text-white shadow-2xl lg:hidden animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 font-semibold text-base">
            <div className="border-b border-white/15 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                Browse Departments
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {headerCategories.map((c) => (
                  <a
                    key={c.id}
                    href="#medicines"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 text-white/80 hover:text-white"
                  >
                    • {c.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#medicines"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-200 transition-colors"
            >
              Popular Medicines
            </a>
            <a
              href="#cold-chain"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-200 transition-colors"
            >
              Insulin & Cold-Storage
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-200 transition-colors"
            >
              Why Choose Rite Plus
            </a>

            <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-white/15">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-white/25 transition-colors"
              >
                <User className="h-4 w-4 text-emerald-200" />
                <span>Sign In / Patient Account</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPrescriptionModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-full bg-[#52A342] py-3 text-xs font-bold text-white shadow-md"
              >
                <Camera className="h-4 w-4" />
                <span>Upload Doctor&apos;s Prescription</span>
              </button>

              <a
                href="https://wa.me/923001234567?text=Hi%20Rite%20Plus,%20I%20want%20to%20order%20medicines"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 py-3 text-xs font-bold text-white"
              >
                <MessageCircle className="h-4 w-4 text-emerald-300" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href="tel:042111748375"
                className="mt-1 flex items-center justify-center gap-2 text-xs text-white/70 hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Helpline: 042-111-748-375</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
