import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

export const CompanySections = ({ sections = [], onChange }) => {
  const addSection = () => {
    onChange([...sections, { title: '', content: '', isVisible: true }]);
  };

  const removeSection = (idx) => {
    onChange(sections.filter((_, i) => i !== idx));
  };

  const updateSection = (idx, field, val) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Custom Page Sections
        </h3>
        <Button size="sm" variant="outline" icon={Plus} onClick={addSection}>
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <p className="text-xs text-slate-400 py-2">No custom sections added yet.</p>
      ) : (
        <div className="space-y-3">
          {sections.map((sec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="Section Title (e.g. Our Leadership)"
                  value={sec.title || ''}
                  onChange={(e) => updateSection(idx, 'title', e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => removeSection(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Section Content..."
                value={sec.content || ''}
                onChange={(e) => updateSection(idx, 'content', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
