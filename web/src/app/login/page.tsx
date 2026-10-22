'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  ThermometerSnowflake,
  FileText,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { loginCustomerApi } from '@/lib/auth';

export default function CustomerLoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or phone number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginCustomerApi(identifier.trim(), password);

      if (res.success) {
        setSuccessMsg('Welcome back! Logging into your Rite Plus account...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please check your details and try again.');
      }
    } catch (err: any) {
      setErrorMsg('Unable to connect to the authentication service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#111817] flex flex-col justify-between selection:bg-[#0369A1] selection:text-white">
      {/* Top Brand Bar */}
      <header className="border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-black uppercase tracking-tight text-[#0369A1] group-hover:text-[#075985] transition-colors">
              RITE PLUS
            </span>
            <span className="rounded-xs bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0369A1] border border-[#0369A1]/20">
              Rx Pharmacy
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#0369A1] transition-colors hidden sm:inline-block"
            >
              ← Back to Store
            </Link>
            <Link
              href="/register"
              className="rounded-xs bg-[#0369A1] px-4 py-2 text-white font-medium hover:bg-[#075985] transition-all shadow-xs"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single Rectangular Card  */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white border border-[#E5E7EB] shadow-2xl rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Solid Deep Viridian Green */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 p-8 sm:p-10 bg-linear-to-br from-[#0369A1] to-[#0C4A6E] text-white relative">
            {/* Subtle ambient lighting */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              

              <h1 className="font-display text-3xl font-extrabold tracking-tight leading-snug">
                Your Health, Genuine Medicines, Delivered in 30 Mins.
              </h1>
              <p className="text-sm text-sky-100/85 leading-relaxed">
                Log in to re-order your regular prescriptions, track temperature-controlled delivery, and consult licensed pharmacists instantly.
              </p>
            </div>

            {/* Feature Perks (Clean unboxed list) */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-4.5 w-4.5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Express 30-Minute Dispatch</h4>
                  <p className="text-[11px] text-white/70">From our central Lahore dispatch hub</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ThermometerSnowflake className="h-4.5 w-4.5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Strict Cold-Chain (2°C – 8°C)</h4>
                  <p className="text-[11px] text-white/70">Insulins &amp; vaccines monitored in transit</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4.5 w-4.5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Digital Rx Records</h4>
                  <p className="text-[11px] text-white/70">Never lose a prescription or dosage history</p>
                </div>
              </div>
            </div>

            {/* Hub Address Badge */}
            <div className="relative z-10 border-t border-white/15 pt-4 text-[11px] text-white/70">
              <p className="font-semibold text-white">Central Pharmacy Location:</p>
              <p>Tezab Ahata Swami Nagar, Lahore</p>
              <p className="mt-1 flex items-center gap-1.5 text-emerald-200">
                <Phone className="h-3 w-3" /> 042-111-748-375
              </p>
            </div>
          </div>

          {/* Right Column: Clean White Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0369A1] mb-1.5 block">
                  Patient &amp; Customer Login
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111817]">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                  Enter your registered email address or phone number to sign in.
                </p>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="mb-5 flex items-start gap-3 rounded-xs bg-red-50 p-4 text-xs text-red-800 border border-red-200 animate-in fade-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Sign in failed</p>
                    <p className="mt-0.5 text-red-700">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {successMsg && (
                <div className="mb-5 flex items-start gap-3 rounded-xs bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-200 animate-in fade-in duration-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Authentication Successful</p>
                    <p className="mt-0.5 text-emerald-700">{successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Phone Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 03001234567 or patient@email.com"
                      autoComplete="username"
                      required
                      className="w-full rounded-xs border border-[#D1D5DB] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#111817] placeholder-[#9CA3AF] focus:border-[#0369A1] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0369A1] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
                      Password
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Please contact our pharmacy support at 042-111-748-375 or WhatsApp to reset your password.');
                      }}
                      className="text-xs font-semibold text-[#0369A1] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your account password"
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

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded-xs border-[#D1D5DB] text-[#0369A1] focus:ring-[#0369A1]"
                    />
                    <span className="text-xs text-[#4B5563]">Keep me signed in on this device</span>
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xs bg-[#0369A1] py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-[#075985] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In to Rite Plus</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Don&apos;t have an account?
                </span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              {/* Register Link Button */}
              <Link
                href="/register"
                className="w-full flex items-center justify-center gap-2 rounded-xs border border-[#0369A1]/30 bg-[#E0F2FE]/60 py-3 text-xs font-bold text-[#0369A1] hover:bg-[#E0F2FE] hover:border-[#0369A1] transition-all"
              >
                <span>Create New Customer Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Staff Portal Link */}
            <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-center">
              <Link
                href="/staff/login"
                className="text-xs text-[#6B7280] hover:text-[#0369A1] font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Pharmacy Staff & Pharmacist Portal Access →</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Regulatory Micro-Footer ── */}
      <footer className="border-t border-[#E5E7EB] bg-white py-4 text-center text-xs text-[#6B7280]">
        <p>
          Rite Plus Pharmacy • DRAP Licensed Facility • Tezab Ahata Swami Nagar, Lahore • 24/7 Helpline: 042-111-748-375
        </p>
      </footer>
    </div>
  );
}
