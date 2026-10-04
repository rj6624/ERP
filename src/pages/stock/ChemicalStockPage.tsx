import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ChemicalItem } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FlaskConical, Plus, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const ChemicalStockPage: React.FC = () => {
  const { chemicals, updateChemicalStock } = useERP();

  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedChemicalId, setSelectedChemicalId] = useState(chemicals[0]?.id || '');
  const [quantity, setQuantity] = useState('5.0');
  const [notes, setNotes] = useState('');

  const selectedChem = chemicals.find((c) => c.id === selectedChemicalId);

  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedChem || isNaN(qty) || qty <= 0) return;
    updateChemicalStock(selectedChem.id, qty, 'Stock In');
    setIsStockInModalOpen(false);
    setQuantity('5.0');
  };

  const handleUsageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedChem || isNaN(qty) || qty <= 0) return;
    updateChemicalStock(selectedChem.id, qty, 'Usage');
    setIsUsageModalOpen(false);
    setQuantity('5.0');
  };

  const lowStockCount = chemicals.filter((c) => c.status === 'Low Stock' || c.status === 'Out of Stock').length;

  const columns: ColumnDef<ChemicalItem>[] = [
    {
      header: 'Chemical Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.name}</span>
          <p className="text-2xs text-slate-400 font-mono">{row.id} • {row.brand}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{row.category}</span>,
    },
    {
      header: 'Current Stock',
      accessorKey: 'currentStock',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span
          className={`font-mono font-bold text-sm ${
            row.currentStock <= row.minimumStock ? 'text-amber-700' : 'text-slate-900'
          }`}
        >
          {row.currentStock.toFixed(2)} {row.unit}
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
          {row.minimumStock.toFixed(2)} {row.unit}
        </span>
      ),
    },
    {
      header: 'Opening Stock',
      accessorKey: 'openingStock',
      align: 'right',
      cell: (row) => <span className="font-mono text-slate-500">{row.openingStock.toFixed(2)}</span>,
    },
    {
      header: 'Unit Rate (₹)',
      accessorKey: 'rate',
      sortable: true,
      align: 'right',
      cell: (row) => <span className="font-mono font-semibold">{formatCurrency(row.rate)}</span>,
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier',
      cell: (row) => <span className="text-slate-600 text-xs truncate">{row.supplier}</span>,
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
              setSelectedChemicalId(row.id);
              setIsStockInModalOpen(true);
            }}
            className="text-2xs flex items-center gap-0.5"
            title="Stock In"
          >
            <ArrowDown className="w-3 h-3" /> +In
          </Button>
          <Button variant="ghost"
            onClick={() => {
              setSelectedChemicalId(row.id);
              setIsUsageModalOpen(true);
            }}
            className="text-2xs flex items-center gap-0.5"
            title="Record Usage"
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
            <FlaskConical className="w-4 h-4 text-purple-600" /> Chemical Baths & Salt Inventory
          </h2>
          <p className="text-xs text-slate-500">
            Precious metal solutions, flash plating salts, brighteners, and anti-tarnish chemicals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary"
            onClick={() => setIsStockInModalOpen(true)}
            className=""
          >
            <ArrowDown className="w-3.5 h-3.5" /> Record Stock In
          </Button>
          <Button variant="secondary"
            onClick={() => setIsUsageModalOpen(true)}
            className=""
          >
            <ArrowUp className="w-3.5 h-3.5" /> Record Usage
          </Button>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>{lowStockCount} chemical items</strong> are currently below minimum re-order threshold (e.g. Gold Solution 24K, Silver Brightener). Requisition recommended.
          </span>
        </div>
      )}

      {/* Chemicals Table */}
      <DataTable
        data={chemicals}
        columns={columns}
        searchPlaceholder="Search chemicals, brands, suppliers..."
        exportFilename="chemicals_inventory"
      />

      {/* Stock In Modal */}
      <Modal
        isOpen={isStockInModalOpen}
        onClose={() => setIsStockInModalOpen(false)}
        title="Record Chemical Stock In (Purchase / Refill)"
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
              Select Chemical <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedChemicalId}
              onChange={(e) => setSelectedChemicalId(e.target.value)}
              className="w-full"
            >
              {chemicals.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Current: {c.currentStock.toFixed(2)} {c.unit})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity Received <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purchase Reference / Supplier Invoice Notes
            </label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Batch ref #U-9948 / Delivery challan"
              className="w-full"
            />
          </div>
        </form>
      </Modal>

      {/* Usage Modal */}
      <Modal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        title="Record Chemical Consumption / Bath Replenishment"
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
              Confirm Usage Deduction
            </Button>
          </>
        }
      >
        <form onSubmit={handleUsageSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Chemical <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedChemicalId}
              onChange={(e) => setSelectedChemicalId(e.target.value)}
              className="w-full"
            >
              {chemicals.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Current: {c.currentStock.toFixed(2)} {c.unit})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity Consumed <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bath / Tank Reference / Purpose
            </label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tank 02 weekly top-up"
              className="w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
