import { Button, CustomSelect } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { JewelleryJob, PlatingType, JobPriority, JobStatus } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ArrowDownLeft, Plus, Eye, Filter } from 'lucide-react';
import { formatWeight, formatDate, formatDateTime } from '../../utils/formatters';

export const InwardListPage: React.FC = () => {
  const { jobs, customers, setCurrentPage, navigateToJob, navigateToCustomer } = useERP();

  const [filterCustomer, setFilterCustomer] = useState<string>('ALL');
  const [filterPlating, setFilterPlating] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredJobs = jobs.filter((j) => {
    if (filterCustomer !== 'ALL' && j.customerId !== filterCustomer) return false;
    if (filterPlating !== 'ALL' && j.platingType !== filterPlating) return false;
    if (filterPriority !== 'ALL' && j.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && j.status !== filterStatus) return false;
    return true;
  });

  const columns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'ID No (Job ID)',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigateToCustomer(row.customerId);
          }}
          className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
        >
          {row.customerName}
        </span>
      ),
    },
    {
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">
          {formatWeight(row.inwardWeight)}
        </span>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-700">{row.platingType}</span>,
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => <StatusBadge type="priority" value={row.priority} />,
    },
    {
      header: 'Inward Date & Time',
      accessorKey: 'inwardDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600">{formatDateTime(row.inwardDate)}</span>,
    },
    {
      header: 'Job Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="job" value={row.status} />,
    },
    {
      header: 'Outward Status',
      accessorKey: 'status',
      cell: (row) =>
        row.status === 'Outward Completed' ? (
          <span className="text-emerald-700 font-semibold text-2xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Dispatched ({formatWeight(row.outwardWeight)})
          </span>
        ) : (
          <span className="text-amber-700 text-2xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Pending Outward
          </span>
        ),
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <Button variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            navigateToJob(row.id);
          }}
          className="inline-flex items-center gap-1 text-2xs"
          title="View Job Lifecycle"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Customer Inward Receipts</h2>
          <p className="text-xs text-slate-500">
            Intake of unplated silver jewellery with digital scale verification and system-generated IDs.
          </p>
        </div>
        <Button variant="primary"
          onClick={() => setCurrentPage('create_inward')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Create Inward
        </Button>
      </div>

      {/* Inward Table with Filters below Searchbar */}
      <DataTable
        data={filteredJobs}
        columns={columns}
        filters={
          <>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Customer Filter */}
            <CustomSelect
              value={filterCustomer}
              onChange={(val) => setFilterCustomer(typeof val === 'string' ? val : val.target.value)}
            >
              <option value="ALL">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </CustomSelect>

            {/* Plating Type */}
            <CustomSelect
              value={filterPlating}
              onChange={(val) => setFilterPlating(typeof val === 'string' ? val : val.target.value)}
            >
              <option value="ALL">All Plating Types</option>
              <option value="White Gold">White Gold</option>
              <option value="Golden Brass">Golden Brass</option>
              <option value="Golden Silver">Golden Silver</option>
              <option value="Antic Gold">Antic Gold</option>
              <option value="Teen Gold">Teen Gold</option>
              <option value="Rose Gold">Rose Gold</option>
              <option value="Damar Gold">Damar Gold</option>
              <option value="Dal Chhol Gold">Dal Chhol Gold</option>
            </CustomSelect>

            {/* Priority Filter */}
            <CustomSelect
              value={filterPriority}
              onChange={(val) => setFilterPriority(typeof val === 'string' ? val : val.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="Regular">Regular</option>
              <option value="Fast Forward">Fast Forward Only</option>
            </CustomSelect>

            {/* Status Filter */}
            <CustomSelect
              value={filterStatus}
              onChange={(val) => setFilterStatus(typeof val === 'string' ? val : val.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Inward Received">Inward Received</option>
              <option value="In Process">In Process</option>
              <option value="Ready for Outward">Ready for Outward</option>
              <option value="Outward Completed">Outward Completed</option>
            </CustomSelect>

            {(filterCustomer !== 'ALL' ||
              filterPlating !== 'ALL' ||
              filterPriority !== 'ALL' ||
              filterStatus !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterCustomer('ALL');
                  setFilterPlating('ALL');
                  setFilterPriority('ALL');
                  setFilterStatus('ALL');
                }}
                className="erp-toolbar-control hover:underline text-xs text-slate-500 hover:text-slate-800 px-2.5 py-0"
              >
                Reset Filters
              </Button>
            )}
          </>
        }
        onRowClick={(row) => navigateToJob(row.id)}
        searchPlaceholder="Search Inward by Job ID, Customer, Plating..."
        exportFilename="inward_receipts"
      />
    </div>
  );
};
