import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check, X } from 'lucide-react';

const MONTHS = [
  { short: 'Jan', full: 'January' },
  { short: 'Feb', full: 'February' },
  { short: 'Mar', full: 'March' },
  { short: 'Apr', full: 'April' },
  { short: 'May', full: 'May' },
  { short: 'Jun', full: 'June' },
  { short: 'Jul', full: 'July' },
  { short: 'Aug', full: 'August' },
  { short: 'Sep', full: 'September' },
  { short: 'Oct', full: 'October' },
  { short: 'Nov', full: 'November' },
  { short: 'Dec', full: 'December' }
];

export const MonthYearCalendarPicker = ({
  month = '',
  year = '',
  onChange,
  disabled = false,
  disabledText = '',
  placeholder = 'Select month & year',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const now = new Date();
  const currentRealYear = now.getFullYear();
  const currentRealMonth = MONTHS[now.getMonth()].short;

  const initialYear = year && !isNaN(Number(year)) ? Number(year) : currentRealYear;
  const [viewYear, setViewYear] = useState(initialYear);

  // Sync viewYear when year prop updates
  useEffect(() => {
    if (year && !isNaN(Number(year))) {
      setViewYear(Number(year));
    }
  }, [year]);

  // Handle outside clicks to close the calendar popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectMonth = (selectedMonth) => {
    if (disabled) return;
    onChange?.({
      month: selectedMonth,
      year: String(viewYear)
    });
    setIsOpen(false);
  };

  const handleSelectCurrentMonth = () => {
    if (disabled) return;
    onChange?.({
      month: currentRealMonth,
      year: String(currentRealYear)
    });
    setViewYear(currentRealYear);
    setIsOpen(false);
  };

  const handleClear = () => {
    if (disabled) return;
    onChange?.({
      month: '',
      year: ''
    });
    setIsOpen(false);
  };

  const yearsList = [];
  const startYear = 1980;
  const endYear = currentRealYear + 10;
  for (let y = endYear; y >= startYear; y--) {
    yearsList.push(y);
  }

  const hasValue = Boolean(month || year);
  const displayLabel = disabled && disabledText
    ? disabledText
    : hasValue
    ? `${month ? month + ' ' : ''}${year || ''}`.trim()
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg border transition-all text-left ${
          disabled
            ? disabledText === 'PRESENT'
              ? 'bg-purple-50 text-purple-700 font-bold border-purple-200 cursor-not-allowed'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-purple-500 ring-2 ring-purple-100 text-slate-900 shadow-xs'
            : hasValue
            ? 'bg-white border-slate-200 text-slate-900 hover:border-purple-300'
            : 'bg-white border-slate-200 text-slate-400 hover:border-purple-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Calendar className={`w-3.5 h-3.5 shrink-0 ${disabled ? 'text-slate-400' : 'text-purple-600'}`} />
          <span className="truncate">{displayLabel}</span>
        </div>
        {!disabled && (
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
        )}
      </button>

      {/* Calendar Month/Year Popover */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 w-64 space-y-3 animate-in fade-in zoom-in-95">
          {/* Header with Year Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setViewYear(prev => prev - 1)}
              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
              title="Previous Year"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Year Selector */}
            <div className="flex items-center gap-1">
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-bold text-slate-900 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setViewYear(prev => prev + 1)}
              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
              title="Next Year"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month Grid (3 columns x 4 rows) */}
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m) => {
              const isSelected = month === m.short && String(year) === String(viewYear);
              const isCurrentNow = currentRealMonth === m.short && currentRealYear === viewYear;

              return (
                <button
                  key={m.short}
                  type="button"
                  onClick={() => handleSelectMonth(m.short)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                      : 'text-slate-700 bg-slate-50/60 hover:bg-purple-50 hover:text-purple-700 border border-transparent hover:border-purple-200'
                  }`}
                  title={m.full}
                >
                  <span>{m.short}</span>
                  {isCurrentNow && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-purple-600 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Popover Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSelectCurrentMonth}
              className="text-purple-600 hover:text-purple-700 font-bold cursor-pointer hover:underline"
            >
              This Month
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearCalendarPicker;
