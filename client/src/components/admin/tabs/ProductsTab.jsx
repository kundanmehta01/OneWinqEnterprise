import React from 'react';
import { Plus, Trash2, Eye, EyeOff, Layers } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const ProductsTab = () => {
  const { draft, addArrayItem, removeArrayItem, updateArrayItem } = useCompanyProfileStore();
  if (!draft) return null;

  const products = draft.productsServices || [];

  const handleAddProduct = () => {
    addArrayItem('productsServices', {
      title: 'New Product / Service',
      description: 'Description of the product or enterprise software service.',
      category: 'Digital Identity',
      badge: 'Flagship',
      icon: 'layers',
      imageUrl: '',
      order: products.length + 1,
      isVisible: true,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" /> Products & Services
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage enterprise software products, smart NFC hardware, APIs, and business services.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProduct}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 shadow-sm shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product / Service
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No products or services added yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Product / Service" to list your offerings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((prod, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-4 shadow-xs">
              {/* Top Header inside Card */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {prod.title || 'Untitled Product / Service'}
                  </span>
                  {prod.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 shrink-0">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateArrayItem('productsServices', idx, { isVisible: !prod.isVisible })}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      prod.isVisible !== false ? 'text-purple-600 hover:bg-purple-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={prod.isVisible !== false ? 'Visible on Public Page' : 'Hidden'}
                  >
                    {prod.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('productsServices', idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700">Product / Service Title *</label>
                  <input
                    type="text"
                    value={prod.title || ''}
                    onChange={(e) => updateArrayItem('productsServices', idx, { title: e.target.value })}
                    placeholder="e.g. OneWinq Identity Cloud (SaaS)"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Badge Tag</label>
                  <input
                    type="text"
                    value={prod.badge || ''}
                    onChange={(e) => updateArrayItem('productsServices', idx, { badge: e.target.value })}
                    placeholder="e.g. Flagship / Hardware / AI"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={prod.description || ''}
                    onChange={(e) => updateArrayItem('productsServices', idx, { description: e.target.value })}
                    placeholder="Enterprise multi-tenant identity fabric with role governance and audit trails."
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white resize-none transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-semibold text-slate-700">Category Tag</label>
                  <input
                    type="text"
                    value={prod.category || ''}
                    onChange={(e) => updateArrayItem('productsServices', idx, { category: e.target.value })}
                    placeholder="e.g. Cloud SaaS / Hardware / AI"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700">CTA / Landing Page Link</label>
                  <input
                    type="url"
                    value={prod.ctaUrl || ''}
                    onChange={(e) => updateArrayItem('productsServices', idx, { ctaUrl: e.target.value })}
                    placeholder="https://onewinq.com/products/identity-cloud"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                {/* Image Upload Input Component */}
                <div className="sm:col-span-3 pt-2 border-t border-slate-100">
                  <ImageUploadInput
                    label="Product / Service Visual Image or Logo"
                    description="Upload a high-resolution screenshot, 3D card render, or feature illustration."
                    value={prod.imageUrl || ''}
                    onChange={(url) => updateArrayItem('productsServices', idx, { imageUrl: url })}
                    aspectRatio="banner"
                    entityType="company"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
