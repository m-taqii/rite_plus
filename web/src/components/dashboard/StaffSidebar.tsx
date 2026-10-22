'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Pill,
  FileText,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Shield,
  Settings,
  ChevronDown,
  ArrowUpRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { getCurrentStaff, logoutStaff } from '@/lib/auth';

export default function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const staff = getCurrentStaff();

  const handleLogout = async () => {
    await logoutStaff();
    router.replace('/staff/login');
  };

  // Only genuine authenticated administrators can see staff management
  const isAdmin = staff?.role === 'admin';

  const navItems = [
    { href: '/staff/dashboard', label: 'Inventory', icon: Pill },
    { href: '/staff/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
    { href: '/staff/dashboard/orders', label: 'Dispensing & Orders', icon: ShoppingCart },
    { href: '/staff/dashboard/patients', label: 'Patients', icon: Users },
    { href: '/staff/dashboard/categories', label: 'Categories', icon: Tag },
    { href: '/staff/dashboard/metrics', label: 'Metrics', icon: BarChart3 },
    // Staff management tab - shown to admin
    ...(isAdmin
      ? [
          {
            href: '/staff/dashboard/staff',
            label: 'Staff Management',
            icon: Shield,
            badge: 'Admin',
            badgeColor: 'bg-[#0369A1] text-white',
          },
        ]
      : []),
    { href: '/staff/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-all duration-300 z-30 select-none`}
    >
      {/* Top: Organization Switcher */}
      <div className="p-3 border-b border-[#F0F4F2]">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8FAF9] transition-colors cursor-pointer group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0369A1] text-white flex items-center justify-center font-semibold text-sm shadow-xs shrink-0">
              R
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-[#0F172A] truncate tracking-tight">
                    riteplus.dispensary.pk
                  </p>
                </div>
                <p className="text-[10px] text-[#059669] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  DRAP Verified
                </p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <ChevronDown className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] transition-colors shrink-0" />
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/staff/dashboard'
              ? pathname === '/staff/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#E0F2FE] text-[#0369A1] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAF9]'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#0369A1]' : 'text-[#94A3B8]'
                }`}
              />
              {!sidebarCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    item.badgeColor || 'bg-[#F1F5F9] text-[#475569]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Bottom: Status & User */}
      <div className="p-3 border-t border-[#F0F4F2] space-y-2">
        {!sidebarCollapsed && (
          <div className="bg-[#F8FAF9] border border-[#E5E7EB] rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span className="text-[11px] font-medium text-[#475569]">POS Sync Active</span>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono">v2.4.0</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-colors"
                title="Storefront Preview"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
