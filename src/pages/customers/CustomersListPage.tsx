import { Button } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Customer } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { CustomerFormModal } from './CustomerFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UserPlus, Eye, Edit2, Trash2, Phone, Calendar, Scale, Briefcase } from 'lucide-react';
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
          <Button variant="secondary" size="icon"
            onClick={() => navigateToCustomer(row.id)}
            className=""
            title="View Details"
            aria-label="View Customer Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button variant="secondary" size="icon"
            onClick={() => setEditingCustomer(row)}
            className=""
            title="Edit Customer"
            aria-label="Edit Customer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon"
            onClick={() => setDeletingCustomer(row)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Move to Recycle Bin"
            aria-label="Delete Customer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const renderCustomerCard = (customer: Customer) => (
    <div
      key={customer.id}
      onClick={() => navigateToCustomer(customer.id)}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm sm:text-base leading-tight">
              {customer.name}
            </h4>
            <span className="text-[11px] font-mono text-slate-400 font-semibold">{customer.id}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            {customer.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono mb-3 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium">{customer.mobile}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 text-center">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Total</div>
            <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{customer.totalJobs}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Pending</div>
            <div className={`text-sm font-bold font-mono mt-0.5 ${customer.pendingJobs > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {customer.pendingJobs}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">Done</div>
            <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">{customer.completedJobs}</div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium leading-none">Inward Weight</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">{formatWeight(customer.totalInwardWeight)}</span>
            </div>
          </div>
          <div className="text-right flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium leading-none">Last Job</span>
              <span className="text-slate-700 font-medium mt-0.5 block">{formatDate(customer.lastJobDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigateToCustomer(customer.id)}
          className="flex-1 text-xs justify-center"
        >
          <Eye className="w-3.5 h-3.5" /> View Profile
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setEditingCustomer(customer)}
          title="Edit Customer"
          aria-label="Edit Customer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeletingCustomer(customer)}
          title="Move to Recycle Bin"
          aria-label="Delete Customer"
          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Customer Management</h2>
          <p className="text-xs text-slate-500">
            Registered jewellery retailers, wholesalers, and manufacturers with automated job ID sequencing.
          </p>
        </div>
        <Button variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" /> Add Customer
        </Button>
      </div>

      {/* Main Customers Table / Card View */}
      <DataTable
        data={customers}
        columns={columns}
        renderCard={renderCustomerCard}
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
