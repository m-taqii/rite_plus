'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StaffSidebar from '@/components/dashboard/StaffSidebar';
import { getCurrentStaff, logoutStaff } from '@/lib/auth';
import { Lock, Loader2 } from 'lucide-react';

export default function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const staff = getCurrentStaff();
    const token = typeof window !== 'undefined' ? localStorage.getItem('rite_plus_staff_token') : null;

    if (!staff || !token) {
      setIsAuthenticated(false);
      logoutStaff();
      router.replace(`/staff/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Ensure client cookie is synced for edge middleware protection
    document.cookie = `rite_plus_staff_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    setIsAuthenticated(true);
  }, [router, pathname]);

  return (
    <div
      data-lenis-prevent
      className="flex h-screen w-full bg-[#F8FAF9] text-[#0F172A] font-sans antialiased overflow-hidden selection:bg-[#E0F2FE] selection:text-[#0369A1]"
    >
      {isAuthenticated ? (
        <>
          <StaffSidebar />
          <main
            data-lenis-prevent
            className="flex-1 flex flex-col h-full min-h-0 overflow-y-auto overflow-x-hidden bg-[#F8FAF9]"
          >
            {children}
          </main>
        </>
      ) : (
        <div className="flex h-screen w-full items-center justify-center bg-[#F8FAF9] text-[#0F172A] font-sans">
          <div className="flex flex-col items-center justify-center p-8 max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A] mb-1 font-display">
              Restricted Staff Portal
            </h2>
            <p className="text-xs text-[#64748B] mb-5">
              Institutional clearance required. Checking authorized staff credentials...
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-[#0369A1] font-semibold bg-[#E0F2FE] px-3 py-1.5 rounded-full">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying session...</span>
            </div>
          </div>
          {/* Always retain children in layout tree for Next.js router validation */}
          <div className="hidden" aria-hidden="true">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
