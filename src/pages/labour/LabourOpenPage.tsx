import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { LabourOpenTask, LabourStatus } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { calculateLabourCharge } from '../../utils/calculations';
import { formatWeight, formatCurrency, formatDateTime } from '../../utils/formatters';
import { Unlock, Plus, Download } from 'lucide-react';
import { exportTableToCSV } from '../../utils/exportUtils';

export const LabourOpenPage: React.FC = () => {
  const {
    labourOpenTasks,
    labourList,
    jobs,
    createLabourOpen,
    navigateToJob,
  } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [selectedLabourId, setSelectedLabourId] = useState(labourList[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [status, setStatus] = useState<LabourStatus>('In Progress');
  const [tarUsed, setTarUsed] = useState('50');
  const [chargeRate, setChargeRate] = useState('12.50');
  const [remarks, setRemarks] = useState('');

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const selectedLabour = labourList.find((l) => l.id === selectedLabourId);

  const weight = selectedJob?.inwardWeight || 10.250;
  const rateNum = parseFloat(chargeRate) || 12.5;
  const totalLabourCharge = calculateLabourCharge(weight, rateNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !selectedLabour) return;

    createLabourOpen({
      jobId: selectedJob.id,
      customerName: selectedJob.customerName,
      labourId: selectedLabour.id,
      labourName: selectedLabour.name,
      weight,
      startDate: new Date(startDate).toISOString(),
      status,
      tarUsed: parseFloat(tarUsed) || 0,
      chargeRate: rateNum,
      remarks,
    });

    setIsAddModalOpen(false);
  };

  const columns: ColumnDef<LabourOpenTask>[] = [
    {
      header: 'Task ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-slate-900">{row.id}</span>,
    },
    {
      header: 'Job ID',
      accessorKey: 'jobId',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigateToJob(row.jobId);
          }}
          className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 hover:text-emerald-700 cursor-pointer"
        >
          {row.jobId}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => <span className="font-semibold text-slate-800">{row.customerName}</span>,
    },
    {
      header: 'Labour Specialist',
      accessorKey: 'labourName',
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-900">{row.labourName}</span>,
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      sortable: true,
      align: 'right',
      cell: (row) => <span className="font-mono">{formatWeight(row.weight)}</span>,
    },
    {
      header: 'Tar Cleaned',
      accessorKey: 'tarUsed',
      sortable: true,
      align: 'right',
      cell: (row) => <span className="font-mono font-semibold text-slate-800">{row.tarUsed} g</span>,
    },
    {
      header: 'Rate (₹/kg)',
      accessorKey: 'chargeRate',
      align: 'right',
      cell: (row) => <span className="font-mono">₹{row.chargeRate.toFixed(2)}</span>,
    },
    {
      header: 'Total Charge',
      accessorKey: 'totalCharge',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">
          {formatCurrency(row.totalCharge, true)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="labour" value={row.status} />,
    },
    {
      header: 'Date & Time',
      accessorKey: 'startDate',
      cell: (row) => <span className="text-slate-600 text-2xs">{formatDateTime(row.startDate)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Labour Open (Untying & Clean) Operations</h2>
          <p className="text-xs text-slate-500">
            Post-plating chain unbinding, tar residue cleaning, and labour remuneration tracking.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="secondary"
            onClick={() => exportTableToCSV('labour_open_tasks', columns, labourOpenTasks)}
            className="flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </Button>
          <Button variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className=""
          >
            <Plus className="w-3.5 h-3.5" /> Create Labour Open Task
          </Button>
        </div>
      </div>

      {/* Open Tasks Table */}
      <DataTable
        data={labourOpenTasks}
        columns={columns}
        searchPlaceholder="Search labour open tasks..."
        exportFilename="labour_open_tasks"
      />

      {/* Create Open Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign Labour Open Task"
        subtitle="Automatic charge calculation: Weight × Labour Charge Rate"
        maxWidth="lg"
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
              onClick={handleSubmit}
              className=""
            >
              Confirm & Assign Open Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Job ID <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.id} — {j.customerName} ({formatWeight(j.inwardWeight)})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Labour Worker <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedLabourId}
                onChange={(e) => setSelectedLabourId(e.target.value)}
                className="w-full"
              >
                {labourList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.labourType})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight (kg) <span className="text-slate-400">(Auto)</span>
              </label>
              <Input
                type="text"
                readOnly
                disabled
                value={formatWeight(weight)}
                className="font-mono w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Labour Rate (₹/kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.50"
                min="0"
                required
                value={chargeRate}
                onChange={(e) => setChargeRate(e.target.value)}
                className="font-mono w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Labour Charge <span className="text-slate-400">(Auto)</span>
              </label>
              <Input
                type="text"
                readOnly
                disabled
                value={formatCurrency(totalLabourCharge, true)}
                className="font-mono w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tar Cleaned (Grams)
              </label>
              <Input
                type="number"
                min="0"
                value={tarUsed}
                onChange={(e) => setTarUsed(e.target.value)}
                placeholder="50"
                className="font-mono w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as LabourStatus)}
                className="w-full"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Date & Time
            </label>
            <Input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks
            </label>
            <Input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Untying completed without scratches"
              className="w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
