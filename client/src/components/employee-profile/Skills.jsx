import React, { useState } from 'react';
import { Code2, Plus, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Skills = ({ skills = [], onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const add = () => {
    if (!newSkill.trim()) return;
    onChange([...skills, { name: newSkill.trim() }]);
    setNewSkill('');
  };

  const remove = (idx) => onChange(skills.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Code2 className="w-3.5 h-3.5" /> Skills
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="e.g. React, Docker"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
        />
        <Button size="sm" variant="outline" onClick={add}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s, idx) => (
          <span key={idx} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            {s.name || s}
            <button type="button" onClick={() => remove(idx)} className="hover:text-rose-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
