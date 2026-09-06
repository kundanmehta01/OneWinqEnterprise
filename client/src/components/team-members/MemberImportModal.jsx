import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Upload } from 'lucide-react';

export const MemberImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Team Members (CSV)">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">Upload .csv file with columns: Name, Email, Designation</p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="mt-3 text-xs text-slate-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!file} onClick={() => { onImport?.(file); onClose(); }}>
            Import File
          </Button>
        </div>
      </div>
    </Modal>
  );
};
