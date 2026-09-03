import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { templateService } from '../../services/templateService';
import { useNotification } from '../../hooks/useNotification';

const emptyForm = { name: '', description: '', category: 'executive', theme: 'modern' };

export const CreateTemplateModal = ({ isOpen, onClose, onSuccess, template = null }) => {
  const { success, error: notifyError } = useNotification();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(template?._id);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(template ? {
      name: template.name || '',
      description: template.description || '',
      category: template.category || 'custom',
      theme: template.layoutConfig?.theme || template.theme || 'modern'
    } : emptyForm);
    setErrors({});
  }, [isOpen, template]);

  const categories = [
    { value: 'executive', label: 'Executive' }, { value: 'management', label: 'Management' },
    { value: 'employee', label: 'Employee' }, { value: 'founder', label: 'Founder' },
    { value: 'company', label: 'Company' }, { value: 'custom', label: 'Custom' }
  ];
  const themes = [
    { value: 'modern', label: 'Modern Indigo' }, { value: 'minimal', label: 'Minimal Clean' },
    { value: 'executive', label: 'Dark Executive' }, { value: 'vibrant', label: 'Vibrant Tech' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Template name is required' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(), description: formData.description,
        category: formData.category,
        layoutConfig: { ...(template?.layoutConfig || {}), theme: formData.theme },
        ...(isEditing ? {} : { sectionOrder: ['headline', 'about', 'experience', 'skills', 'contact'] })
      };
      if (isEditing) await templateService.update(template._id, payload);
      else await templateService.create(payload);
      success(isEditing ? 'Template updated successfully' : 'Template created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || `Failed to ${isEditing ? 'update' : 'create'} template`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Template' : 'Create New Template'} subtitle="Design a digital business card and profile layout">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Template Name" placeholder="e.g. Executive Profile" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name} required />
        <Input label="Description" placeholder="e.g. Professional high-contrast template for CXOs" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={categories} />
          <Select label="Style Theme" value={formData.theme} onChange={(e) => setFormData({ ...formData, theme: e.target.value })} options={themes} />
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" isLoading={loading}>{isEditing ? 'Save Changes' : 'Create Template'}</Button>
        </div>
      </form>
    </Modal>
  );
};
