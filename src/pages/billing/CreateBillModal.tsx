import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../../components/common/Modal';
import { SuccessModal } from '../../components/common/SuccessModal';
import { calculateBillTotal } from '../../utils/calculations';
import { formatWeight, formatCurrency } from '../../utils/formatters';
import { FileText, Calculator, Eye, CreditCard } from 'lucide-react';
import { Bill } from '../../types/erp';

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
  const [createdBillSuccess, setCreatedBillSuccess] = useState<Bill | null>(null);

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

      setCreatedBillSuccess(newBill);
    } catch (err: any) {
      setError(err.message || 'Failed to generate bill.');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !createdBillSuccess}
      onClose={onClose}
      title="Generate Customer Manufacturing Invoice"
      subtitle={`Formula: Inward Weight (${formatWeight(inwardWeight)}) × Price per KG (Read-Only Total Amount)`}
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose} className="">
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit} className="">
            <FileText className="w-3.5 h-3.5" /> Generate {nextBillNumber}
          </Button>
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
            <Input
              type="text"
              readOnly
              disabled
              value={nextBillNumber}
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bill Date
            </label>
            <Input
              type="date"
              required
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Job ID / Customer <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full"
            >
              {unbilledJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.id} — {j.customerName} ({formatWeight(j.inwardWeight)} • {j.platingType})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name
            </label>
            <Input
              type="text"
              readOnly
              disabled
              value={selectedJob?.customerName || '-'}
              className="w-full"
            />
          </div>
        </div>

        {/* Calculation row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inward Weight (kg) <span className="text-slate-400">(Auto)</span>
            </label>
            <Input
              type="text"
              readOnly
              disabled
              value={formatWeight(inwardWeight)}
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Price per KG (₹) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="1"
              min="1"
              required
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              placeholder="100.00"
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Amount (₹) <span className="text-slate-400">(Read-Only)</span>
            </label>
            <Input
              type="text"
              readOnly
              disabled
              value={formatCurrency(totalAmount, true)}
              className="font-mono font-extrabold w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bill Remarks / Payment Terms
          </label>
          <Input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full"
          />
        </div>
      </form>
    </Modal>

    {/* Success Modal Pop-up */}
    {createdBillSuccess && (
      <SuccessModal
        isOpen={!!createdBillSuccess}
        onClose={() => {
          const bId = createdBillSuccess.id;
          setCreatedBillSuccess(null);
          onClose();
          navigateToBill(bId);
        }}
        title="Manufacturing Invoice Generated Successfully!"
        greeting={`📄 Invoice ${createdBillSuccess.billNumber} created for ${createdBillSuccess.customerName}!`}
        message="Billing record generated from verified inward weight and unit price. Ready for dispatch and payment."
        details={[
          {
            label: 'Bill Number',
            value: createdBillSuccess.billNumber,
            isMono: true,
            isHighlight: true,
          },
          {
            label: 'Customer',
            value: createdBillSuccess.customerName,
            isHighlight: true,
          },
          {
            label: 'Total Bill Amount',
            value: formatCurrency(createdBillSuccess.totalAmount, true),
            isMono: true,
            isHighlight: true,
            badge: { text: 'Receivable Due', variant: 'warning' },
          },
          {
            label: 'Inward Weight Rate',
            value: `${formatWeight(createdBillSuccess.inwardWeight)} × ₹${createdBillSuccess.pricePerKg}/kg`,
            isMono: true,
          },
          {
            label: 'Linked Job ID',
            value: createdBillSuccess.jobId,
            isMono: true,
          },
        ]}
        primaryAction={{
          label: 'View Invoice Details',
          icon: <Eye className="w-3.5 h-3.5" />,
          onClick: () => {
            const bId = createdBillSuccess.id;
            setCreatedBillSuccess(null);
            onClose();
            navigateToBill(bId);
          },
        }}
        dismissText="Done"
      />
    )}
    </>
  );
};
