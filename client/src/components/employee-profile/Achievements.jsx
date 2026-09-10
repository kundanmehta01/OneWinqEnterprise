import React from 'react';
import { Trophy, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const Achievements = ({ achievements = [], onChange }) => {
  const add = () => onChange([...achievements, { title: '', date: '' }]);
  const remove = (idx) => onChange(achievements.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" /> Key Achievements
        </h3>
        <Button size="sm" variant="outline" icon={Plus} onClick={add}>Add</Button>
      </div>
      {achievements.map((a, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={a.title || ''}
            onChange={(e) => {
              const u = [...achievements];
              u[idx] = { ...u[idx], title: e.target.value };
              onChange(u);
            }}
            placeholder="Achievement award or honor"
          />
          <button type="button" onClick={() => remove(idx)} className="text-[10px] text-rose-500">Remove</button>
        </div>
      ))}
    </div>
  );
};
