import { Button, Input, Select } from '../../components/ui/Primitives';
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
          <Button variant="ghost"
            onClick={() => {
              setSelectedMetalId(row.id);
              setIsStockInModalOpen(true);
            }}
            className="text-2xs flex items-center gap-0.5"
          >
            <ArrowDown className="w-3 h-3" /> +In
          </Button>
          <Button variant="ghost"
            onClick={() => {
              setSelectedMetalId(row.id);
              setIsUsageModalOpen(true);
            }}
            className="text-2xs flex items-center gap-0.5"
          >
            <ArrowUp className="w-3 h-3" /> -Use
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Precious Metal Inventory & Anodes
          </h2>
          <p className="text-xs text-slate-500">
            Pure Silver granules (99.99%), Fine Gold 24K ingots, and Copper plating anodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary"
            onClick={() => setIsStockInModalOpen(true)}
            className=""
          >
            <ArrowDown className="w-3.5 h-3.5" /> Record Metal In
          </Button>
          <Button variant="secondary"
            onClick={() => setIsUsageModalOpen(true)}
            className=""
          >
            <ArrowUp className="w-3.5 h-3.5" /> Record Usage
          </Button>
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
            <Button variant="secondary"
              type="button"
              onClick={() => setIsStockInModalOpen(false)}
              className=""
            >
              Cancel
            </Button>
            <Button variant="primary"
              type="button"
              onClick={handleStockInSubmit}
              className=""
            >
              Confirm Stock In
            </Button>
          </>
        }
      >
        <form onSubmit={handleStockInSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Metal
            </label>
            <Select
              value={selectedMetalId}
              onChange={(e) => setSelectedMetalId(e.target.value)}
              className="w-full"
            >
              {metals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.purity} • Current: {m.currentStock.toFixed(3)} {m.unit})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weight Received (3 Decimal Places)
            </label>
            <Input
              type="number"
              step="0.001"
              min="0.001"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="font-mono w-full"
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
            <Button variant="secondary"
              type="button"
              onClick={() => setIsUsageModalOpen(false)}
              className=""
            >
              Cancel
            </Button>
            <Button variant="primary"
              type="button"
              onClick={handleUsageSubmit}
              className=""
            >
              Confirm Metal Usage
            </Button>
          </>
        }
      >
        <form onSubmit={handleUsageSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Metal
            </label>
            <Select
              value={selectedMetalId}
              onChange={(e) => setSelectedMetalId(e.target.value)}
              className="w-full"
            >
              {metals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.purity} • Current: {m.currentStock.toFixed(3)} {m.unit})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weight Consumed (3 Decimals)
            </label>
            <Input
              type="number"
              step="0.001"
              min="0.001"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="font-mono w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
