import React from 'react';
import { CreditCard, SmartphoneNfc, Bot, Layout, ArrowLeft, ArrowRight, Package } from 'lucide-react';

export const Screen3Products = ({ profile, onBack, onNavigate }) => {
  const items = profile?.productsServices || [];

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

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Products & Services</h3>
            <p className="text-xs text-slate-500">Enterprise Digital Services & Smart NFC Hardware</p>
          </div>
        </div>
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {items.length} {items.length === 1 ? 'Offering' : 'Offerings'}
        </span>
      </div>

      {/* Product Cards Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((prod, idx) => (
            <div
              key={prod._id || idx}
              className="clean-card clean-card-hover p-6 bg-white border border-slate-100 rounded-3xl space-y-4 cursor-pointer group shadow-2xs flex flex-col justify-between"
              onClick={handleInquire}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-purple-600 shadow-2xs overflow-hidden">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      getProductIcon(prod.icon, prod.title)
                    )}
                  </div>
                  {prod.badge && (
                    <span className="px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {prod.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Category: <strong className="text-slate-800 font-semibold">{prod.category || 'General'}</strong></span>
                <span className="text-purple-600 font-bold flex items-center gap-1 group-hover:underline">
                  Inquire Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
            Products and smart NFC cards configured in the enterprise studio will be showcased here.
          </p>
        </div>
      )}

      {/* Action CTA */}
      {items.length > 0 && (
        <div className="pt-2">
          <button
            onClick={handleInquire}
            className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group"
          >
            <span>Request Catalog & Enterprise Pricing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
