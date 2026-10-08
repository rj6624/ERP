import { Button, CustomSelect, Badge } from '../../components/ui/Primitives';
import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { JewelleryJob } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Plus, Eye, Filter, SlidersHorizontal, X, Download } from 'lucide-react';
import { formatWeight, formatDateTime } from '../../utils/formatters';
import { exportTableToCSV } from '../../utils/exportUtils';
import { FilterBottomSheet } from '../../components/common/FilterBottomSheet';

export const InwardListPage: React.FC = () => {
  const { jobs, customers, setCurrentPage, navigateToJob, navigateToCustomer } = useERP();

  const [filterCustomer, setFilterCustomer] = useState<string>('ALL');
  const [filterPlating, setFilterPlating] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((j) => {
      if (filterCustomer !== 'ALL' && j.customerId !== filterCustomer) return false;
      if (filterPlating !== 'ALL' && j.platingType !== filterPlating) return false;
      if (filterPriority !== 'ALL' && j.priority !== filterPriority) return false;
      if (filterStatus !== 'ALL' && j.status !== filterStatus) return false;
      return true;
    });

    if (sortBy === 'oldest') {
      result = [...result].sort(
        (a, b) => new Date(a.inwardDate).getTime() - new Date(b.inwardDate).getTime()
      );
    } else if (sortBy === 'weight_desc') {
      result = [...result].sort((a, b) => b.inwardWeight - a.inwardWeight);
    } else if (sortBy === 'weight_asc') {
      result = [...result].sort((a, b) => a.inwardWeight - b.inwardWeight);
    } else if (sortBy === 'customer_asc') {
      result = [...result].sort((a, b) => a.customerName.localeCompare(b.customerName));
    } else if (sortBy === 'id_desc') {
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // Default: newest
      result = [...result].sort(
        (a, b) => new Date(b.inwardDate).getTime() - new Date(a.inwardDate).getTime()
      );
    }

    return result;
  }, [jobs, filterCustomer, filterPlating, filterPriority, filterStatus, sortBy]);

  const activeFilterCount =
    (filterCustomer !== 'ALL' ? 1 : 0) +
    (filterPlating !== 'ALL' ? 1 : 0) +
    (filterPriority !== 'ALL' ? 1 : 0) +
    (filterStatus !== 'ALL' ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0);

  const customerObj = customers.find((c) => c.id === filterCustomer);
  const customerName = customerObj ? customerObj.name : filterCustomer;

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
          <Badge tone="success" size="sm">
            Dispatched ({formatWeight(row.outwardWeight)})
          </Badge>
        ) : (
          <Badge tone="warning" size="sm">
            Pending Outward
          </Badge>
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
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="secondary"
            onClick={() => exportTableToCSV('inward_receipts', columns, filteredJobs)}
            className="inline-flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setCurrentPage('create_inward')}
          >
            <Plus className="w-3.5 h-3.5" /> Create Inward
          </Button>
        </div>
      </div>

      {/* Inward Table with Filters below Searchbar */}
      <DataTable
        data={filteredJobs}
        columns={columns}
        filters={
          <div className="w-full space-y-2">
            {/* Mobile Filter Bar (< md): Clean single row with Filter button and active chips */}
            <div className="md:hidden flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar w-full">
              <Button
                variant={activeFilterCount > 0 ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIsFilterSheetOpen(true)}
                className="erp-toolbar-control shrink-0 inline-flex items-center gap-1.5 px-3 font-semibold text-xs rounded-xl"
                title="Open Filters Sheet"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Applied Active Chips for fast single-tap dismissal on mobile */}
              {filterCustomer !== 'ALL' && (
                <Button
                  variant="surface"
                  size="sm"
                  onClick={() => setFilterCustomer('ALL')}
                  className="erp-toolbar-control shrink-0 inline-flex items-center gap-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200"
                  title="Remove Customer filter"
                >
                  <span className="truncate max-w-[100px]">{customerName}</span>
                  <X className="w-3 h-3 text-slate-500" />
                </Button>
              )}

              {filterPlating !== 'ALL' && (
                <Button
                  variant="surface"
                  size="sm"
                  onClick={() => setFilterPlating('ALL')}
                  className="erp-toolbar-control shrink-0 inline-flex items-center gap-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200"
                  title="Remove Plating filter"
                >
                  <span>{filterPlating}</span>
                  <X className="w-3 h-3 text-slate-500" />
                </Button>
              )}

              {filterPriority !== 'ALL' && (
                <Button
                  variant="surface"
                  size="sm"
                  onClick={() => setFilterPriority('ALL')}
                  className="erp-toolbar-control shrink-0 inline-flex items-center gap-1 px-2.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200"
                  title="Remove Priority filter"
                >
                  <span>{filterPriority}</span>
                  <X className="w-3 h-3 text-amber-600" />
                </Button>
              )}

              {filterStatus !== 'ALL' && (
                <Button
                  variant="surface"
                  size="sm"
                  onClick={() => setFilterStatus('ALL')}
                  className="erp-toolbar-control shrink-0 inline-flex items-center gap-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200"
                  title="Remove Status filter"
                >
                  <span>{filterStatus}</span>
                  <X className="w-3 h-3 text-slate-500" />
                </Button>
              )}

              {sortBy !== 'newest' && (
                <Button
                  variant="surface"
                  size="sm"
                  onClick={() => setSortBy('newest')}
                  className="erp-toolbar-control shrink-0 inline-flex items-center gap-1 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200"
                  title="Reset sort order"
                >
                  <span>Sorted</span>
                  <X className="w-3 h-3 text-slate-500" />
                </Button>
              )}

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterCustomer('ALL');
                    setFilterPlating('ALL');
                    setFilterPriority('ALL');
                    setFilterStatus('ALL');
                    setSortBy('newest');
                  }}
                  className="shrink-0 text-xs text-rose-600 hover:text-rose-700 px-2 py-1 font-semibold"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Desktop Filter Row (>= md): Full inline controls + Advanced Filters Sheet trigger */}
            <div className="hidden md:flex flex-wrap items-center gap-2 text-xs">
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

              {/* More Filters Sheet Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFilterSheetOpen(true)}
                className="erp-toolbar-control inline-flex items-center gap-1.5 px-3 text-xs shrink-0 py-0"
                title="Open comprehensive filters sheet"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                <span>All Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#081c05] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterCustomer('ALL');
                    setFilterPlating('ALL');
                    setFilterPriority('ALL');
                    setFilterStatus('ALL');
                    setSortBy('newest');
                  }}
                  className="erp-toolbar-control hover:underline text-xs text-rose-600 hover:text-rose-700 px-2.5 py-0"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        }
        onRowClick={(row) => navigateToJob(row.id)}
        searchPlaceholder="Search Inward by Job ID, Customer, Plating..."
        exportFilename="inward_receipts"
      />

      {/* Mobile-first Bottom Sheet Filter Modal */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filterCustomer={filterCustomer}
        setFilterCustomer={setFilterCustomer}
        filterPlating={filterPlating}
        setFilterPlating={setFilterPlating}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        customers={customers}
        jobs={jobs}
      />
    </div>
  );
};
