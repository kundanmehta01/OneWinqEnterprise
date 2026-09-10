import React, { useRef } from 'react';

export const OTPInput = ({ value = ['', '', '', '', '', ''], onChange }) => {
  const inputRefs = useRef([]);

  const handleChange = (index, val) => {
    if (val && !/^\d+$/.test(val)) return;
    const newOtp = [...value];
    newOtp[index] = val.slice(-1);
    onChange(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(text)) {
      onChange(text.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      ))}
    </div>
  );
};
