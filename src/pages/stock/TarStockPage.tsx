import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { TarTransaction } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Box, Plus, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { formatWeight, formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const TarStockPage: React.FC = () => {
  const { tarTransactions, currentTarStock, addTarTransaction, labourList } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [type, setType] = useState<'Purchase' | 'Usage' | 'Adjustment'>('Purchase');
  const [quantity, setQuantity] = useState('10.000');
  const [labourName, setLabourName] = useState('');
  const [jobId, setJobId] = useState('');
  const [rate, setRate] = useState('320.00');
  const [remarks, setRemarks] = useState('');

  const qtyNum = parseFloat(quantity) || 0;
  const rateNum = parseFloat(rate) || 0;
  const totalAmount = Number((qtyNum * rateNum).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(qtyNum) || qtyNum === 0) return;

    addTarTransaction({
      date: new Date().toISOString(),
      type,
      quantity: type === 'Usage' ? -Math.abs(qtyNum) : qtyNum,
      unit: 'Kg',
      labourName: labourName || undefined,
      jobId: jobId || undefined,
      rate: rateNum,
      totalAmount,
      remarks,
    });

    setIsAddModalOpen(false);
    setQuantity('10.000');
    setRemarks('');
  };

  const columns: ColumnDef<TarTransaction>[] = [
    {
      header: 'Transaction ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-slate-900">{row.id}</span>,
    },
    {
      header: 'Date & Time',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{formatDateTime(row.date)}</span>,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      cell: (row) => {
        if (row.type === 'Purchase') {
          return (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> Purchase (In)
            </span>
          );
        }
        if (row.type === 'Usage') {
          return (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              <TrendingDown className="w-3 h-3" /> Labour Usage
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <RefreshCw className="w-3 h-3" /> Adjustment
          </span>
        );
      },
    },
    {
      header: 'Quantity (kg)',
      accessorKey: 'quantity',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span
          className={`font-mono font-bold ${
            row.type === 'Purchase'
              ? 'text-emerald-700'
              : row.type === 'Usage'
              ? 'text-blue-700'
              : 'text-amber-700'
          }`}
        >
          {row.quantity > 0 ? `+${formatWeight(row.quantity)}` : formatWeight(row.quantity)}
        </span>
      ),
    },
    {
      header: 'Labour / Job Ref',
      cell: (row) => (
        <div className="text-xs">
          <span className="font-medium text-slate-900">{row.labourName || '-'}</span>
          {row.jobId && <span className="font-mono text-slate-500 ml-1">({row.jobId})</span>}
        </div>
      ),
    },
    {
      header: 'Rate (₹/kg)',
      accessorKey: 'rate',
      align: 'right',
      cell: (row) => <span className="font-mono">₹{row.rate.toFixed(2)}</span>,
    },
    {
      header: 'Total Value',
      accessorKey: 'totalAmount',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">
          {formatCurrency(Math.abs(row.totalAmount))}
        </span>
      ),
    },
    {
      header: 'Remarks',
      accessorKey: 'remarks',
      cell: (row) => <span className="text-slate-500 text-2xs italic truncate">{row.remarks}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Prominent Current Stock Summary Card */}
      <div className="erp-light-panel bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-white">
              Tar Stock & Melting Inventory
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Formula: Opening Stock + Stock In (Purchase) − Labour Usage ± Adjustments
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right p-2.5 rounded bg-slate-800 border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Tar Stock</span>
            <span className="font-mono text-xl font-extrabold text-amber-400">
              {formatWeight(currentTarStock)}
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="erp-btn-brand"
          >
            <Plus className="w-3.5 h-3.5" /> Record Transaction
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable
        data={tarTransactions}
        columns={columns}
        searchPlaceholder="Search tar transactions..."
        exportFilename="tar_stock_ledger"
      />

      {/* Record Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Tar Stock Transaction"
        subtitle="Purchase replenishment, direct workshop usage, or melting pot adjustments"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="erp-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="erp-btn-primary"
            >
              Save Tar Transaction
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="erp-input"
            >
              <option value="Purchase">Purchase (Stock In)</option>
              <option value="Usage">Direct Factory Usage (Stock Out)</option>
              <option value="Adjustment">Residue Adjustment (±)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="erp-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rate (₹ / kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                required
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="erp-input font-mono"
              />
            </div>
          </div>

          {type === 'Usage' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Labour Worker
                </label>
                <select
                  value={labourName}
                  onChange={(e) => setLabourName(e.target.value)}
                  className="erp-input"
                >
                  <option value="">Select Worker</option>
                  {labourList.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job ID Reference
                </label>
                <input
                  type="text"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="e.g. DARSHAN4"
                  className="erp-input font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks / Supplier / Batch Notes
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Bulk drum batch purchase"
              className="erp-input"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
