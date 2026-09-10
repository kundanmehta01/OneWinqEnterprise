import React, { useState } from 'react';
import { QrCode as QrIcon } from 'lucide-react';

export const QRCode = ({ value, size = 150, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const encodedValue = encodeURIComponent(value || 'https://onewinq.com');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}&color=4338ca&bgcolor=ffffff`;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center bg-white rounded-xl overflow-hidden ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse">
          <QrIcon className="w-8 h-8 text-indigo-300" />
        </div>
      )}
      <img
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default QRCode;
