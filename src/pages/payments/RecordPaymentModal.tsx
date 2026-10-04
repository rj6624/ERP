import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { PaymentMode } from '../../types/erp';
import { Modal } from '../../components/common/Modal';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/formatters';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBillId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultBillId,
}) => {
  const { bills, payments, recordPayment } = useERP();

  // Filter bills with pending balance or matching default
  const pendingBills = bills.filter((b) => b.pendingAmount > 0 || b.id === defaultBillId);

  const [selectedBillId, setSelectedBillId] = useState(defaultBillId || pendingBills[0]?.id || '');
  const [amountReceived, setAmountReceived] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('NEFT-REF-');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [promiseDate, setPromiseDate] = useState('');
  const [remarks, setRemarks] = useState('Payment received and verified by Admin.');
  const [error, setError] = useState('');

  const selectedBill = bills.find((b) => b.id === selectedBillId);
  const nextPaymentNumber = `PAY-${String(payments.length + 42).padStart(4, '0')}`;

  useEffect(() => {
    if (defaultBillId) {
      setSelectedBillId(defaultBillId);
      const b = bills.find((item) => item.id === defaultBillId);
      if (b) {
        setAmountReceived(b.pendingAmount.toString());
      }
    } else if (pendingBills.length > 0 && !selectedBillId) {
      setSelectedBillId(pendingBills[0].id);
      setAmountReceived(pendingBills[0].pendingAmount.toString());
    }
  }, [defaultBillId, pendingBills, selectedBillId, bills]);

  useEffect(() => {
    if (selectedBill) {
      setAmountReceived(selectedBill.pendingAmount.toString());
    }
  }, [selectedBillId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountReceived);
    if (!selectedBill) {
      setError('Please select a valid bill.');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setError('Payment amount must be greater than ₹0.');
      return;
    }
    if (amt > selectedBill.pendingAmount) {
      setError(`Amount cannot exceed pending balance of ${formatCurrency(selectedBill.pendingAmount, true)}.`);
      return;
    }

    try {
      recordPayment({
        billId: selectedBill.id,
        amountReceived: amt,
        paymentMode,
        referenceNumber,
        paymentDate: new Date(paymentDate).toISOString(),
        promiseDate: promiseDate || undefined,
        remarks,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record payment.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment Receipt (Admin Only)"
      subtitle="Record settlement against customer manufacturing bills with mode & reference tracking"
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose} className="">
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit} className="">
            <CreditCard className="w-3.5 h-3.5" /> Save Payment {nextPaymentNumber}
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

        <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Admin Financial Authority Active
          </span>
          <span className="font-mono font-bold">{nextPaymentNumber}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Bill / Customer <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedBillId}
              onChange={(e) => setSelectedBillId(e.target.value)}
              className="w-full"
            >
              {pendingBills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.billNumber} — {b.customerName} (Bal: {formatCurrency(b.pendingAmount, true)})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {selectedBill && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-500 text-[11px]">Total Bill:</span>
              <p className="font-mono font-bold text-slate-900">{formatCurrency(selectedBill.totalAmount, true)}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Already Received:</span>
              <p className="font-mono font-bold text-emerald-700">{formatCurrency(selectedBill.amountPaid, true)}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Current Pending:</span>
              <p className="font-mono font-bold text-red-600">{formatCurrency(selectedBill.pendingAmount, true)}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount Received (₹) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="1"
              required
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <Select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              className="w-full"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="Cash">Cash (Factory Counter)</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reference No / UTR / Cheque No
            </label>
            <Input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. HDFC-NEFT-994821 / CHQ #441209"
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Promise Date for Remaining Balance (If Part Payment)
            </label>
            <Input
              type="date"
              value={promiseDate}
              onChange={(e) => setPromiseDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Payment Remarks
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
  );
};
