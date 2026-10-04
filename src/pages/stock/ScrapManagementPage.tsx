import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ScrapRecord } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { PackageCheck, Plus, Recycle, Scale } from 'lucide-react';
import { formatWeight, formatDate, formatDateTime } from '../../utils/formatters';

export const ScrapManagementPage: React.FC = () => {
  const { scrapRecords, addScrapRecord, customers } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sourceCustomer, setSourceCustomer] = useState(customers[0]?.name || 'Darshan');
  const [jobId, setJobId] = useState('DARSHAN1');
  const [scrapType, setScrapType] = useState('Filter Sludge & Rinse Dragout');
  const [grossWeight, setGrossWeight] = useState('4.850');
  const [recoverableWeight, setRecoverableWeight] = useState('3.200');
  const [metalType, setMetalType] = useState('Silver');
  const [purity, setPurity] = useState('75.5%');
  const [status, setStatus] = useState<ScrapRecord['status']>('Pending Recovery');
  const [remarks, setRemarks] = useState('');

  const grossNum = parseFloat(grossWeight) || 0;
  const recNum = parseFloat(recoverableWeight) || 0;
  const nonRecNum = Number(Math.max(0, grossNum - recNum).toFixed(3));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grossNum <= 0) return;

    addScrapRecord({
      date: new Date().toISOString(),
      sourceCustomer,
      jobId: jobId || undefined,
      scrapType,
      grossWeight: grossNum,
      recoverableWeight: recNum,
      nonRecoverableWeight: nonRecNum,
      metalType,
      purity,
      status,
      remarks,
    });

    setIsAddModalOpen(false);
  };

  const columns: ColumnDef<ScrapRecord>[] = [
    {
      header: 'Scrap ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-slate-900">{row.id}</span>,
    },
    {
      header: 'Source Customer / Job',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.sourceCustomer}</span>
          {row.jobId && <p className="text-2xs font-mono text-slate-500">{row.jobId}</p>}
        </div>
      ),
    },
    {
      header: 'Scrap Category',
      accessorKey: 'scrapType',
      sortable: true,
      cell: (row) => <span className="text-slate-700 text-xs">{row.scrapType}</span>,
    },
    {
      header: 'Gross Weight',
      accessorKey: 'grossWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">{formatWeight(row.grossWeight)}</span>
      ),
    },
    {
      header: 'Recoverable Weight',
      accessorKey: 'recoverableWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-emerald-700">
          {formatWeight(row.recoverableWeight)}
        </span>
      ),
    },
    {
      header: 'Non-Recoverable',
      accessorKey: 'nonRecoverableWeight',
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-500">{formatWeight(row.nonRecoverableWeight)}</span>
      ),
    },
    {
      header: 'Metal / Purity',
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900">{row.metalType}</span>
          <p className="text-2xs font-mono text-slate-500">{row.purity}</p>
        </div>
      ),
    },
    {
      header: 'Recovery Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        if (row.status === 'Recovered') {
          return (
            <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Recovered
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Pending Recovery
          </span>
        );
      },
    },
    {
      header: 'Date Recorded',
      accessorKey: 'date',
      cell: (row) => <span className="text-slate-600 text-2xs">{formatDate(row.date)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-600" /> Scrap Recovery & Precious Sludge Refining
          </h2>
          <p className="text-xs text-slate-500">
            Filter dragout recovery, buffing lint smelting, and chemical precipitation logs with strict 3-decimal gross weights.
          </p>
        </div>
        <Button variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Record Scrap Batch
        </Button>
      </div>

      <DataTable
        data={scrapRecords}
        columns={columns}
        searchPlaceholder="Search scrap records..."
        exportFilename="scrap_recovery_ledger"
      />

      {/* Record Scrap Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Precious Scrap Batch"
        subtitle="Gross and recoverable metal weights for refinery smelting"
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
              Save Scrap Record
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Customer / Factory Batch
              </label>
              <Select
                value={sourceCustomer}
                onChange={(e) => setSourceCustomer(e.target.value)}
                className="w-full"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job ID (Optional)
              </label>
              <Input
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="e.g. DARSHAN1"
                className="font-mono w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gross Weight (kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.001"
                min="0.001"
                required
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                className="font-mono w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recoverable Weight (kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.001"
                min="0"
                required
                value={recoverableWeight}
                onChange={(e) => setRecoverableWeight(e.target.value)}
                className="font-mono w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Non-Recoverable (kg)
              </label>
              <Input
                type="text"
                readOnly
                disabled
                value={formatWeight(nonRecNum)}
                className="font-mono w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scrap Type
              </label>
              <Select
                value={scrapType}
                onChange={(e) => setScrapType(e.target.value)}
                className="w-full"
              >
                <option value="Filter Sludge & Rinse Dragout">Filter Sludge & Rinse Dragout</option>
                <option value="Polishing Dust / Buffing Lint">Polishing Dust / Buffing Lint</option>
                <option value="Defective Binding Wire & Drops">Defective Binding Wire & Drops</option>
                <option value="Anode Stubs">Anode Stubs</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metal Type
              </label>
              <Input
                type="text"
                value={metalType}
                onChange={(e) => setMetalType(e.target.value)}
                placeholder="Silver, Gold, Copper"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Purity
              </label>
              <Input
                type="text"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder="e.g. 75.5%"
                className="font-mono w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks
            </label>
            <Input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Acid precipitated sludge batch"
              className="w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
