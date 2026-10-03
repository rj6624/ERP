import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { MetalItem } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ShieldCheck, ArrowDown, ArrowUp } from 'lucide-react';
import { formatWeight, formatCurrency } from '../../utils/formatters';

export const MetalStockPage: React.FC = () => {
  const { metals, updateMetalStock } = useERP();

  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedMetalId, setSelectedMetalId] = useState(metals[0]?.id || '');
  const [quantity, setQuantity] = useState('5.000');

  const selectedMetal = metals.find((m) => m.id === selectedMetalId);

  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedMetal || isNaN(qty) || qty <= 0) return;
    updateMetalStock(selectedMetal.id, qty, 'Stock In');
    setIsStockInModalOpen(false);
  };

  const handleUsageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedMetal || isNaN(qty) || qty <= 0) return;
    updateMetalStock(selectedMetal.id, qty, 'Usage');
    setIsUsageModalOpen(false);
  };

  const columns: ColumnDef<MetalItem>[] = [
    {
      header: 'Precious Metal / Anode',
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
      header: 'Certified Purity',
      accessorKey: 'purity',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {row.purity}
        </span>
      ),
    },
    {
      header: 'Current Stock',
      accessorKey: 'currentStock',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {row.currentStock.toFixed(3)} {row.unit}
        </span>
      ),
    },
    {
      header: 'Min Threshold',
      accessorKey: 'minimumStock',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-500">
          {row.minimumStock.toFixed(3)} {row.unit}
        </span>
      ),
    },
    {
      header: 'Opening Stock',
      accessorKey: 'openingStock',
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-500">
          {row.openingStock.toFixed(3)} {row.unit}
        </span>
      ),
    },
    {
      header: 'Rate (₹ / Unit)',
      accessorKey: 'rate',
      sortable: true,
      align: 'right',
      cell: (row) => <span className="font-mono font-semibold">{formatCurrency(row.rate)}</span>,
    },
    {
      header: 'Supplier Refinery',
      accessorKey: 'supplier',
      cell: (row) => <span className="text-slate-600 text-xs">{row.supplier}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="stock" value={row.status} />,
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setSelectedMetalId(row.id);
              setIsStockInModalOpen(true);
            }}
            className="p-1 rounded text-emerald-700 hover:bg-emerald-50 text-2xs font-semibold flex items-center gap-0.5 border border-emerald-200"
          >
            <ArrowDown className="w-3 h-3" /> +In
          </button>
          <button
            onClick={() => {
              setSelectedMetalId(row.id);
              setIsUsageModalOpen(true);
            }}
            className="p-1 rounded text-amber-700 hover:bg-amber-50 text-2xs font-semibold flex items-center gap-0.5 border border-amber-200"
          >
            <ArrowUp className="w-3 h-3" /> -Use
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Precious Metal Inventory & Anodes
          </h2>
          <p className="text-xs text-slate-500">
            Pure Silver granules (99.99%), Fine Gold 24K ingots, and Copper plating anodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="erp-btn-brand bg-emerald-700 hover:bg-emerald-800"
          >
            <ArrowDown className="w-3.5 h-3.5" /> Record Metal In
          </button>
          <button
            onClick={() => setIsUsageModalOpen(true)}
            className="erp-btn-secondary"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Record Usage
          </button>
        </div>
      </div>

      <DataTable
        data={metals}
        columns={columns}
        searchPlaceholder="Search metals..."
        exportFilename="metal_inventory"
      />

      {/* Stock In Modal */}
      <Modal
        isOpen={isStockInModalOpen}
        onClose={() => setIsStockInModalOpen(false)}
        title="Record Precious Metal Stock In (Refinery Delivery)"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsStockInModalOpen(false)}
              className="erp-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStockInSubmit}
              className="erp-btn-brand"
            >
              Confirm Stock In
            </button>
          </>
        }
      >
        <form onSubmit={handleStockInSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Metal
            </label>
            <select
              value={selectedMetalId}
              onChange={(e) => setSelectedMetalId(e.target.value)}
              className="erp-input"
            >
              {metals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.purity} • Current: {m.currentStock.toFixed(3)} {m.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weight Received (3 Decimal Places)
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="erp-input font-mono"
            />
          </div>
        </form>
      </Modal>

      {/* Usage Modal */}
      <Modal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        title="Record Metal Consumption / Anode Dissolution"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsUsageModalOpen(false)}
              className="erp-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUsageSubmit}
              className="erp-btn-primary"
            >
              Confirm Metal Usage
            </button>
          </>
        }
      >
        <form onSubmit={handleUsageSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Metal
            </label>
            <select
              value={selectedMetalId}
              onChange={(e) => setSelectedMetalId(e.target.value)}
              className="erp-input"
            >
              {metals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.purity} • Current: {m.currentStock.toFixed(3)} {m.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weight Consumed (3 Decimals)
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="erp-input font-mono"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
