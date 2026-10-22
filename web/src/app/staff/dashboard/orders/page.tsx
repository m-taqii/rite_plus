'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Download,
  Check,
  ChevronRight,
  MapPin,
  Phone,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  address: string;
  itemsSummary: string;
  total: number;
  paymentMethod: 'COD' | 'Online';
  status: 'pending' | 'packing' | 'out_for_delivery' | 'delivered';
  time: string;
}

export default function DispensingOrdersPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'packing' | 'out_for_delivery' | 'delivered' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const filtered = orders.filter((o) => {
    if (activeTab !== 'all' && o.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.orderNo.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const updateOrderStatus = (id: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <>
      <header className="px-8 pt-7 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Dispensing & Orders
              </h1>
              <span className="text-xs bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full font-medium">
                {orders.filter((o) => o.status !== 'delivered').length} active
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Fulfillment, cold-chain packout, and dispatch tracking for prescription & OTC orders
            </p>
          </div>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="flex items-center gap-1 mt-5">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'New / To Pack', count: orders.filter((o) => o.status === 'pending').length },
            { id: 'packing', label: 'Packing & Cold Pack', count: orders.filter((o) => o.status === 'packing').length },
            { id: 'out_for_delivery', label: 'Out for Delivery', count: orders.filter((o) => o.status === 'out_for_delivery').length },
            { id: 'delivered', label: 'Delivered' },
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

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number, customer name, phone, delivery address..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#0369A1]"
            />
          </div>
        </div>
      </header>

      <section className="px-8 pb-8 flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-0">
          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mb-3">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] mb-1 font-display">
                No Dispensing Orders Placed
              </h2>
              <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
                When patients place medicine orders on the storefront or via prescription upload, they will appear here in real time for verification and cold-chain packout.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-[#F8FAF9] shadow-2xs">
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#64748B] text-[11px] font-semibold tracking-wider uppercase">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer & Contact</th>
                    <th className="py-3 px-4">Delivery Address</th>
                    <th className="py-3 px-4">Prescribed Items</th>
                    <th className="py-3 px-3 text-right">Total (PKR)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8FAF9] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0369A1]">
                      {o.orderNo}
                      <div className="text-[10px] text-[#94A3B8] font-sans font-normal">{o.time}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F172A]">{o.customerName}</div>
                      <div className="text-[11px] text-[#64748B] font-mono">{o.customerPhone}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-[#475569] line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
                        {o.address}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-[#0F172A] line-clamp-1">{o.itemsSummary}</p>
                      <span className="text-[10px] text-[#059669] font-medium">Payment: {o.paymentMethod}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-[#0F172A]">
                      PKR {o.total.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          o.status === 'delivered'
                            ? 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
                            : o.status === 'out_for_delivery'
                            ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]'
                            : o.status === 'packing'
                            ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                            : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                        }`}
                      >
                        {o.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                        {o.status === 'out_for_delivery' && <Truck className="w-3 h-3" />}
                        {o.status === 'packing' && <Package className="w-3 h-3" />}
                        {o.status === 'pending' && <Clock className="w-3 h-3" />}
                        {o.status === 'pending'
                          ? 'New Order'
                          : o.status === 'packing'
                          ? 'Packing'
                          : o.status === 'out_for_delivery'
                          ? 'On Rider'
                          : 'Delivered'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'packing')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#0369A1] text-white hover:bg-[#075985] transition-colors cursor-pointer"
                        >
                          Pack Order
                        </button>
                      )}
                      {o.status === 'packing' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'out_for_delivery')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                        >
                          Dispatch Rider
                        </button>
                      )}
                      {o.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'delivered')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#059669] text-white hover:bg-[#047857] transition-colors cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {o.status === 'delivered' && (
                        <span className="text-[11px] text-[#94A3B8]">Completed</span>
                      )}
                    </td>
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
