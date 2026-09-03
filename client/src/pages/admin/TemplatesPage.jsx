import React, { useMemo, useState } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { TemplatesHeader } from '../../components/templates/TemplatesHeader';
import { TemplatesStats } from '../../components/templates/TemplatesStats';
import { TemplatesTable } from '../../components/templates/TemplatesTable';
import { TemplatePreviewPane } from '../../components/templates/TemplatePreviewPane';
import { CreateTemplateModal } from '../../components/templates/CreateTemplateModal';
import { EditTemplateModal } from '../../components/templates/EditTemplateModal';
import { Pagination } from '../../components/common/Pagination';
import { templateService } from '../../services/templateService';
import { useNotification } from '../../hooks/useNotification';

export const TemplatesPage = () => {
  const { templates, loading, refetch } = useTemplates();
  const { success, error: notifyError } = useNotification();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [search, setSearch] = useState('');

  const filteredTemplates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return templates;
    return templates.filter((template) =>
      [template.name, template.description, template.category, template.type, template.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [templates, search]);

  const activeSelected =
    filteredTemplates.find((template) => template._id === selectedTemplate?._id) || filteredTemplates[0] || null;

  const handleDuplicate = async (id) => {
    try {
      await templateService.duplicate(id);
      success('Template cloned successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to duplicate template');
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Are you sure you want to archive this template?')) return;
    try {
      await templateService.archive(id);
      success('Template archived');
      setSelectedTemplate(null);
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to archive template');
    }
  };

  return (
    <div className="space-y-6">
      <TemplatesHeader onCreateTemplate={() => setCreateModalOpen(true)} onCategories={() => {}} />

      <TemplatesStats
        totalTemplates={templates.length}
        activeTemplates={templates.filter((t) => t.isActive !== false && !t.isArchived).length}
        inactiveTemplates={templates.filter((t) => t.isActive === false || t.isArchived).length}
        assignedTemplates={templates.filter((t) => t.isDefault).length}
        totalUsage={templates.reduce((acc, t) => acc + (t.version || 1), 0)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <TemplatesTable
            templates={filteredTemplates}
            selectedTemplate={activeSelected}
            onSelectTemplate={setSelectedTemplate}
            search={search}
            onSearchChange={setSearch}
            onEdit={setEditingTemplate}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
          />
          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredTemplates.length}
            itemsPerPage={filteredTemplates.length || 10}
            onPageChange={() => {}}
            label="templates"
          />
        </div>

        <div className="lg:col-span-4">
          <TemplatePreviewPane
            template={activeSelected}
            onEdit={setEditingTemplate}
            onFullPreview={() => {}}
          />
        </div>
      </div>

      <CreateTemplateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={refetch}
      />
      <EditTemplateModal
        isOpen={Boolean(editingTemplate)}
        template={editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default TemplatesPage;
