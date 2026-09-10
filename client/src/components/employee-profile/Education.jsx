import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const Education = ({ education = [], onChange }) => {
  const add = () => onChange([...education, { degree: '', institution: '', year: '' }]);
  const remove = (idx) => onChange(education.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Education
        </h3>
        <Button size="sm" variant="outline" icon={Plus} onClick={add}>Add</Button>
      </div>
      {education.map((edu, idx) => (
        <div key={idx} className="p-3 border border-slate-100 rounded-xl space-y-2 bg-slate-50/50">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Degree / Major"
              value={edu.degree || ''}
              onChange={(e) => {
                const u = [...education];
                u[idx] = { ...u[idx], degree: e.target.value };
                onChange(u);
              }}
            />
            <Input
              label="Institution"
              value={edu.institution || ''}
              onChange={(e) => {
                const u = [...education];
                u[idx] = { ...u[idx], institution: e.target.value };
                onChange(u);
              }}
            />
          </div>
          <button type="button" onClick={() => remove(idx)} className="text-[10px] text-rose-500 hover:underline">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
