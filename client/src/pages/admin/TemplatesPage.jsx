import React, { useState } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { TemplatesHeader } from '../../components/templates/TemplatesHeader';
import { TemplatesStats } from '../../components/templates/TemplatesStats';
import { TemplatesTable } from '../../components/templates/TemplatesTable';
import { TemplatePreviewPane } from '../../components/templates/TemplatePreviewPane';
import { CreateTemplateModal } from '../../components/templates/CreateTemplateModal';
import { Pagination } from '../../components/common/Pagination';
import { templateService } from '../../services/templateService';
import { useNotification } from '../../hooks/useNotification';

export const TemplatesPage = () => {
  const { templates, loading, refetch } = useTemplates();
  const { success, error: notifyError } = useNotification();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const activeSelected = selectedTemplate || (templates.length > 0 ? templates[0] : null);

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
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to archive template');
    }
  };

  return (
    <div className="space-y-6">
      <TemplatesHeader
        onCreateTemplate={() => setCreateModalOpen(true)}
        onCategories={() => {}}
      />

      <TemplatesStats
        totalTemplates={templates.length}
        activeTemplates={templates.filter((t) => t.isActive !== false && !t.isArchived).length}
        inactiveTemplates={templates.filter((t) => t.isActive === false || t.isArchived).length}
        assignedTemplates={templates.filter((t) => t.isDefault).length}
        totalUsage={templates.reduce((acc, t) => acc + (t.version || 1), 0)}
      />

      {/* 2-Column Split: Table + Live Preview & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <TemplatesTable
            templates={templates}
            selectedTemplate={activeSelected}
            onSelectTemplate={setSelectedTemplate}
            search={search}
            onSearchChange={setSearch}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
          />

          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={templates.length}
            itemsPerPage={10}
            onPageChange={() => {}}
            label="templates"
          />
        </div>

        <div className="lg:col-span-4">
          <TemplatePreviewPane
            template={activeSelected}
            onEdit={() => {}}
            onFullPreview={() => {}}
          />
        </div>
      </div>

      <CreateTemplateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};
