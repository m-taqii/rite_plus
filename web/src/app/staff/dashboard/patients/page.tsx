'use client';

import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Calendar, UserCheck } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  prescriptions: number;
  lastOrder: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.phone.includes(q);
  });

  return (
    <>
      <header className="px-8 pt-7 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Patient Profiles & Chronic Care
              </h1>
              <span className="text-xs bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full font-medium">
                {patients.length} records
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Secure patient medication profiles, prescription history, and refill schedules
            </p>
          </div>
        </div>

        {patients.length > 0 && (
          <div className="mt-4 relative max-w-md">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name or phone number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#0369A1]"
            />
          </div>
        )}
      </header>

      <section className="px-8 pb-8 flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-0">
          {filteredPatients.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mb-3">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 font-display">
                No Patient Profiles Recorded
              </h2>
              <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
                Patients who create accounts on Rite Plus or submit prescriptions for dispensing will automatically appear here with their complete clinical history.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-[#F8FAF9] shadow-2xs">
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#64748B] text-[11px] font-semibold tracking-wider uppercase">
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-center">Prescriptions on File</th>
                    <th className="py-3 px-4 text-right">Last Dispensing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAF9] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{p.name}</td>
                      <td className="py-3.5 px-4 font-mono text-[#475569]">{p.phone}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 bg-[#E0F2FE] text-[#0369A1] rounded-full font-semibold">
                          {p.prescriptions} records
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#64748B]">{p.lastOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
