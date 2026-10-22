'use client';

import React, { useState } from 'react';
import { usePharmacy } from '@/context/PharmacyContext';
import { CameraIcon, CloseIcon, CheckIcon } from '@/components/ui/Icons';

export default function PrescriptionModal() {
  const { isPrescriptionModalOpen, setIsPrescriptionModalOpen } = usePharmacy();
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPrescriptionModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleClose = () => {
    setIsPrescriptionModalOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setFile(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg border border-border-hairline bg-surface p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-hairline pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-600 animate-pulse" />
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                Quick Pharmacist Review
              </span>
            </div>
            <h2 className="mt-1 font-sans text-xl sm:text-2xl font-black text-ink">
              Upload Doctor&apos;s Prescription
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Take a clear picture of your slip. Our pharmacist will call you in 2 minutes.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center border border-border-hairline text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
            aria-label="Close dialog"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-800">
              <CheckIcon className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-sans text-xl font-bold text-ink">
              Prescription Received!
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
              Our on-duty qualified pharmacist is reviewing your slip right now.
              <br />
              We will call you at <strong className="text-ink">{phone || 'your phone number'}</strong> within 2 minutes to confirm your medicine order.
            </p>
            <div className="mt-6 border border-sky-200 bg-sky-50 p-3 text-left text-xs text-sky-900 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-sky-700 shrink-0" />
                <span>100% Genuine Medicines Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-sky-700 shrink-0" />
                <span>Chilled packaging for insulin & cold items</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-sky-700 shrink-0" />
                <span>Estimated delivery: 30 minutes after call confirmation</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 w-full border border-brand bg-brand px-5 py-3 font-sans text-xs font-bold tracking-wider text-white hover:bg-brand-hover"
            >
              Done & Return to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-sky-300 bg-sky-50/50 p-6 text-center transition-colors hover:border-brand">
              <input
                type="file"
                id="prescription-file"
                accept=".jpg,.jpeg,.png,.pdf,.heic"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="prescription-file"
                className="flex cursor-pointer flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-brand">
                  <CameraIcon className="h-6 w-6" />
                </div>
                <span className="mt-3 font-sans text-sm font-bold text-ink">
                  {file ? file.name : 'Click Here to Take Photo or Select File'}
                </span>
                <span className="mt-0.5 text-[11px] text-ink-muted">
                  Supports Photos (JPG, PNG) or PDF documents
                </span>
              </label>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ahmed Ali"
                  className="mt-1 w-full border border-border-hairline bg-surface px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink">
                  Mobile Number (For Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="mt-1 w-full border border-border-hairline bg-surface px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Mention how many days of medicine you need, or special instructions..."
                className="mt-1 w-full border border-border-hairline bg-surface px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="border border-border-hairline px-4 py-2.5 text-xs font-semibold text-ink hover:border-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 border border-brand bg-brand px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                {isSubmitting ? 'Sending to Pharmacist...' : 'Send Prescription Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
