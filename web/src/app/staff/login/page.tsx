'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Terminal,
} from 'lucide-react';
import { loginStaffApi, getCurrentStaff } from '@/lib/auth';

export default function StaffLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your staff institutional email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your portal password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginStaffApi(email.trim(), password);

      if (res.success) {
        setSuccessMsg(`Access Authorized. Welcome ${res.data?.name || 'Staff Member'} (${res.data?.role?.toUpperCase() || 'OPERATIONS'}).`);
        const searchParams = new URLSearchParams(window.location.search);
        const target = searchParams.get('redirect') || '/staff/dashboard';
        router.push(target);
      } else {
        setErrorMsg(res.message || 'Access denied. Invalid staff email or password.');
      }
    } catch (err: any) {
      setErrorMsg('Failed to communicate with Rite Plus Auth Service on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#111817] flex flex-col justify-between selection:bg-[#0369A1] selection:text-white">
      {/* ── Top Portal Header ── */}
      <header className="border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl font-black uppercase tracking-tight text-[#0369A1] group-hover:text-[#075985] transition-colors">
                RITE PLUS
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2.5 border-l border-[#E5E7EB] pl-3 text-xs">
              <span className="font-bold text-[#0369A1] uppercase tracking-wider">
                Staff Operations Portal
              </span>              
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#0369A1] transition-colors flex items-center gap-1.5"
            >
              <span>← Return to Storefront</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Secure Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl bg-white border border-[#E5E7EB] shadow-2xl rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Solid Deep Blue */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-6 bg-linear-to-br from-[#0369A1] to-[#0C4A6E] p-8 sm:p-10 text-white relative">
            {/* Subtle ambient lighting */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              

              <h1 className="font-display text-2xl font-extrabold text-white leading-tight">
                Pharmacy Clinical &amp; Fulfillment Control
              </h1>
              <p className="text-xs text-sky-100/85 leading-relaxed">
                Single sign-on access point for Rite Plus certified clinical pharmacists, cold-chain handlers, inventory operators, and facility dispatchers.
              </p>
            </div>

            {/* Allowed Roles Badges (Clean list without bulky background boxes) */}
            <div className="relative z-10 space-y-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block border-b border-white/10 pb-2">
                Authorized Personnel Clearance
              </span>

              <div className="flex items-start gap-3">
                <Stethoscope className="h-4 w-4 text-sky-300 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Registered Pharmacist</span>
                  <p className="text-[11px] text-white/70">Prescription verification &amp; drug review</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-sky-300 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Operations &amp; Logistics</span>
                  <p className="text-[11px] text-white/70">Cold-chain dispatch &amp; 30-min rider assignment</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Terminal className="h-4 w-4 text-sky-300 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">System Administrator</span>
                  <p className="text-[11px] text-white/70">Facility controls &amp; audit trail logs</p>
                </div>
              </div>
            </div>

            {/* Notice regarding self-registration */}
            <div className="relative z-10 border-t border-white/15 pt-4 text-[11px] text-white/75 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold text-amber-200">Staff Notice:</span> Accounts are provisioned internally by Pharmacy Administration. Self-registration is disabled.
              </p>
            </div>
          </div>

          {/* Right Column: Clean White Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0369A1] mb-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-[#0369A1]" />
                  <span>Authorized Staff Only</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111817]">
                  Staff Authentication
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                  Enter your assigned credentials to access internal systems.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 flex items-start gap-3 rounded-xs bg-red-50 p-4 text-xs text-red-800 border border-red-200 animate-in fade-in duration-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Authentication Failed</p>
                    <p className="mt-0.5 text-red-700">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="mb-5 flex items-start gap-3 rounded-xs bg-sky-50 p-4 text-xs text-sky-800 border border-sky-200 animate-in fade-in duration-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Session Verified</p>
                    <p className="mt-0.5 text-sky-700">{successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Staff Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                    Staff Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. pharmacist@riteplus.pk"
                      autoComplete="username"
                      required
                      className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0369A1] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0369A1] transition-all"
                    />
                  </div>
                </div>

                {/* Staff Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                      Portal Password
                    </label>
                    <span className="text-[11px] text-[#6B7280]">Hardware token or password</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter assigned master password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-11 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0369A1] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0369A1] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xs bg-[#0369A1] py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-[#075985] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying Cryptographic Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Authenticate &amp; Access Console</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Regulatory Footer & Warning */}
            <div className="mt-8 border-t border-[#E5E7EB] pt-4 text-center">
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Authorized use only under DRAP License No. LHR/RET-2024-884. All login attempts, sessions, and dispensing records are timestamped and archived.
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs font-semibold">
                <Link href="/login" className="text-[#0369A1] hover:underline">
                  Switch to Patient / Customer Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Micro Footer  */}
      <footer className="border-t border-[#E5E7EB] bg-white py-3 text-center text-xs text-[#6B7280]">
        <p>Rite Plus Internal Clinical Network • Tezab Ahata Swami Nagar Hub • Support: admin@riteplus.pk</p>
      </footer>
    </div>
  );
}
