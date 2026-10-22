'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Pill,
  Search,
  Plus,
  Download,
  Filter,
  ChevronDown,
  ArrowUpRight,
  X,
  Snowflake,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  adjustStockApi,
  deleteProductApi,
  fetchCategories,
  type ApiProduct,
  type ApiCategory,
} from '@/lib/api';
import { getCurrentStaff, type StaffUser } from '@/lib/auth';

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  code: string;
  category: string;
  categoryId?: string | null;
  strength?: string;
  form: string;
  packSize: string;
  price: number;
  stock: number;
  requiresRx: boolean;
  active?: boolean;
  description?: string;
  isColdChain?: boolean;
  image?: string;
}

function mapApiToMedicine(p: ApiProduct, categoryNameMap: Record<string, string> = {}): MedicineItem {
  return {
    id: p.id,
    name: p.name,
    genericName: p.genericName || 'Unspecified Compound',
    brand: p.brand || 'Rite Plus Generic',
    code: p.code,
    category: (p.categoryId && categoryNameMap[p.categoryId]) || 'General Medicine',
    categoryId: p.categoryId,
    strength: p.strength || '',
    description: p.description || '',
    form: p.form || 'Tablet',
    packSize: p.packSize || 'Standard Pack',
    price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price)) || 0,
    stock: typeof p.stock === 'number' ? p.stock : parseInt(String(p.stock), 10) || 0,
    requiresRx: Boolean(p.requiresRx),
    active: p.active !== undefined ? Boolean(p.active) : true,
    isColdChain: Boolean(p.description?.toLowerCase().includes('cold') || p.name.toLowerCase().includes('insulin')),
    image: p.image || undefined,
  };
}

export default function InventoryDashboardPage() {
  // Tab & view states
  const [activeTab, setActiveTab] = useState<'all' | 'in_stock' | 'low_stock' | 'requires_rx'>('all');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Medicine list state - Real DB products only
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [newMed, setNewMed] = useState({
    name: '',
    genericName: '',
    brand: '',
    strength: '',
    code: '',
    category: 'Antibiotics',
    categoryId: '',
    form: 'Tablet',
    packSize: '',
    price: '',
    stock: '',
    requiresRx: false,
    active: true,
    description: '',
    imageUrl: '',
  });

  // Modal states - Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null);
  const [editMed, setEditMed] = useState({
    name: '',
    genericName: '',
    brand: '',
    strength: '',
    code: '',
    category: '',
    categoryId: '',
    form: 'Tablet',
    packSize: '',
    price: '',
    stock: '',
    requiresRx: false,
    active: true,
    description: '',
    imageUrl: '',
  });
  const [selectedEditImageFile, setSelectedEditImageFile] = useState<File | null>(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  const [stockModalMed, setStockModalMed] = useState<MedicineItem | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load products & categories from API
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        fetchProducts({ limit: 100, activeOnly: false }),
        fetchCategories(),
      ]);

      const catMap: Record<string, string> = {};
      if (catRes.status === 'fulfilled' && catRes.value.length > 0) {
        catRes.value.forEach((c) => {
          catMap[c.id] = c.name;
        });
        setCategories(catRes.value);
      }

      if (prodRes.status === 'fulfilled' && prodRes.value?.items) {
        const mapped = prodRes.value.items.map((p) => mapApiToMedicine(p, catMap));
        setMedicines(mapped);
      } else {
        setMedicines([]);
      }
    } catch (err) {
      console.warn('API error when loading inventory:', err);
      setMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentStaffUser(getCurrentStaff());
    loadProducts();
  }, []);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((item) => {
      // Tab filter
      if (activeTab === 'in_stock' && item.stock <= 0) return false;
      if (activeTab === 'low_stock' && (item.stock > 20 || item.stock <= 0)) return false;
      if (activeTab === 'requires_rx' && !item.requiresRx) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Status dropdown filter
      if (selectedStatus === 'in_stock' && item.stock <= 0) return false;
      if (selectedStatus === 'low_stock' && item.stock > 20) return false;
      if (selectedStatus === 'cold_chain' && !item.isColdChain) return false;
      if (selectedStatus === 'rx_only' && !item.requiresRx) return false;
      if (selectedStatus === 'inactive' && item.active !== false) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesGeneric = item.genericName.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric && !matchesBrand && !matchesCode) {
          return false;
        }
      }

      return true;
    });
  }, [medicines, activeTab, selectedCategory, selectedStatus, searchQuery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size must be less than 5MB');
      return;
    }

    setFormError(null);
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.price) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      let payload: FormData | Record<string, any>;

      if (selectedImageFile) {
        // Use FormData so backend uploads directly to ImageKit
        const formData = new FormData();
        formData.append('name', newMed.name.trim());
        formData.append('price', newMed.price);
        if (newMed.genericName) formData.append('genericName', newMed.genericName.trim());
        if (newMed.brand) formData.append('brand', newMed.brand.trim());
        if (newMed.strength) formData.append('strength', newMed.strength.trim());
        if (newMed.code) formData.append('code', newMed.code.trim());
        if (newMed.description) formData.append('description', newMed.description.trim());
        if (newMed.categoryId) formData.append('categoryId', newMed.categoryId);
        if (newMed.form) formData.append('form', newMed.form);
        if (newMed.packSize) formData.append('packSize', newMed.packSize.trim());
        if (newMed.stock) formData.append('stock', newMed.stock);
        formData.append('requiresRx', String(newMed.requiresRx));
        formData.append('active', String(newMed.active));
        formData.append('image', selectedImageFile);
        payload = formData;
      } else {
        payload = {
          name: newMed.name.trim(),
          price: parseFloat(newMed.price),
          genericName: newMed.genericName.trim() || undefined,
          brand: newMed.brand.trim() || undefined,
          strength: newMed.strength.trim() || undefined,
          code: newMed.code.trim() || undefined,
          description: newMed.description.trim() || undefined,
          categoryId: newMed.categoryId || undefined,
          form: newMed.form,
          packSize: newMed.packSize.trim() || undefined,
          stock: parseInt(newMed.stock, 10) || 0,
          requiresRx: newMed.requiresRx,
          active: newMed.active,
          image: newMed.imageUrl.trim() || undefined,
        };
      }

      const response = await createProductApi(payload);

      if (response.success && response.data) {
        const catMap: Record<string, string> = {};
        categories.forEach((c) => {
          catMap[c.id] = c.name;
        });
        const createdItem = mapApiToMedicine(response.data, catMap);
        setMedicines((prev) => [createdItem, ...prev]);
        setShowAddModal(false);
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
        setNewMed({
          name: '',
          genericName: '',
          brand: '',
          strength: '',
          code: '',
          category: 'Antibiotics',
          categoryId: '',
          form: 'Tablet',
          packSize: '',
          price: '',
          stock: '',
          requiresRx: false,
          active: true,
          description: '',
          imageUrl: '',
        });
        setToastMessage({ text: `Successfully added ${createdItem.name}`, type: 'success' });
      } else {
        setFormError(response.message || 'Failed to save product');
      }
    } catch (err: any) {
      console.error('Failed to create product via API:', err);
      const isForbidden = err.response?.status === 403;
      const isUnauthorized = err.response?.status === 401;
      if (isForbidden || isUnauthorized) {
        setFormError(
          'Access Denied (403): Staff authorization required to register medicines. Please sign in at /staff/login with an authorized account (e.g. admin@riteplus.com).'
        );
      } else {
        setFormError(
          err.response?.data?.message || err.message || 'Failed to add product to inventory'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (item: MedicineItem) => {
    setEditingMed(item);
    setEditMed({
      name: item.name,
      genericName: item.genericName === 'Unspecified Compound' ? '' : item.genericName,
      brand: item.brand === 'Rite Plus Generic' ? '' : item.brand,
      strength: item.strength || '',
      code: item.code,
      category: item.category,
      categoryId: item.categoryId || '',
      form: item.form || 'Tablet',
      packSize: item.packSize === 'Standard Pack' ? '' : item.packSize,
      price: String(item.price),
      stock: String(item.stock),
      requiresRx: item.requiresRx,
      active: item.active !== false,
      description: item.description || '',
      imageUrl: item.image || '',
    });
    setSelectedEditImageFile(null);
    setEditImagePreviewUrl(item.image || null);
    setEditFormError(null);
    setShowEditModal(true);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setEditFormError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setEditFormError('Image size must be less than 5MB');
      return;
    }

    setEditFormError(null);
    setSelectedEditImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed || !editMed.name || !editMed.price) return;

    setIsEditSubmitting(true);
    setEditFormError(null);

    try {
      let payload: FormData | Record<string, any>;

      if (selectedEditImageFile) {
        const formData = new FormData();
        formData.append('name', editMed.name.trim());
        formData.append('price', editMed.price);
        if (editMed.genericName) formData.append('genericName', editMed.genericName.trim());
        if (editMed.brand) formData.append('brand', editMed.brand.trim());
        if (editMed.strength) formData.append('strength', editMed.strength.trim());
        if (editMed.code) formData.append('code', editMed.code.trim());
        if (editMed.description !== undefined) formData.append('description', editMed.description.trim());
        if (editMed.categoryId) formData.append('categoryId', editMed.categoryId);
        if (editMed.form) formData.append('form', editMed.form);
        if (editMed.packSize) formData.append('packSize', editMed.packSize.trim());
        if (editMed.stock) formData.append('stock', editMed.stock);
        formData.append('requiresRx', String(editMed.requiresRx));
        formData.append('active', String(editMed.active));
        formData.append('image', selectedEditImageFile);
        payload = formData;
      } else {
        payload = {
          name: editMed.name.trim(),
          price: parseFloat(editMed.price),
          genericName: editMed.genericName.trim() || undefined,
          brand: editMed.brand.trim() || undefined,
          strength: editMed.strength.trim() || undefined,
          code: editMed.code.trim() || undefined,
          description: editMed.description.trim() || undefined,
          categoryId: editMed.categoryId || undefined,
          form: editMed.form,
          packSize: editMed.packSize.trim() || undefined,
          stock: parseInt(editMed.stock, 10) || 0,
          requiresRx: editMed.requiresRx,
          active: editMed.active,
          image: editMed.imageUrl.trim() || undefined,
        };
      }

      const response = await updateProductApi(editingMed.id, payload);

      if (response.success && response.data) {
        const catMap: Record<string, string> = {};
        categories.forEach((c) => {
          catMap[c.id] = c.name;
        });
        const updatedItem = mapApiToMedicine(response.data, catMap);
        setMedicines((prev) => prev.map((m) => (m.id === updatedItem.id ? updatedItem : m)));
        setShowEditModal(false);
        setToastMessage({ text: `Updated ${updatedItem.name} successfully`, type: 'success' });
      } else {
        setEditFormError(response.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Failed to update product via API:', err);
      setEditFormError(
        err.response?.data?.message || err.message || 'Failed to update product in inventory'
      );
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleStockUpdate = async (delta: number) => {
    if (!stockModalMed) return;
    const newStock = Math.max(0, stockModalMed.stock + delta);

    // Optimistic UI update
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === stockModalMed.id ? { ...m, stock: newStock } : m
      )
    );
    setStockModalMed((prev) => (prev ? { ...prev, stock: newStock } : null));

    try {
      await adjustStockApi(stockModalMed.id, delta);
    } catch (err) {
      console.warn('Could not sync stock with backend:', err);
    }
  };

  const handleDeleteMedicine = async (item: MedicineItem) => {
    if (!confirm(`Remove ${item.name} from inventory catalog?`)) return;

    // Optimistic removal
    setMedicines((prev) => prev.filter((m) => m.id !== item.id));

    try {
      const res = await deleteProductApi(item.id);
      if (res.success) {
        setToastMessage({ text: `${item.name} removed from inventory`, type: 'success' });
      }
    } catch (err: any) {
      console.warn('API deletion error (item removed from view):', err);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium ${
              toastMessage.type === 'success'
                ? 'bg-[#0369A1] text-white border-[#075985]'
                : 'bg-red-600 text-white border-red-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-200" />
            )}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Row (Page Title + Pill Tabs + Actions) */}
      <header className="px-8 pt-7 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Page Title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Medicines & Inventory
              </h1>
              <span className="text-xs bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full font-medium">
                {filteredMedicines.length} items
              </span>
              {isLoading && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                  <Loader2 className="w-3 h-3 animate-spin text-[#0369A1]" />
                  Syncing...
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Real-time pharmaceutical inventory, batch control, and pricing management
            </p>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStaffUser && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-[#0369A1] font-semibold bg-[#E0F2FE] px-2.5 py-1 rounded-full">
                Staff: {currentStaffUser.name || currentStaffUser.email} ({currentStaffUser.role?.toUpperCase()})
              </span>
            )}

            <button
              onClick={loadProducts}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF9] shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh inventory from API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                const csvContent =
                  'data:text/csv;charset=utf-8,' +
                  ['Name,Code,Category,Price,Stock']
                    .concat(medicines.map((m) => `"${m.name}","${m.code}","${m.category}",${m.price},${m.stock}`))
                    .join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `rite_plus_inventory_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAF9] shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setFormError(null);
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="flex items-center gap-1 mt-5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Medicines' },
            { id: 'in_stock', label: 'In Stock' },
            { id: 'low_stock', label: 'Low Stock' },
            { id: 'requires_rx', label: 'Prescription Required' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0369A1] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar (Search + Dropdowns) */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines by name, generic formula, barcode, SKU..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1] transition-all"
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

          {/* Dropdown 1: Time Range */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#475569] font-medium focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
          >
            <option value="7d">Last 7 days</option>
            <option value="15d">Last 15 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">This Quarter</option>
          </select>

          {/* Dropdown 2: Statuses */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#475569] font-medium focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="in_stock">In Stock (&gt;0)</option>
            <option value="low_stock">Low Stock (≤20)</option>
            <option value="cold_chain">Cold Chain Only</option>
            <option value="rx_only">Prescription Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Dropdown 3: Categories */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#475569] font-medium focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-8 pb-8 flex flex-col min-h-0">
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xs flex flex-col overflow-hidden min-h-0">
          {/* Table Container */}
          {filteredMedicines.length === 0 && !isLoading ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mb-4 shadow-xs">
                <Pill className="w-8 h-8" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A] mb-1 font-display">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'No matching medicines found'
                  : 'No inventory items recorded yet'}
              </h2>
              <p className="text-xs text-[#64748B] max-w-sm mb-6 leading-relaxed">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try broadening your search terms or clearing status filters to view the pharmaceutical catalog.'
                  : 'Start building your pharmacy inventory. Registered medicines are tracked in real-time.'}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Medicine</span>
                </button>
              </div>
            </div>
          ) : (
            /* Data Table */
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 bg-[#F8FAF9] shadow-2xs">
                    <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9] text-[#64748B] text-[11px] font-semibold tracking-wider uppercase">
                      <th className="py-3 px-4 w-10 text-center">#</th>
                      <th className="py-3 px-4">Medicine & Formula</th>
                      <th className="py-3 px-3">SKU / Code</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Form & Pack</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-center">Stock Level</th>
                      <th className="py-3 px-3 text-center">Clearance</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredMedicines.map((item, idx) => {
                      const isLowStock = item.stock <= 20 && item.stock > 0;
                      const isOutOfStock = item.stock <= 0;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#F8FAF9] transition-colors group cursor-default"
                        >
                          <td className="py-3 px-4 text-center text-[#94A3B8] font-mono text-[11px]">
                            {idx + 1}
                          </td>

                          {/* Name & Formula + ImageKit Thumbnail */}
                          <td className="py-3 px-4 min-w-50">
                            <div className="flex items-center gap-2.5">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E2E8F0] bg-white"
                                  onError={(e) => {
                                    // Fallback to initial letter if image fails to load
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0 font-bold text-xs">
                                  {item.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Link
                                    href={`/products/${item.id}`}
                                    className="font-semibold text-[#0F172A] truncate hover:text-[#0369A1] hover:underline transition-colors"
                                    title="View Product Page"
                                  >
                                    {item.name}
                                  </Link>
                                  {item.strength && (
                                    <span className="text-[10px] px-1 py-0.2 bg-[#F1F5F9] text-[#475569] font-medium rounded border border-[#E2E8F0]">
                                      {item.strength}
                                    </span>
                                  )}
                                  {item.active === false && (
                                    <span className="text-[10px] px-1.5 py-0.2 bg-[#FEF2F2] text-[#DC2626] font-medium rounded border border-[#FECACA]">
                                      Inactive
                                    </span>
                                  )}
                                  {item.isColdChain && (
                                    <span
                                      className="text-[10px] px-1 py-0.2 bg-[#E0F2FE] text-[#0369A1] rounded font-medium flex items-center gap-0.5"
                                      title="Cold-Chain Required (2°C - 8°C)"
                                    >
                                      <Snowflake className="w-2.5 h-2.5" />
                                      Cold
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#64748B] truncate">
                                  {item.genericName} • {item.brand}
                                </p>
                                {item.description && (
                                  <p className="text-[10px] text-[#94A3B8] truncate max-w-xs mt-0.5" title={item.description}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* SKU Code */}
                          <td className="py-3 px-3 font-mono text-[11px] text-[#475569]">
                            <span className="bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                              {item.code}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] font-medium border border-[#DCFCE7]">
                              {item.category}
                            </span>
                          </td>

                          {/* Form & Pack */}
                          <td className="py-3 px-3 text-[#475569]">
                            <div>{item.form}</div>
                            <span className="text-[10px] text-[#94A3B8]">{item.packSize}</span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-3 text-right font-medium text-[#0F172A]">
                            PKR {item.price.toFixed(2)}
                          </td>

                          {/* Stock Level */}
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  isOutOfStock
                                    ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                                    : isLowStock
                                    ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
                                    : 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
                                }`}
                              >
                                {item.stock} in stock
                              </span>
                            </div>
                          </td>

                          {/* Clearance / Rx */}
                          <td className="py-3 px-3 text-center">
                            {item.requiresRx ? (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#FEF2F2] text-[#B91C1C] font-semibold border border-[#FECACA]">
                                Rx Required
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#F8FAF9] text-[#64748B] font-medium border border-[#E2E8F0]">
                                OTC
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <Link
                                href={`/products/${item.id}`}
                                className="p-1 text-[#64748B] hover:text-[#0369A1] rounded hover:bg-[#E0F2FE] transition-colors cursor-pointer"
                                title="View Live Product Page"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1 text-[#64748B] hover:text-[#0369A1] rounded hover:bg-[#E0F2FE] transition-colors cursor-pointer"
                                title="Edit Product Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setStockModalMed(item)}
                                className="px-2 py-1 text-[11px] font-medium rounded border border-[#E5E7EB] bg-white text-[#475569] hover:bg-[#F8FAF9] hover:text-[#0F172A] transition-colors cursor-pointer"
                                title="Quick Stock Adjustment"
                              >
                                Stock ±
                              </button>
                              <button
                                onClick={() => handleDeleteMedicine(item)}
                                className="p-1 text-[#94A3B8] hover:text-[#DC2626] rounded hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                                title="Delete Item"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Status */}
              <div className="py-2.5 px-4 bg-[#F8FAF9] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <strong className="text-[#0F172A]">{filteredMedicines.length}</strong> of{' '}
                    <strong className="text-[#0F172A]">{medicines.length}</strong> catalog entries
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                  <span className="text-[11px] text-[#059669] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                    API Connected
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* ADD MEDICINE MODAL (Connected to API + ImageKit)              */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#F0F4F2] flex items-center justify-between bg-[#F8FAF9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Add New Medicine</h3>
                  <p className="text-[11px] text-[#64748B]">
                    Register new pharmaceutical product into active formulary inventory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
                {formError.includes('/staff/login') && (
                  <Link href="/staff/login" className="font-bold underline text-[#0369A1] shrink-0">
                    Sign In →
                  </Link>
                )}
              </div>
            )}



            {/* Modal Form */}
            <form onSubmit={handleAddMedicineSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="e.g. Augmentin 625mg"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Generic Formula
                  </label>
                  <input
                    type="text"
                    value={newMed.genericName}
                    onChange={(e) => setNewMed({ ...newMed, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin + Clav"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Manufacturer / Brand
                  </label>
                  <input
                    type="text"
                    value={newMed.brand}
                    onChange={(e) => setNewMed({ ...newMed, brand: e.target.value })}
                    placeholder="e.g. GSK, Getz, Abbott"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Strength / Potency
                  </label>
                  <input
                    type="text"
                    value={newMed.strength}
                    onChange={(e) => setNewMed({ ...newMed, strength: e.target.value })}
                    placeholder="e.g. 625mg, 500mg, 10mg/ml"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Category
                  </label>
                  <select
                    value={newMed.categoryId || newMed.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matchedCat = categories.find((c) => c.id === val || c.name === val);
                      if (matchedCat) {
                        setNewMed({
                          ...newMed,
                          categoryId: matchedCat.id,
                          category: matchedCat.name,
                        });
                      } else {
                        setNewMed({ ...newMed, category: val, categoryId: '' });
                      }
                    }}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
                  >
                    <option value="">Select a Category</option>
                    {categories.length > 0 ? (
                      (() => {
                        const topCats = categories.filter((c) => !c.parentId);
                        const subCatsByParent: Record<string, typeof categories> = {};
                        categories.forEach((c) => {
                          if (c.parentId) {
                            if (!subCatsByParent[c.parentId]) subCatsByParent[c.parentId] = [];
                            subCatsByParent[c.parentId].push(c);
                          }
                        });

                        return topCats.map((top) => {
                          const subs = subCatsByParent[top.id] || [];
                          if (subs.length === 0) {
                            return (
                              <option key={top.id} value={top.id}>
                                {top.name}
                              </option>
                            );
                          }
                          return (
                            <optgroup key={top.id} label={top.name}>
                              <option value={top.id}>{top.name} (General)</option>
                              {subs.map((s) => (
                                <option key={s.id} value={s.id}>
                                  ↳ {s.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        });
                      })()
                    ) : (
                      <>
                        <option value="Antibiotics">Antibiotics</option>
                        <option value="Analgesics">Analgesics</option>
                        <option value="Diabetes Care">Diabetes Care</option>
                        <option value="Gastroenterology">Gastroenterology</option>
                        <option value="Vitamins & Supplements">Vitamins</option>
                        <option value="Respiratory">Respiratory</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Dosage Form
                  </label>
                  <select
                    value={newMed.form}
                    onChange={(e) => setNewMed({ ...newMed, form: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Drops">Drops</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Pack Size
                  </label>
                  <input
                    type="text"
                    value={newMed.packSize}
                    onChange={(e) => setNewMed({ ...newMed, packSize: e.target.value })}
                    placeholder="e.g. 14 Tablets"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMed.price}
                    onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={newMed.stock}
                    onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Barcode / SKU
                  </label>
                  <input
                    type="text"
                    value={newMed.code}
                    onChange={(e) => setNewMed({ ...newMed, code: e.target.value })}
                    placeholder="Auto-generate"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              {/* Description & Clinical Information */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#334155]">
                    Product Description & Structured Details
                  </label>
                  <span className="text-[10px] text-[#64748B]">
                    Supports multi-line, Ingredients:, How to use:, & bullet points (•)
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={newMed.description}
                  onChange={(e) => setNewMed({ ...newMed, description: e.target.value })}
                  placeholder={`Product Name: Clair Soft Oil Free Acne Wash\n\nIngredients: Aqua, Glycerin, Salicylic Acid...\n\nProduct Type: Face Wash\nPack Size: 120ml\nCompany: Stancos Pharma\nUsed For: Acnes\n\nProduct Detail\nDetailed description of product benefits...\n\nHow to use:\n• Cleanse twice a day\n• Wet face\n• Rinse thoroughly`}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] leading-relaxed resize-y"
                />
              </div>

              {/* Product Image / ImageKit Upload */}
              <div className="pt-2 border-t border-[#F0F4F2]">
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Product Packaging Image
                </label>
                <div className="flex items-center gap-3">
                  {imagePreviewUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-[#E5E7EB] overflow-hidden group shrink-0 bg-[#F8FAF9]">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageFile(null);
                          setImagePreviewUrl(null);
                        }}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0369A1] bg-[#F8FAF9] hover:bg-[#F1F5F9] flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 text-[#64748B] hover:text-[#0369A1]">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-medium">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#334155] truncate">
                      {selectedImageFile ? selectedImageFile.name : 'Choose JPG, PNG, or WebP'}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      High-resolution packaging photo uploaded directly to ImageKit CDN.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance & Catalog Visibility Checkboxes */}
              <div className="pt-2 border-t border-[#F0F4F2] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMed.requiresRx}
                    onChange={(e) => setNewMed({ ...newMed, requiresRx: e.target.checked })}
                    className="rounded text-[#0369A1] focus:ring-[#0369A1]"
                  />
                  <span className="text-xs font-medium text-[#334155]">
                    Requires Prescription (Rx Schedule G/H)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMed.active}
                    onChange={(e) => setNewMed({ ...newMed, active: e.target.checked })}
                    className="rounded text-[#0369A1] focus:ring-[#0369A1]"
                  />
                  <span className="text-xs font-medium text-[#334155]">
                    Active for Retail Sale (Visible to customers in public catalog)
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#F0F4F2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#475569] hover:bg-[#F8FAF9] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? 'Saving Medicine...' : 'Save & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT MEDICINE MODAL (Connected to PATCH /product/:id)        */}
      {/* ============================================================ */}
      {showEditModal && editingMed && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#F0F4F2] flex items-center justify-between bg-[#F8FAF9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Edit Medicine Details</h3>
                  <p className="text-[11px] text-[#64748B]">
                    Updating formulary specifications for <span className="font-semibold text-[#0369A1]">{editingMed.name}</span> ({editingMed.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {editFormError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{editFormError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleEditMedicineSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={editMed.name}
                  onChange={(e) => setEditMed({ ...editMed, name: e.target.value })}
                  placeholder="e.g. Augmentin 625mg"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Generic Formula
                  </label>
                  <input
                    type="text"
                    value={editMed.genericName}
                    onChange={(e) => setEditMed({ ...editMed, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin + Clav"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Manufacturer / Brand
                  </label>
                  <input
                    type="text"
                    value={editMed.brand}
                    onChange={(e) => setEditMed({ ...editMed, brand: e.target.value })}
                    placeholder="e.g. GSK, Getz, Abbott"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Strength / Potency
                  </label>
                  <input
                    type="text"
                    value={editMed.strength}
                    onChange={(e) => setEditMed({ ...editMed, strength: e.target.value })}
                    placeholder="e.g. 625mg, 500mg, 10mg/ml"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Category
                  </label>
                  <select
                    value={editMed.categoryId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matchedCat = categories.find((c) => c.id === val);
                      setEditMed({
                        ...editMed,
                        categoryId: val,
                        category: matchedCat ? matchedCat.name : editMed.category,
                      });
                    }}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
                  >
                    <option value="">Uncategorized</option>
                    {(() => {
                      const topCats = categories.filter((c) => !c.parentId);
                      const subCatsByParent: Record<string, typeof categories> = {};
                      categories.forEach((c) => {
                        if (c.parentId) {
                          if (!subCatsByParent[c.parentId]) subCatsByParent[c.parentId] = [];
                          subCatsByParent[c.parentId].push(c);
                        }
                      });

                      return topCats.map((top) => {
                        const subs = subCatsByParent[top.id] || [];
                        if (subs.length === 0) {
                          return (
                            <option key={top.id} value={top.id}>
                              {top.name}
                            </option>
                          );
                        }
                        return (
                          <optgroup key={top.id} label={top.name}>
                            <option value={top.id}>{top.name} (General)</option>
                            {subs.map((s) => (
                              <option key={s.id} value={s.id}>
                                ↳ {s.name}
                              </option>
                            ))}
                          </optgroup>
                        );
                      });
                    })()}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Dosage Form
                  </label>
                  <select
                    value={editMed.form}
                    onChange={(e) => setEditMed({ ...editMed, form: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] cursor-pointer"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Drops">Drops</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Pack Size
                  </label>
                  <input
                    type="text"
                    value={editMed.packSize}
                    onChange={(e) => setEditMed({ ...editMed, packSize: e.target.value })}
                    placeholder="e.g. 14 Tablets"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editMed.price}
                    onChange={(e) => setEditMed({ ...editMed, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Stock Level
                  </label>
                  <input
                    type="number"
                    value={editMed.stock}
                    onChange={(e) => setEditMed({ ...editMed, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Barcode / SKU
                  </label>
                  <input
                    type="text"
                    value={editMed.code}
                    onChange={(e) => setEditMed({ ...editMed, code: e.target.value })}
                    placeholder="Product SKU"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#334155]">
                    Product Description & Structured Details
                  </label>
                  <span className="text-[10px] text-[#64748B]">
                    Supports multi-line, Ingredients:, How to use:, & bullet points (•)
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={editMed.description}
                  onChange={(e) => setEditMed({ ...editMed, description: e.target.value })}
                  placeholder={`Product Name: Clair Soft Oil Free Acne Wash\n\nIngredients: Aqua, Glycerin, Salicylic Acid...\n\nProduct Type: Face Wash\nPack Size: 120ml\nCompany: Stancos Pharma\nUsed For: Acnes\n\nProduct Detail\nDetailed description of product benefits...\n\nHow to use:\n• Cleanse twice a day\n• Wet face\n• Rinse thoroughly`}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] leading-relaxed resize-y"
                />
              </div>

              {/* Product Packaging Image / ImageKit Update */}
              <div className="pt-2 border-t border-[#F0F4F2]">
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Packaging Image (ImageKit CDN)
                </label>
                <div className="flex items-center gap-3">
                  {editImagePreviewUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-[#E5E7EB] overflow-hidden group shrink-0 bg-[#F8FAF9]">
                      <img
                        src={editImagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <label
                        className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px] font-medium"
                        title="Replace image"
                      >
                        <Upload className="w-3.5 h-3.5 mb-0.5" />
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleEditImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0369A1] bg-[#F8FAF9] hover:bg-[#F1F5F9] flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 text-[#64748B] hover:text-[#0369A1]">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-medium">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                      />
                    </label>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#334155] truncate">
                      {selectedEditImageFile
                        ? selectedEditImageFile.name
                        : editImagePreviewUrl
                        ? 'Current Packaging Image'
                        : 'No image uploaded yet'}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      Upload a new photo to replace current ImageKit packaging asset.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance & Catalog Status Checkboxes */}
              <div className="pt-2 border-t border-[#F0F4F2] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editMed.requiresRx}
                    onChange={(e) => setEditMed({ ...editMed, requiresRx: e.target.checked })}
                    className="rounded text-[#0369A1] focus:ring-[#0369A1]"
                  />
                  <span className="text-xs font-medium text-[#334155]">
                    Requires Prescription (Rx Schedule G/H)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editMed.active}
                    onChange={(e) => setEditMed({ ...editMed, active: e.target.checked })}
                    className="rounded text-[#0369A1] focus:ring-[#0369A1]"
                  />
                  <span className="text-xs font-medium text-[#334155]">
                    Active for Retail Sale (Visible to customers in public catalog)
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#F0F4F2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isEditSubmitting}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#475569] hover:bg-[#F8FAF9] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isEditSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditSubmitting ? 'Saving Changes...' : 'Update Medicine'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* QUICK STOCK ADJUSTMENT MODAL                                 */}
      {/* ============================================================ */}
      {stockModalMed && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-sm font-bold text-[#0F172A] mb-1">
              Adjust Stock: {stockModalMed.name}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Current level: <strong className="text-[#0369A1]">{stockModalMed.stock} units</strong>
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => handleStockUpdate(-10)}
                className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-[#F8FAF9] font-bold cursor-pointer"
              >
                -10
              </button>
              <button
                onClick={() => handleStockUpdate(-1)}
                className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-[#F8FAF9] font-bold cursor-pointer"
              >
                -1
              </button>
              <div className="w-16 h-10 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-base font-mono">
                {stockModalMed.stock}
              </div>
              <button
                onClick={() => handleStockUpdate(1)}
                className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-[#F8FAF9] font-bold cursor-pointer"
              >
                +1
              </button>
              <button
                onClick={() => handleStockUpdate(10)}
                className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-[#F8FAF9] font-bold cursor-pointer"
              >
                +10
              </button>
            </div>

            <button
              onClick={() => setStockModalMed(null)}
              className="w-full py-2 rounded-lg bg-[#0369A1] text-xs font-semibold text-white shadow-xs hover:bg-[#075985] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
