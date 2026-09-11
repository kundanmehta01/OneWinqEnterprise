import React, { useState } from 'react';
import { CreditCard, SmartphoneNfc, Bot, Layout, ArrowLeft, ArrowRight, Package, Plus, Trash2, Camera, Edit3, X, UploadCloud } from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const Screen3Products = ({
  profile,
  onBack,
  onNavigate,
  isEditable = false,
  onAddArrayItem = () => {},
  onUpdateArrayItem = () => {},
  onRemoveArrayItem = () => {}
}) => {
  const items = profile?.productsServices || [];
  const [modalItemIdx, setModalItemIdx] = useState(null);

  const getProductIcon = (iconName = '', title = '') => {
    const t = (title + iconName).toLowerCase();
    if (t.includes('nfc') || t.includes('smart')) return <SmartphoneNfc className="w-5 h-5 text-purple-600" />;
    if (t.includes('ai') || t.includes('assistant') || t.includes('bot')) return <Bot className="w-5 h-5 text-purple-600" />;
    if (t.includes('template') || t.includes('web') || t.includes('layout')) return <Layout className="w-5 h-5 text-purple-600" />;
    return <CreditCard className="w-5 h-5 text-purple-600" />;
  };

  const handleInquire = () => {
    if (onNavigate) {
      onNavigate(8);
    }
  };

  const handleAddProduct = () => {
    onAddArrayItem('productsServices', {
      title: 'New Product / NFC Card',
      description: 'Describe the features and capabilities of this product or digital service...',
      category: 'Hardware & Identity',
      badge: 'Popular',
      imageUrl: '',
      icon: 'card'
    });
  };

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Products & Services</h3>
            <p className="text-xs text-slate-500">Enterprise Digital Services & Smart NFC Hardware</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditable && (
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {items.length} {items.length === 1 ? 'Offering' : 'Offerings'}
          </span>
        </div>
      </div>

      {/* Product Cards Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((prod, idx) => (
            <div
              key={prod._id || idx}
              className="clean-card p-6 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-2xs flex flex-col justify-between relative group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="relative group/img shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs overflow-hidden relative">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        getProductIcon(prod.icon, prod.title)
                      )}
                    </div>
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => setModalItemIdx(idx)}
                        className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-full shadow-md cursor-pointer transition-all hover:scale-110"
                        title="Upload product photo"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditable ? (
                      <input
                        type="text"
                        value={prod.badge || ''}
                        onChange={(e) => onUpdateArrayItem('productsServices', idx, { badge: e.target.value })}
                        placeholder="Badge (e.g. Featured)"
                        className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold outline-none text-right"
                      />
                    ) : (
                      prod.badge && (
                        <span className="px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                          {prod.badge}
                        </span>
                      )
                    )}

                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => onRemoveArrayItem('productsServices', idx)}
                        className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {isEditable ? (
                    <>
                      <input
                        type="text"
                        value={prod.title || ''}
                        onChange={(e) => onUpdateArrayItem('productsServices', idx, { title: e.target.value })}
                        placeholder="Product Title"
                        className="w-full text-base font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
                      />
                      <textarea
                        rows={2}
                        value={prod.description || ''}
                        onChange={(e) => onUpdateArrayItem('productsServices', idx, { description: e.target.value })}
                        placeholder="Product Description..."
                        className="w-full text-xs text-slate-600 leading-relaxed bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 focus:border-purple-500 outline-none resize-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <input
                          type="text"
                          value={prod.category || ''}
                          onChange={(e) => onUpdateArrayItem('productsServices', idx, { category: e.target.value })}
                          placeholder="Category (e.g. NFC Hardware)"
                          className="w-full text-[11px] text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:border-purple-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setModalItemIdx(idx)}
                          className="w-full py-1 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-purple-200 transition-colors cursor-pointer truncate"
                        >
                          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{prod.imageUrl ? 'Change Photo' : 'Upload Photo / URL'}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Category: <strong className="text-slate-800 font-semibold">{prod.category || 'General'}</strong></span>
                <span
                  onClick={handleInquire}
                  className="text-purple-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Inquire Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No products or services listed yet.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add Product" above to showcase offerings and hardware on the company profile.
          </p>
        </div>
      )}

      {/* Product Photo Upload Modal */}
      {modalItemIdx !== null && items[modalItemIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                Upload Offering Photo / Asset
              </h3>
              <button
                type="button"
                onClick={() => setModalItemIdx(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <ImageUploadInput
              label={items[modalItemIdx].title || 'Product Image'}
              description="Choose an image from your computer/device or enter an image URL."
              value={items[modalItemIdx].imageUrl || ''}
              onChange={(val) => onUpdateArrayItem('productsServices', modalItemIdx, { imageUrl: val })}
              aspectRatio="square"
              entityType="company_product"
              placeholder="https://images.unsplash.com/..."
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalItemIdx(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

