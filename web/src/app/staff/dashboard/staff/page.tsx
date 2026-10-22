'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Plus,
  Stethoscope,
  Package,
  CheckCircle2,
  AlertTriangle,
  X,
  UserCheck,
  UserX,
  KeyRound,
  Mail,
  Phone,
  Clock,
  ShieldAlert,
  ChevronDown,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { getCurrentStaff } from '@/lib/auth';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'maintainer';
  active: boolean;
  pmdcLicense?: string;
  department: string;
  lastLogin: string;
}

export default function StaffManagementPage() {
  const currentStaff = getCurrentStaff();

  if (currentStaff && currentStaff.role !== 'admin') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#0F172A] mb-1 font-display">
          Administrator Access Required
        </h2>
        <p className="text-xs text-[#64748B] max-w-sm mb-4">
          Staff management, credentialing, and role assignments require Administrator clearance.
        </p>
        <Link
          href="/staff/dashboard"
          className="px-4 py-2 bg-[#0369A1] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#075985] transition-colors"
        >
          Return to Inventory Dashboard
        </Link>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'staff' | 'maintainer' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    if (typeof window === 'undefined') return [];
    const logged = getCurrentStaff();
    if (!logged) return [];
    return [
      {
        id: logged.id,
        name: logged.name,
        email: logged.email,
        phone: logged.phone || '—',
        role: logged.role,
        active: logged.active ?? true,
        department: logged.role === 'admin' ? 'Dispensary Administration & Clinical Ops' : 'Dispensary & Verification',
        lastLogin: 'Active session',
      },
    ];
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff' as 'admin' | 'staff' | 'maintainer',
    department: 'Prescription Verification & Dispensing',
    pmdcLicense: '',
  });

  const [modalError, setModalError] = useState<string | null>(null);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      // Tab filter
      if (activeTab === 'admin' && s.role !== 'admin') return false;
      if (activeTab === 'staff' && s.role !== 'staff') return false;
      if (activeTab === 'maintainer' && s.role !== 'maintainer') return false;
      if (activeTab === 'inactive' && s.active) return false;

      // Dropdown role filter
      if (selectedRoleFilter !== 'all' && s.role !== selectedRoleFilter) return false;

      // Dropdown status filter
      if (selectedStatusFilter === 'active' && !s.active) return false;
      if (selectedStatusFilter === 'inactive' && s.active) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          (s.pmdcLicense && s.pmdcLicense.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [staffList, activeTab, selectedRoleFilter, selectedStatusFilter, searchQuery]);

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!newStaff.name.trim() || !newStaff.email.trim() || !newStaff.password) {
      setModalError('Full name, institutional email, and password are required.');
      return;
    }

    if (newStaff.password.length < 6) {
      setModalError('Password must be at least 6 characters long.');
      return;
    }

    const created: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name.trim(),
      email: newStaff.email.trim().toLowerCase(),
      phone: newStaff.phone.trim() || '+92 300 0000000',
      role: newStaff.role,
      active: true,
      department: newStaff.department,
      pmdcLicense: newStaff.pmdcLicense.trim() || undefined,
      lastLogin: 'Never logged in',
    };

    setStaffList((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'staff',
      department: 'Prescription Verification & Dispensing',
      pmdcLicense: '',
    });
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleSaveRoleChange = (role: 'admin' | 'staff' | 'maintainer') => {
    if (!editingStaff) return;
    setStaffList((prev) =>
      prev.map((s) => (s.id === editingStaff.id ? { ...s, role } : s))
    );
    setEditingStaff(null);
  };

  return (
    <>
      {/* Top Header Row */}
      <header className="px-8 pt-7 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Staff & Dispensary Team
              </h1>
              <span className="text-xs bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full font-medium">
                {staffList.filter((s) => s.active).length} active members
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Role-based clearance, licensed pharmacist verification, and dispensary access control
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="flex items-center gap-1 mt-5">
          {[
            { id: 'all', label: 'All Team', count: staffList.length },
            { id: 'staff', label: 'Pharmacists', count: staffList.filter((s) => s.role === 'staff').length },
            { id: 'maintainer', label: 'Logistics & Warehouse', count: staffList.filter((s) => s.role === 'maintainer').length },
            { id: 'admin', label: 'Administrators', count: staffList.filter((s) => s.role === 'admin').length },
            { id: 'inactive', label: 'Suspended Access', count: staffList.filter((s) => !s.active).length },
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
                {tab.count !== undefined && tab.count > 0 && (
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

        {/* Filter Toolbar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by staff name, email, phone, or PMDC license..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#0369A1]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#475569] font-medium focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Pharmacist (Staff)</option>
            <option value="maintainer">Logistics (Maintainer)</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#475569] font-medium focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="inactive">Suspended Accounts</option>
          </select>
        </div>
      </header>

      {/* Main Table Card */}
      <section className="px-8 pb-8 flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-0">
          {filteredStaff.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-b from-[#0369A1] to-[#075985] flex items-center justify-center text-white mb-4 shadow-sm">
                <Shield className="w-7 h-7 text-emerald-300" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1">No Staff Members Found</h3>
              <p className="text-xs text-[#64748B] max-w-sm mb-4">
                No staff members match the selected filter or search query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRoleFilter('all');
                  setSelectedStatusFilter('all');
                  setActiveTab('all');
                }}
                className="px-3 py-1.5 bg-[#0369A1] text-white text-xs font-semibold rounded-lg hover:bg-[#075985]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-[#F8FAF9] shadow-2xs">
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#64748B] text-[11px] font-semibold tracking-wider uppercase">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Department & License</th>
                    <th className="py-3 px-3 text-center">Clearance Role</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-[#F8FAF9] transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4 min-w-50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0 font-bold text-xs border border-[#BAE6FD]">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0F172A]">{member.name}</p>
                            <p className="text-[11px] text-[#64748B] font-mono">{member.email}</p>
                            <p className="text-[10px] text-[#94A3B8] font-mono">{member.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department & PMDC */}
                      <td className="py-3.5 px-4">
                        <p className="text-[#334155] font-medium">{member.department}</p>
                        {member.pmdcLicense ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#059669] font-mono font-medium">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {member.pmdcLicense}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8]">Operations Personnel</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-3 text-center">
                        {member.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0369A1] text-white text-[11px] font-semibold shadow-2xs">
                            <Shield className="w-3 h-3 text-emerald-300" />
                            Admin Clearance
                          </span>
                        )}
                        {member.role === 'staff' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#BAE6FD] text-[11px] font-semibold">
                            <Stethoscope className="w-3 h-3 text-[#059669]" />
                            Pharmacist
                          </span>
                        )}
                        {member.role === 'maintainer' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] text-[11px] font-semibold">
                            <Package className="w-3 h-3 text-[#64748B]" />
                            Logistics Crew
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        {member.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] text-[10px] font-semibold border border-[#DCFCE7]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] text-[10px] font-semibold border border-[#FEE2E2]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-[#64748B] text-[11px] font-mono">
                        {member.lastLogin}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingStaff(member)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#E5E7EB] bg-white text-[#475569] hover:bg-[#F8FAF9] hover:text-[#0F172A] transition-colors cursor-pointer"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() => toggleStaffStatus(member.id)}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                              member.active
                                ? 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
                                : 'bg-[#F0FDF4] text-[#059669] hover:bg-[#DCFCE7]'
                            }`}
                            title={member.active ? 'Suspend Staff Account' : 'Reactivate Staff Account'}
                          >
                            {member.active ? 'Suspend' : 'Activate'}
                          </button>
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

      {/* ============================================================ */}
      {/* PROVISION STAFF MEMBER MODAL                                 */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#F0F4F2] flex items-center justify-between bg-[#F8FAF9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Provision Staff Account</h3>
                  <p className="text-[11px] text-[#64748B]">Internal staff credentials & DRAP security role</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="mx-6 mt-4 p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl text-xs text-[#DC2626] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Dr. Salman Farooq"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="name@riteplus.pk"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Clearance Role *
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
                  >
                    <option value="staff">Licensed Pharmacist (Staff)</option>
                    <option value="maintainer">Logistics / Warehouse (Maintainer)</option>
                    <option value="admin">Administrator (Full Clearance)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    PMDC License (For Pharmacists)
                  </label>
                  <input
                    type="text"
                    value={newStaff.pmdcLicense}
                    onChange={(e) => setNewStaff({ ...newStaff, pmdcLicense: e.target.value })}
                    placeholder="PMDC-XXXXX-RPH"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Department Assignment
                </label>
                <select
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
                >
                  <option value="Prescription Verification & Dispensing">Prescription Verification & Dispensing</option>
                  <option value="Dispensary & Controlled Drugs">Dispensary & Controlled Drugs</option>
                  <option value="Cold-Chain & Warehouse Logistics">Cold-Chain & Warehouse Logistics</option>
                  <option value="Rider Fleet & Packaging">Rider Fleet & Packaging</option>
                  <option value="Central Pharmacy & Clinical Ops">Central Pharmacy & Clinical Ops</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Temporary Staff Password *
                </label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                />
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  Staff member will be prompted to change their password upon first login.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0F4F2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#475569] hover:bg-[#F8FAF9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT ROLE MODAL                                              */}
      {/* ============================================================ */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-sm p-6">
            <h3 className="text-sm font-bold text-[#0F172A] mb-1">
              Edit Clearance: {editingStaff.name}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Current role: <strong className="text-[#0369A1] capitalize">{editingStaff.role}</strong>
            </p>

            <div className="space-y-2 mb-6">
              {[
                { role: 'admin', label: 'Administrator', desc: 'Full access to staff, settings, and database' },
                { role: 'staff', label: 'Licensed Pharmacist', desc: 'Dispensing, prescription sign-off, inventory' },
                { role: 'maintainer', label: 'Logistics / Maintainer', desc: 'Packaging, stock count, and cold box dispatch' },
              ].map((opt) => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => handleSaveRoleChange(opt.role as any)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    editingStaff.role === opt.role
                      ? 'border-[#0369A1] bg-[#E0F2FE] text-[#0369A1]'
                      : 'border-[#E5E7EB] hover:bg-[#F8FAF9]'
                  }`}
                >
                  <p className="font-semibold text-xs">{opt.label}</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setEditingStaff(null)}
              className="w-full py-2 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#475569] hover:bg-[#F8FAF9] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
