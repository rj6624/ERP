import { Button, Input, Select, Textarea } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { LabourRecord, LabourType } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Hammer, UserPlus, Phone, MapPin, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const LabourListPage: React.FC = () => {
  const { labourList, addLabour } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [labourType, setLabourType] = useState<LabourType>('Binding');
  const [defaultChargeRate, setDefaultChargeRate] = useState('15.00');

  const handleAddLabourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addLabour({
      name,
      mobile,
      address,
      labourType,
      status: 'Active',
      defaultChargeRate: parseFloat(defaultChargeRate) || 15.0,
    });
    setName('');
    setMobile('');
    setAddress('');
    setIsAddModalOpen(false);
  };

  const columns: ColumnDef<LabourRecord>[] = [
    {
      header: 'Labour Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.name}</span>
          <p className="text-2xs text-slate-400 font-mono">{row.id}</p>
        </div>
      ),
    },
    {
      header: 'Mobile',
      accessorKey: 'mobile',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-700">{row.mobile}</span>,
    },
    {
      header: 'Labour Type',
      accessorKey: 'labourType',
      sortable: true,
      cell: (row) => (
        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {row.labourType}
        </span>
      ),
    },
    {
      header: 'Default Rate (₹/kg)',
      accessorKey: 'defaultChargeRate',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">
          ₹{row.defaultChargeRate.toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Active Jobs',
      accessorKey: 'activeJobs',
      sortable: true,
      align: 'center',
      cell: (row) => (
        <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs">
          {row.activeJobs}
        </span>
      ),
    },
    {
      header: 'Completed Jobs',
      accessorKey: 'completedJobs',
      sortable: true,
      align: 'center',
      cell: (row) => <span className="font-mono text-emerald-700 font-bold">{row.completedJobs}</span>,
    },
    {
      header: 'Total Charges Paid',
      accessorKey: 'totalCharges',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">
          {formatCurrency(row.totalCharges)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Labour Master & Staff Directory</h2>
          <p className="text-xs text-slate-500">
            Contract workers, binding specialists, and untying operators with default charge rates.
          </p>
        </div>
        <Button variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" /> Add Labour Worker
        </Button>
      </div>

      {/* Labour Table */}
      <DataTable
        data={labourList}
        columns={columns}
        searchPlaceholder="Search labour staff..."
        exportFilename="labour_master"
      />

      {/* Add Labour Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Labour Worker"
        subtitle="Register internal or contract worker for binding/open tasks"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className=""
            >
              Cancel
            </Button>
            <Button variant="primary"
              type="button"
              onClick={handleAddLabourSubmit}
              className=""
            >
              Save Labour Record
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddLabourSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Labour Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 98251 44332"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Labour Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={labourType}
                onChange={(e) => setLabourType(e.target.value as LabourType)}
                className="w-full"
              >
                <option value="Binding">Binding Specialist</option>
                <option value="Open">Open (Untying) Operator</option>
                <option value="Polishing">Polishing Master</option>
                <option value="General">General Plant Labour</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Rate (₹ / kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.50"
                min="0"
                required
                value={defaultChargeRate}
                onChange={(e) => setDefaultChargeRate(e.target.value)}
                placeholder="15.00"
                className="font-mono w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Residential / Colony Address
            </label>
            <Textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Area / Colony, Rajkot"
              className="w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
