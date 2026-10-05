import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { AcidItem } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Flame, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AcidStockPage: React.FC = () => {
  const { acids, updateAcidStock } = useERP();

  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedAcidId, setSelectedAcidId] = useState(acids[0]?.id || '');
  const [quantity, setQuantity] = useState('2.0');

  const selectedAcid = acids.find((a) => a.id === selectedAcidId);

  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedAcid || isNaN(qty) || qty <= 0) return;
    updateAcidStock(selectedAcid.id, qty, 'Stock In');
    setIsStockInModalOpen(false);
  };

  const handleUsageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedAcid || isNaN(qty) || qty <= 0) return;
    updateAcidStock(selectedAcid.id, qty, 'Usage');
    setIsUsageModalOpen(false);
  };

  const columns: ColumnDef<AcidItem>[] = [
    {
      header: 'Acid Name',
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
      header: 'Rate per Unit',
      accessorKey: 'rate',
      sortable: true,
      align: 'right',
      cell: (row) => <span className="font-mono font-semibold">{formatCurrency(row.rate)}</span>,
    },
    {
      header: 'Supplier',
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
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedAcidId(row.id);
              setIsStockInModalOpen(true);
            }}
            className="!min-h-[28px] h-7 px-3 text-xs font-semibold shadow-2xs cursor-pointer"
            title="Stock In"
          >
            In
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedAcidId(row.id);
              setIsUsageModalOpen(true);
            }}
            className="!min-h-[28px] h-7 px-3 text-xs font-semibold shadow-2xs cursor-pointer"
            title="Record Usage"
          >
            Use
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
          <h2 className="text-sm font-bold text-slate-900">Acid Stock & Pickling Inventory</h2>
          <p className="text-xs text-slate-500">
            Nitric, Sulphuric, and Hydrochloric acid carboys with stock alerts and consumption logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary"
            onClick={() => setIsStockInModalOpen(true)}
            className=""
          >
            <ArrowDown className="w-3.5 h-3.5" /> Record Acid In
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
        data={acids}
        columns={columns}
        searchPlaceholder="Search acid inventory..."
        exportFilename="acid_stock"
      />

      {/* Stock In Modal */}
      <Modal
        isOpen={isStockInModalOpen}
        onClose={() => setIsStockInModalOpen(false)}
        title="Record Acid Stock In"
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
              Select Acid
            </label>
            <Select
              value={selectedAcidId}
              onChange={(e) => setSelectedAcidId(e.target.value)}
              className="w-full"
            >
              {acids.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (Current: {a.currentStock.toFixed(2)} {a.unit})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Carboys / Quantity Received
            </label>
            <Input
              type="number"
              step="1"
              min="1"
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
        title="Record Acid Consumption / Tank Cleaning"
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
              Confirm Usage
            </Button>
          </>
        }
      >
        <form onSubmit={handleUsageSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Acid
            </label>
            <Select
              value={selectedAcidId}
              onChange={(e) => setSelectedAcidId(e.target.value)}
              className="w-full"
            >
              {acids.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (Current: {a.currentStock.toFixed(2)} {a.unit})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Carboys / Quantity Consumed
            </label>
            <Input
              type="number"
              step="1"
              min="1"
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
