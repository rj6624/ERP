import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../../components/common/Modal';
import { calculateBillTotal } from '../../utils/calculations';
import { formatWeight, formatCurrency } from '../../utils/formatters';
import { FileText, Calculator } from 'lucide-react';

interface CreateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultJobId?: string;
}

export const CreateBillModal: React.FC<CreateBillModalProps> = ({
  isOpen,
  onClose,
  defaultJobId,
}) => {
  const { jobs, bills, createBill, navigateToBill } = useERP();

  // Find all unbilled jobs or current job
  const unbilledJobs = jobs.filter((j) => !j.billId || j.id === defaultJobId);

  const [selectedJobId, setSelectedJobId] = useState(defaultJobId || unbilledJobs[0]?.id || '');
  const [pricePerKg, setPricePerKg] = useState('100.00');
  const [billDate, setBillDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState('Standard manufacturing rate per kg applied.');
  const [error, setError] = useState('');

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const inwardWeight = selectedJob?.inwardWeight || 10.250;
  const rateNum = parseFloat(pricePerKg) || 0;
  const totalAmount = calculateBillTotal(inwardWeight, rateNum);
  const nextBillNumber = `BILL-${1025 + bills.length}`;

  useEffect(() => {
    if (defaultJobId) {
      setSelectedJobId(defaultJobId);
    } else if (unbilledJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(unbilledJobs[0].id);
    }
  }, [defaultJobId, unbilledJobs, selectedJobId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) {
      setError('Please select an eligible job.');
      return;
    }
    if (isNaN(rateNum) || rateNum <= 0) {
      setError('Price per KG must be greater than ₹0.');
      return;
    }

    try {
      const newBill = createBill({
        jobId: selectedJob.id,
        pricePerKg: rateNum,
        billDate: new Date(billDate).toISOString(),
        remarks,
      });

      onClose();
      navigateToBill(newBill.id);
    } catch (err: any) {
      setError(err.message || 'Failed to generate bill.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Customer Manufacturing Invoice"
      subtitle={`Formula: Inward Weight (${formatWeight(inwardWeight)}) × Price per KG (Read-Only Total Amount)`}
      maxWidth="lg"
      footer={
        <>
          <button type="button" onClick={onClose} className="erp-btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="erp-btn-brand">
            <FileText className="w-3.5 h-3.5" /> Generate {nextBillNumber}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bill Number (System Generated)
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={nextBillNumber}
              className="erp-input-readonly font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bill Date
            </label>
            <input
              type="date"
              required
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="erp-input text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Job ID / Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="erp-input text-xs font-medium"
            >
              {unbilledJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.id} — {j.customerName} ({formatWeight(j.inwardWeight)} • {j.platingType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={selectedJob?.customerName || '-'}
              className="erp-input-readonly font-bold text-slate-900"
            />
          </div>
        </div>

        {/* Calculation row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inward Weight (kg) <span className="text-slate-400">(Auto)</span>
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={formatWeight(inwardWeight)}
              className="erp-input-readonly font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Price per KG (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              required
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              placeholder="100.00"
              className="erp-input font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Amount (₹) <span className="text-slate-400">(Read-Only)</span>
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={formatCurrency(totalAmount, true)}
              className="erp-input-readonly font-mono font-extrabold text-slate-950 bg-emerald-50 border-emerald-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bill Remarks / Payment Terms
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="erp-input text-xs"
          />
        </div>
      </form>
    </Modal>
  );
};
