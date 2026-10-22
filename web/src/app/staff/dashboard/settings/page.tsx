'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Store, Lock, UserCheck } from 'lucide-react';
import { getCurrentStaff, type StaffUser } from '@/lib/auth';

export default function SettingsPage() {
  const [staff, setStaff] = useState<StaffUser | null>(null);

  useEffect(() => {
    setStaff(getCurrentStaff());
  }, []);

  return (
    <>
      <header className="px-8 pt-7 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
            Pharmacy & Portal Settings
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Dispensary operational hours, DRAP retail pharmacy credentials, and security clearance
          </p>
        </div>
      </header>

      <section className="px-8 pb-8 flex-1 flex flex-col space-y-4 max-w-4xl">
        {/* Dispensary Profile Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F0F4F2]">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Dispensary Profile</h3>
              <p className="text-[11px] text-[#64748B]">Public pharmacy license details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#64748B] font-semibold mb-1">Pharmacy Name</label>
              <input
                type="text"
                readOnly
                value="Rite Plus Clinical & Retail Pharmacy"
                className="w-full px-3 py-2 bg-[#F8FAF9] border border-[#E5E7EB] rounded-lg text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block text-[#64748B] font-semibold mb-1">DRAP Drug Sale License #</label>
              <input
                type="text"
                readOnly
                value="DSL-ICT-0824-CAT-A"
                className="w-full px-3 py-2 bg-[#F8FAF9] border border-[#E5E7EB] rounded-lg text-[#0F172A] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security Clearance */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F0F4F2]">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Current Staff Session</h3>
              <p className="text-[11px] text-[#64748B]">Active authenticated clearance</p>
            </div>
          </div>

          <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#166534]">
                {staff?.name || 'Authorized Staff Member'}
              </p>
              <p className="text-[11px] text-[#059669]">
                {staff?.email || 'Authenticated via session token'} • Role: {staff?.role?.toUpperCase() || 'STAFF'}
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#166534] text-white font-semibold">
              Active Session
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
