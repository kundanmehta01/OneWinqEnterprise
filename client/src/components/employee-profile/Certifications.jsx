import React from 'react';
import { Award, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const Certifications = ({ certifications = [], onChange }) => {
  const add = () => onChange([...certifications, { name: '', issuer: '', year: '' }]);
  const remove = (idx) => onChange(certifications.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" /> Certifications & Licenses
        </h3>
        <Button size="sm" variant="outline" icon={Plus} onClick={add}>Add</Button>
      </div>
      {certifications.map((c, idx) => (
        <div key={idx} className="p-3 border border-slate-100 rounded-xl space-y-2 bg-slate-50/50">
          <Input
            label="Certification Name"
            value={c.name || ''}
            onChange={(e) => {
              const u = [...certifications];
              u[idx] = { ...u[idx], name: e.target.value };
              onChange(u);
            }}
          />
          <button type="button" onClick={() => remove(idx)} className="text-[10px] text-rose-500 hover:underline">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
