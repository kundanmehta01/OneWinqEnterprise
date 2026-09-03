import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { templateService } from '../../services/templateService';
import { useNotification } from '../../hooks/useNotification';

export const CreateTemplateModal = ({ isOpen, onClose, onSuccess }) => {
  const { success, error: notifyError } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'executive',
    theme: 'modern'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'executive', label: 'Executive' },
    { value: 'management', label: 'Management' },
    { value: 'employee', label: 'Employee' },
    { value: 'founder', label: 'Founder' },
    { value: 'company', label: 'Company' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Template name is required' });
      return;
    }

    setLoading(true);
    try {
      await templateService.create({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        layoutConfig: {
          theme: formData.theme,
          colorPalette: { primary: '#6366F1', accent: '#4F46E5' }
        },
        sectionOrder: ['headline', 'about', 'experience', 'skills', 'contact']
      });
      success('Template created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Template"
      subtitle="Design a digital business card and profile layout"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Template Name"
          placeholder="e.g. Executive Profile"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <Input
          label="Description"
          placeholder="e.g. Professional high-contrast template for CXOs"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
          />

          <Select
            label="Style Theme"
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            options={[
              { value: 'modern', label: 'Modern Indigo' },
              { value: 'minimal', label: 'Minimal Clean' },
              { value: 'executive', label: 'Dark Executive' },
              { value: 'vibrant', label: 'Vibrant Tech' }
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Create Template
          </Button>
        </div>
      </form>
    </Modal>
  );
};
