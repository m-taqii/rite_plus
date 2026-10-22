'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  RefreshCw,
  Loader2,
  X,
  AlertCircle,
  FolderTree,
  Trash2,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  fetchCategories,
  fetchProducts,
  createCategoryApi,
  deleteCategoryApi,
  type ApiCategory,
} from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catList, prodRes] = await Promise.allSettled([
        fetchCategories(),
        fetchProducts({ limit: 200, activeOnly: true }),
      ]);

      if (catList.status === 'fulfilled') {
        setCategories(catList.value);
      }

      if (prodRes.status === 'fulfilled' && prodRes.value?.items) {
        const counts: Record<string, number> = {};
        for (const item of prodRes.value.items) {
          if (item.categoryId) {
            counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
          }
        }
        setProductCounts(counts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter top-level categories vs subcategories
  const topLevelCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  const subCategoriesByParent = useMemo(() => {
    const map: Record<string, ApiCategory[]> = {};
    for (const c of categories) {
      if (c.parentId) {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    }
    return map;
  }, [categories]);

  const handleOpenAddModal = (parentId: string = '') => {
    setFormError(null);
    setSelectedParentId(parentId);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    setShowAddModal(true);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmitting(true);
    setFormError(null);

    const slug =
      newCatSlug.trim() ||
      newCatName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    try {
      const res = await createCategoryApi(
        newCatName.trim(),
        slug,
        selectedParentId || null,
        newCatDesc.trim() || null
      );
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data!]);
        setShowAddModal(false);
        setNewCatName('');
        setNewCatSlug('');
        setNewCatDesc('');
        setSelectedParentId('');
      } else {
        setFormError(res.message || 'Failed to create category');
      }
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message || 'Error communicating with server'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? Any subcategories under it will also be deleted.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteCategoryApi(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
      } else {
        alert(res.message || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error deleting category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <header className="px-8 pt-7 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-display">
                Categories & Taxonomy
              </h1>
              <span className="text-xs bg-[#E0F2FE] text-[#0369A1] px-2.5 py-0.5 rounded-full font-bold">
                {topLevelCategories.length} Top Categories · {categories.filter(c => c.parentId).length} Subcategories
              </span>
              {isLoading && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0369A1]" />
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Organize your pharmaceutical inventory into Top Categories and Subcategories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-medium text-[#475569] hover:bg-[#F8FAF9] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => handleOpenAddModal('')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Top Category</span>
            </button>
          </div>
        </div>
      </header>

      <section className="px-8 pb-8 flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#0369A1]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center mb-3">
              <FolderTree className="w-7 h-7" />
            </div>
            <h2 className="text-sm font-bold text-[#0F172A] mb-1 font-display">
              No Categories Found
            </h2>
            <p className="text-xs text-[#64748B] max-w-sm mb-4">
              Add your first top category (e.g. Beauty Products, Medicines) to begin building your category hierarchy.
            </p>
            <button
              onClick={() => handleOpenAddModal('')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Top Category</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {topLevelCategories.map((topCat) => {
              const subs = subCategoriesByParent[topCat.id] || [];
              const topProductCount = productCounts[topCat.id] || 0;
              const totalSubsProductCount = subs.reduce(
                (sum, s) => sum + (productCounts[s.id] || 0),
                0
              );
              const combinedCount = topProductCount + totalSubsProductCount;

              return (
                <div
                  key={topCat.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden transition-all hover:border-[#BAE6FD]"
                >
                  {/* Top Category Card Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-white via-sky-50/20 to-sky-50/40 border-b border-[#F0F4F2]">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#0F172A] text-base font-display">
                            {topCat.name}
                          </h3>
                          <span className="text-[11px] font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                            /{topCat.slug}
                          </span>
                          <span className="text-[11px] font-bold text-[#0369A1] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                            Top Level
                          </span>
                        </div>
                        {topCat.description && (
                          <p className="text-xs text-[#64748B] mt-0.5 max-w-xl">
                            {topCat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-xs text-[#475569] bg-white px-3 py-1 rounded-full border border-[#E5E7EB] font-medium">
                        {combinedCount} active products
                      </span>
                      <button
                        onClick={() => handleOpenAddModal(topCat.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-xs font-bold text-[#0369A1] transition-colors cursor-pointer"
                        title="Add Subcategory under this category"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Subcategory</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(topCat.id, topCat.name)}
                        disabled={deletingId === topCat.id}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete top category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories Shelf */}
                  <div className="p-5 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-[#0369A1]" />
                        Subcategories ({subs.length})
                      </span>
                      {subs.length === 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                          No subcategories yet. Click &quot;Add Subcategory&quot; to create one.
                        </span>
                      )}
                    </div>

                    {subs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {subs.map((sub) => {
                          const subCount = productCounts[sub.id] || 0;
                          return (
                            <div
                              key={sub.id}
                              className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] hover:bg-white hover:border-[#0369A1]/40 transition-all flex flex-col justify-between group"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <ChevronRight className="w-3.5 h-3.5 text-[#0369A1]" />
                                    <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-[#0369A1] transition-colors">
                                      {sub.name}
                                    </h4>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteCategory(sub.id, sub.name)}
                                    disabled={deletingId === sub.id}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                                    title="Delete subcategory"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="text-[10px] font-mono text-[#64748B] mt-0.5 ml-5">
                                  /{sub.slug}
                                </p>
                                {sub.description && (
                                  <p className="text-[11px] text-[#64748B] mt-1 ml-5 line-clamp-2">
                                    {sub.description}
                                  </p>
                                )}
                              </div>

                              <div className="mt-3 ml-5 flex items-center justify-between pt-2 border-t border-gray-200/60">
                                <span className="text-[10px] font-semibold text-[#0369A1] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                                  {subCount} products
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-xs text-gray-500">
                          Products assigned to this category directly will display without a subcategory filter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add / Create Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F4F2]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {selectedParentId ? 'Add Subcategory' : 'Add Category'}
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  {selectedParentId
                    ? `Create a subcategory under "${topLevelCategories.find((c) => c.id === selectedParentId)?.name}"`
                    : 'Create a top-level classification or subcategory'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Hierarchy Parent Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Category Level / Hierarchy *
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1] bg-white cursor-pointer font-medium"
                >
                  <option value="">Top-Level Category (e.g. Beauty Products)</option>
                  <optgroup label="Select Parent (To Create Subcategory)">
                    {topLevelCategories.map((top) => (
                      <option key={top.id} value={top.id}>
                        ↳ Subcategory under: {top.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-[10px] text-[#64748B] mt-1">
                  {selectedParentId
                    ? `This will be grouped under "${topLevelCategories.find((c) => c.id === selectedParentId)?.name}"`
                    : 'Top-level categories appear on the main navigation bar and catalog rows.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedParentId
                      ? 'e.g. Skin Care, Hair Care, Sun Protection'
                      : 'e.g. Beauty Products, Medicines, Personal Care'
                  }
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  URL Slug (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. skin-care (auto-generated if left empty)"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg font-mono focus:outline-hidden focus:border-[#0369A1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for SEO and catalog filters..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-hidden focus:border-[#0369A1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F4F2]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0369A1] hover:bg-[#075985] text-xs font-semibold text-white rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
