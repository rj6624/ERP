import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Customer } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { CustomerFormModal } from './CustomerFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UserPlus, Eye, Edit2, Trash2 } from 'lucide-react';
import { formatWeight, formatDate } from '../../utils/formatters';

export const CustomersListPage: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    navigateToCustomer,
  } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const handleCreateCustomer = (data: { name: string; mobile: string; address: string }) => {
    addCustomer(data);
  };

  const handleUpdateCustomer = (data: { name: string; mobile: string; address: string }) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
      setEditingCustomer(null);
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      header: 'Customer Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer">
            {row.name}
          </span>
          <p className="text-[11px] text-slate-400 font-mono">{row.id}</p>
        </div>
      ),
    },
    {
      header: 'Mobile Number',
      accessorKey: 'mobile',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-700">{row.mobile}</span>,
    },
    {
      header: 'Total Jobs',
      accessorKey: 'totalJobs',
      sortable: true,
      align: 'center',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
          {row.totalJobs}
        </span>
      ),
    },
    {
      header: 'Pending Jobs',
      accessorKey: 'pendingJobs',
      sortable: true,
      align: 'center',
      cell: (row) => (
        <span
          className={`font-mono font-bold px-2 py-0.5 rounded ${
            row.pendingJobs > 0
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-slate-400'
          }`}
        >
          {row.pendingJobs}
        </span>
      ),
    },
    {
      header: 'Completed Jobs',
      accessorKey: 'completedJobs',
      sortable: true,
      align: 'center',
      cell: (row) => (
        <span className="font-mono text-emerald-700 font-semibold">{row.completedJobs}</span>
      ),
    },
    {
      header: 'Total Inward Weight',
      accessorKey: 'totalInwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-semibold text-slate-900">
          {formatWeight(row.totalInwardWeight)}
        </span>
      ),
    },
    {
      header: 'Last Job Date',
      accessorKey: 'lastJobDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600">{formatDate(row.lastJobDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigateToCustomer(row.id)}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditingCustomer(row)}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="Edit Customer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingCustomer(row)}
            className="p-1 rounded text-red-600 hover:text-red-800 hover:bg-red-50"
            title="Move to Recycle Bin"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Customer Management</h2>
          <p className="text-xs text-slate-500">
            Registered jewellery retailers, wholesalers, and manufacturers with automated job ID sequencing.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="erp-btn-brand self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" /> Add Customer
        </button>
      </div>

      {/* Main Customers Table */}
      <DataTable
        data={customers}
        columns={columns}
        onRowClick={(row) => navigateToCustomer(row.id)}
        searchPlaceholder="Search customers by name, phone..."
        exportFilename="customers_master"
      />

      {/* Add Modal */}
      <CustomerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />

      {/* Edit Modal */}
      {editingCustomer && (
        <CustomerFormModal
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSubmit={handleUpdateCustomer}
          initialData={editingCustomer}
        />
      )}

      {/* Delete Confirmation */}
      {deletingCustomer && (
        <ConfirmDialog
          isOpen={!!deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={() => deleteCustomer(deletingCustomer.id)}
          title={`Delete Customer "${deletingCustomer.name}"?`}
          message="This will remove the customer and move the record to the Admin Recycle Bin. Related historical job records will remain accessible in reports."
          confirmText="Move to Recycle Bin"
          variant="danger"
          icon="trash"
        />
      )}
    </div>
  );
};
