'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Snowflake, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { fetchProducts, type ApiProduct } from '@/lib/api';

export default function MetricsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetchProducts({ limit: 500 });
      if (res && res.items) {
        setProducts(res.items);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Failed to load metrics products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const totalSKUs = products.length;
  const totalValuation = products.reduce((acc, p) => {
    const price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price)) || 0;
    const stock = typeof p.stock === 'number' ? p.stock : parseInt(String(p.stock), 10) || 0;
    return acc + price * stock;
  }, 0);

  const coldChainCount = products.filter(
    (p) =>
      p.form?.toLowerCase().includes('injection') ||
      p.name.toLowerCase().includes('insulin') ||
      p.name.toLowerCase().includes('lantus')
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= 20 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <>
      <header className="px-8 pt-7 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Dispensing Metrics & Analytics
              </h1>
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0369A1]" />}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Real-time dispensing statistics, inventory valuation, and stock alerts
            </p>
          </div>

          <button
            onClick={loadMetrics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-medium text-[#475569] hover:bg-[#F8FAF9] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live Telemetry</span>
          </button>
        </div>
      </header>

      <section className="px-8 pb-8 flex-1 flex flex-col space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs">
            <p className="text-xs text-[#64748B]">Total Catalog Valuation</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              PKR {totalValuation.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-[#64748B] mt-1 font-medium flex items-center gap-1">
              Across {totalSKUs} registered SKUs
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs">
            <p className="text-xs text-[#64748B]">Active Formulary SKUs</p>
            <p className="text-2xl font-bold text-[#0369A1] mt-1">{totalSKUs} Items</p>
            <p className="text-[11px] text-[#059669] mt-1 font-medium">
              {products.filter((p) => p.active).length} active for retail sale
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs">
            <p className="text-xs text-[#64748B]">Cold-Chain Formulations</p>
            <p className="text-2xl font-bold text-[#0369A1] mt-1">{coldChainCount} SKUs</p>
            <p className="text-[11px] text-[#0369A1] mt-1 font-medium">
              Requires 2°C–8°C storage
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs">
            <p className="text-xs text-[#64748B]">Stock Warning Alerts</p>
            <p className="text-2xl font-bold text-[#B45309] mt-1">
              {lowStockCount + outOfStockCount} SKUs
            </p>
            <p className="text-[11px] text-[#B45309] mt-1 font-medium">
              {lowStockCount} low stock, {outOfStockCount} depleted
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs p-8 flex items-center justify-center text-center">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-linear-to-b from-[#0369A1] to-[#075985] flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
              <BarChart3 className="w-7 h-7 text-emerald-300" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Formulary Analytics Online</h3>
            <p className="text-xs text-[#64748B] max-w-sm">
              All analytics reflect live dispensary stock levels, active batches, and prescription units.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
