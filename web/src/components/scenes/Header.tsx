'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePharmacy } from '@/context/PharmacyContext';
import { headerCategories } from '@/data/categories';
import CategoryNav from './CategoryNav';
import {
  Search,
  ShoppingCart,
  Camera,
  Phone,
  MessageCircle,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

export default function Header({ variant = 'solid' }: HeaderProps) {
  const {
    cartCount,
    setIsCartOpen,
    setIsPrescriptionModalOpen,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
  } = usePharmacy();

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        const target = document.getElementById('medicines') || document.getElementById('upload-rx');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.location.href = '/#medicines';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-2xs transition-all">
      {/* ── Top Main Navbar Row ── */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0369A1] group-hover:text-[#0284C7] transition-colors">
                  RITE PLUS
                </span>
                <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0369A1] border border-[#BAE6FD]">
                  Rx
                </span>
              </div>
              <span className="text-[10px] font-medium text-[#64748B] -mt-1 tracking-tight hidden sm:block">
                Pharmacy & Wellness Experts
              </span>
            </div>
          </Link>

          {/* Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for "Medicine", generic formula, or brand...'
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-[#F8FAF9] border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#0284C7] focus:bg-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Instant Order / Upload Prescription Pill Button */}
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white px-3.5 sm:px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              title="Upload Doctor's Prescription"
            >
              <Camera className="w-3.5 h-3.5 text-sky-100" />
              <span className="hidden sm:inline">Instant Order</span>
              <span className="sm:hidden">Rx</span>
            </button>

            {/* Patient Account / Sign In */}
            <Link
              href="/login"
              className="flex items-center justify-center p-2 text-gray-700 hover:text-[#0284C7] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Patient Account / Sign In"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2 text-gray-700 hover:text-[#0284C7] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Open Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#0284C7] text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center text-gray-700 hover:text-[#0284C7] rounded-lg transition-colors cursor-pointer"
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
      </div>

      {/* ── Category Navigation Bar (Directly Under the Navbar) ── */}
      <CategoryNav />

      {/* ── Slide-Down Mobile Drawer Menu ── */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-6 text-gray-800 shadow-2xl md:hidden animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Input */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-hidden focus:border-[#0284C7]"
            />
          </form>

          <nav className="flex flex-col gap-4 font-semibold text-sm">
            <div className="border-b border-gray-100 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0369A1] mb-2.5">
                Browse Departments
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {headerCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCategory(c.name);
                      setMobileMenuOpen(false);
                      handleSearchSubmit();
                    }}
                    className="flex items-center justify-between py-1.5 text-gray-700 hover:text-[#0369A1] text-left cursor-pointer"
                  >
                    <span>{c.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/#medicines"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#0369A1] transition-colors"
            >
              Popular Formulary Medicines
            </Link>
            <Link
              href="/#cold-chain"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#0369A1] transition-colors"
            >
              Insulin & Cold-Chain Storage
            </Link>
            <Link
              href="/#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#0369A1] transition-colors"
            >
              Why Choose Rite Plus
            </Link>

            <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-800 shadow-2xs hover:bg-gray-100 transition-colors"
              >
                <User className="h-4 w-4 text-[#0369A1]" />
                <span>Sign In / Patient Account</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPrescriptionModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] py-3 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span>Upload Doctor&apos;s Prescription</span>
              </button>

              <a
                href="https://wa.me/923001234567?text=Hi%20Rite%20Plus,%20I%20want%20to%20order%20medicines"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-[#25D366]/10 text-[#128C7E] py-3 text-xs font-bold hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Order on WhatsApp (0300-1234567)</span>
              </a>

              <a
                href="tel:042111748375"
                className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-[#0369A1]"
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
