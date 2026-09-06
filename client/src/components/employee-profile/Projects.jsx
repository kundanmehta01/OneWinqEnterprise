import React from 'react';
import { FolderGit2, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const Projects = ({ projects = [], onChange }) => {
  const add = () => onChange([...projects, { title: '', link: '', description: '' }]);
  const remove = (idx) => onChange(projects.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FolderGit2 className="w-3.5 h-3.5" /> Featured Projects
        </h3>
        <Button size="sm" variant="outline" icon={Plus} onClick={add}>Add</Button>
      </div>
      {projects.map((p, idx) => (
        <div key={idx} className="p-3 border border-slate-100 rounded-xl space-y-2 bg-slate-50/50">
          <Input
            label="Project Title"
            value={p.title || ''}
            onChange={(e) => {
              const u = [...projects];
              u[idx] = { ...u[idx], title: e.target.value };
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
