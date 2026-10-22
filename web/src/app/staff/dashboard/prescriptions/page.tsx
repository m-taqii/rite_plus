'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Filter,
  Check,
  X,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface PrescriptionItem {
  id: string;
  rxNumber: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  doctorLicense: string;
  hospital: string;
  medicines: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  imagePreview?: string;
}

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [selectedRx, setSelectedRx] = useState<PrescriptionItem | null>(null);

  const filtered = prescriptions.filter((rx) => {
    if (activeTab !== 'all' && rx.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        rx.patientName.toLowerCase().includes(q) ||
        rx.rxNumber.toLowerCase().includes(q) ||
        rx.doctorName.toLowerCase().includes(q) ||
        rx.doctorLicense.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    setPrescriptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    if (selectedRx && selectedRx.id === id) {
      setSelectedRx((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <>
      {/* Header */}
      <header className="px-8 pt-7 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Prescription Clearance
              </h1>
              <span className="text-xs bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full font-medium">
                {prescriptions.filter((p) => p.status === 'pending').length} pending review
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              DRAP Schedule G/H prescription verification & pharmacist digital sign-off
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-semibold text-[#166534]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              PMDC Registered Pharmacist
            </span>
          </div>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="flex items-center gap-1 mt-5">
          {[
            { id: 'pending', label: 'Pending Review', count: prescriptions.filter((p) => p.status === 'pending').length },
            { id: 'approved', label: 'Approved & Dispensed', count: prescriptions.filter((p) => p.status === 'approved').length },
            { id: 'rejected', label: 'Flagged / Rejected', count: prescriptions.filter((p) => p.status === 'rejected').length },
            { id: 'all', label: 'All Records' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0369A1] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, Rx number, doctor name, PMDC license..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#0369A1]"
            />
          </div>
        </div>
      </header>

      {/* Main Card */}
      <section className="px-8 pb-8 flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-0">
          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-b from-[#0369A1] to-[#075985] flex items-center justify-center text-white mb-4 shadow-sm">
                <FileText className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1">No Prescriptions in Queue</h3>
              <p className="text-xs text-[#64748B] max-w-sm">
                All patient uploads have been audited and signed off. New uploads from customer checkout will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-[#F8FAF9] shadow-2xs">
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#64748B] text-[11px] font-semibold tracking-wider uppercase">
                    <th className="py-3 px-4">Rx Number</th>
                    <th className="py-3 px-4">Patient Details</th>
                    <th className="py-3 px-4">Doctor & PMDC License</th>
                    <th className="py-3 px-4">Prescribed Medicines</th>
                    <th className="py-3 px-3 text-center">Clearance Status</th>
                    <th className="py-3 px-4 text-right">Pharmacist Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAF9] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[#0369A1]">
                        {item.rxNumber}
                        <div className="text-[10px] text-[#94A3B8]">{item.date}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0F172A]">{item.patientName}</div>
                        <div className="text-[11px] text-[#64748B] font-mono">{item.patientPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#0F172A]">{item.doctorName}</div>
                        <div className="text-[10px] text-[#059669] font-mono font-medium">
                          {item.doctorLicense} • {item.hospital}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-[#334155] line-clamp-2">{item.medicines}</p>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            item.status === 'approved'
                              ? 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
                              : item.status === 'rejected'
                              ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                              : 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
                          }`}
                        >
                          {item.status === 'approved' && <Check className="w-3 h-3" />}
                          {item.status === 'rejected' && <X className="w-3 h-3" />}
                          {item.status === 'pending' && <Clock className="w-3 h-3" />}
                          {item.status === 'approved'
                            ? 'Approved'
                            : item.status === 'rejected'
                            ? 'Rejected'
                            : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedRx(item)}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E5E7EB] bg-white text-[#475569] hover:bg-[#F8FAF9] hover:text-[#0F172A] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(item.id, 'approved')}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#0369A1] text-white hover:bg-[#075985] transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(item.id, 'rejected')}
                                className="px-2 py-1 text-xs font-semibold rounded-lg bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Inspect Modal */}
      {selectedRx && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F2] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Prescription Details: {selectedRx.rxNumber}</h3>
                <p className="text-[11px] text-[#64748B]">{selectedRx.date}</p>
              </div>
              <button onClick={() => setSelectedRx(null)} className="p-1 text-[#94A3B8] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5E7EB]">
                <p className="text-[#64748B] text-[11px]">Patient</p>
                <p className="font-semibold text-[#0F172A] text-sm">{selectedRx.patientName}</p>
                <p className="font-mono text-[#475569]">{selectedRx.patientPhone}</p>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5E7EB]">
                <p className="text-[#64748B] text-[11px]">Doctor & Hospital</p>
                <p className="font-semibold text-[#0F172A]">{selectedRx.doctorName}</p>
                <p className="text-[#059669] font-medium font-mono">{selectedRx.doctorLicense}</p>
                <p className="text-[#64748B]">{selectedRx.hospital}</p>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E5E7EB]">
                <p className="text-[#64748B] text-[11px]">Prescribed Items</p>
                <p className="font-medium text-[#0F172A] leading-relaxed mt-1">{selectedRx.medicines}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F2]">
              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[#E5E7EB] text-[#475569] hover:bg-[#F8FAF9]"
              >
                Close
              </button>
              {selectedRx.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAction(selectedRx.id, 'rejected')}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(selectedRx.id, 'approved')}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#0369A1] text-white hover:bg-[#075985]"
                  >
                    Approve & Dispense
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
