import React, { useState } from 'react';
import { useDepartments } from '../../hooks/useDepartments';
import { DepartmentModal } from '../../components/departments/DepartmentModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Plus, Network, Users, Edit2, Trash2 } from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { useNotification } from '../../hooks/useNotification';
import { DeleteDepartmentModal } from '../../components/departments/DeleteDepartmentModal';

export const DepartmentsPage = () => {
  const { departments, loading, refetch } = useDepartments();
  const { success, error: notifyError } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingDept) return;
    setDeleteLoading(true);
    try {
      await departmentService.delete(deletingDept._id);
      success('Department deleted successfully');
      setDeletingDept(null);
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to delete department');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and organize functional divisions across the enterprise.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingDept(null);
            setModalOpen(true);
          }}
        >
          Add Department
        </Button>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner message="Loading departments..." />
        </div>
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No departments found"
          description="Get started by creating your organization's first department."
          actionLabel="Create Department"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Network className="w-5 h-5" />
                  </div>
                  <Badge variant="green" dot>
                    Active
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {dept.description || 'No description provided'}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dept.memberCount || 0} members</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingDept(dept)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DepartmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        department={editingDept}
        onSuccess={refetch}
      />
      <DeleteDepartmentModal
        isOpen={Boolean(deletingDept)}
        onClose={() => !deleteLoading && setDeletingDept(null)}
        onConfirm={handleDelete}
        departmentName={deletingDept?.name}
        loading={deleteLoading}
      />
    </div>
  );
};
