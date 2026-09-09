import React, { useState } from 'react';
import { QrCode } from 'lucide-react';

export const EmployeeQrCode = ({ url }) => {
  const [loading, setLoading] = useState(Boolean(url));
  const [failed, setFailed] = useState(false);

  if (!url) return null;

  return (
    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
        {loading && <QrCode className="w-6 h-6 text-slate-300 animate-pulse" />}
        {failed ? (
          <span className="text-[10px] text-rose-500 text-center px-1">Unavailable</span>
        ) : (
          <img
            src={url}
            alt="Employee profile QR code"
            className={`w-full h-full object-contain ${loading ? 'hidden' : ''}`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
          />
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700">Profile QR code</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Scan to open this public profile</p>
      </div>
    </div>
  );
};
