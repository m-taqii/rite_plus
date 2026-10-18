'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  HeartPulse,
  BadgeCheck,
} from 'lucide-react';
import { registerCustomerApi } from '@/lib/auth';

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!name.trim() || name.trim().length < 3) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid mobile number (e.g. 03001234567).');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-check.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('You must agree to the Terms of Service & DRAP compliance to proceed.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerCustomerApi({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim(),
        password,
      });

      if (res.success) {
        setSuccessMsg('Account created successfully! Redirecting you to the pharmacy...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Registration failed. This phone or email may already be registered.');
      }
    } catch (err: any) {
      setErrorMsg('Unable to connect to registration service. Please verify network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#111817] flex flex-col justify-between selection:bg-[#0A382C] selection:text-white">
      {/* Top Brand Bar */}
      <header className="border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-black uppercase tracking-tight text-[#0A382C] group-hover:text-[#06281F] transition-colors">
              RITE PLUS
            </span>
            <span className="rounded-xs bg-[#E6F3EE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A382C] border border-[#0A382C]/20">
              Rx Pharmacy
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#0A382C] transition-colors hidden sm:inline-block"
            >
              ← Back to Store
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[#6B7280] hidden sm:inline">Already registered?</span>
              <Link
                href="/login"
                className="rounded-xs bg-[#E6F3EE] border border-[#0A382C]/20 px-4 py-2 text-[#0A382C] font-bold hover:bg-[#0A382C] hover:text-white transition-all shadow-xs"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single Rectangular Card  */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white border border-[#E5E7EB] shadow-2xl rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Solid Deep Viridian Green */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 p-8 sm:p-10 bg-linear-to-br from-[#0A382C] to-[#124D3E] text-white relative">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                <span>Join Over 15,000+ Families in Lahore</span>
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight leading-snug">
                Experience Genuine Healthcare at Your Doorstep.
              </h1>
              <p className="text-sm text-emerald-100/85 leading-relaxed">
                Create your patient profile to securely save prescriptions, schedule recurring medicines, and receive 30-minute expedited delivery.
              </p>
            </div>

            {/* Benefit Checkpoints (Clean unboxed list) */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-4.5 w-4.5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Priority 30-Minute Dispatch</h4>
                  <p className="text-[11px] text-white/70">Instant dispatch for urgent care, antibiotics, and first-aid.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4.5 w-4.5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">100% Genuine Medicine Guarantee</h4>
                  <p className="text-[11px] text-white/70">Directly sourced from GSK, Abbott, Getz, Pfizer, and Roche.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HeartPulse className="h-4.5 w-4.5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Licensed Pharmacist Review</h4>
                  <p className="text-[11px] text-white/70">Every prescription is verified against drug interactions &amp; dosage.</p>
                </div>
              </div>
            </div>

            {/* Pharmacy License & Physical Address */}
            <div className="relative z-10 border-t border-white/15 pt-4 text-[11px] text-white/70">
              <p className="font-semibold text-white">Rite Plus Pharmacy Lahore</p>
              <p>Tezab Ahata Swami Nagar, Lahore, Punjab</p>
              <p className="mt-1 text-emerald-200">Registered DRAP Retail License • Helpline: 042-111-748-375</p>
            </div>
          </div>

          {/* Right Column: Clean White Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A382C] mb-1.5 block">
                  New Patient Registration
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111817]">
                  Create Your Account
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                  Fill in your details below to set up your Rite Plus medicine ordering profile.
                </p>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="mb-5 flex items-start gap-3 rounded-xs bg-red-50 p-4 text-xs text-red-800 border border-red-200 animate-in fade-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Registration Issue</p>
                    <p className="mt-0.5 text-red-700">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {successMsg && (
                <div className="mb-5 flex items-start gap-3 rounded-xs bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-200 animate-in fade-in duration-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Welcome to Rite Plus!</p>
                    <p className="mt-0.5 text-emerald-700">{successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      required
                      className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0A382C] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A382C] transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="03001234567"
                        required
                        className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0A382C] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A382C] transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-[#6B7280] mt-1 block">Used for rider delivery updates</span>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ali@example.com"
                        className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0A382C] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A382C] transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-[#6B7280] mt-1 block">For digital receipts & invoices</span>
                  </div>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        required
                        className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-10 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0A382C] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A382C] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#374151]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        required
                        className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0A382C] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A382C] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance & Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-xs border-[#D1D5DB] text-[#0A382C] focus:ring-[#0A382C]"
                    />
                    <span className="text-xs text-[#4B5563] leading-relaxed">
                      I agree to Rite Plus Pharmacy terms, patient confidentiality, and acknowledge that prescription medicines require a valid doctor prescription under DRAP rules.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xs bg-[#0A382C] py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-[#06281F] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creating Patient Account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Rite Plus Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Existing Account CTA */}
              <div className="mt-6 border-t border-[#E5E7EB] pt-5 text-center">
                <p className="text-xs text-[#6B7280]">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-[#0A382C] hover:underline">
                    Sign in here →
                  </Link>
                </p>
              </div>

              {/* Staff portal note */}
              <div className="mt-4 pt-3 text-center border-t border-dashed border-[#E5E7EB]">
                <Link
                  href="/staff/login"
                  className="text-[11px] text-[#9CA3AF] hover:text-[#0A382C] font-medium transition-colors"
                >
                  Rite Plus Staff & Pharmacist Portal Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-4 text-center text-xs text-[#6B7280]">
        <p>
          Rite Plus Pharmacy • DRAP Licensed Retailer • Tezab Ahata Swami Nagar, Lahore • Customer Care: 042-111-748-375
        </p>
      </footer>
    </div>
  );
}
