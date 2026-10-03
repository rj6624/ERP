import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { triggerPrint } from '../../utils/exportUtils';
import {
  ArrowLeft,
  Printer,
  CreditCard,
  Building,
  User,
  Calendar,
  Briefcase,
  FileCheck,
} from 'lucide-react';
import {
  formatWeight,
  formatCurrency,
  formatDate,
  formatDateTime,
} from '../../utils/formatters';
import { useParams, useNavigate } from 'react-router-dom';

export const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedBillId,
    bills,
    jobs,
    customers,
    payments,
    setCurrentPage,
    navigateToCustomer,
    navigateToJob,
  } = useERP();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const bill = bills.find((b) => b.id.toLowerCase() === id?.toLowerCase() || b.id === selectedBillId) || bills[0];

  if (!bill) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Invoice not found.
      </div>
    );
  }

  const customer = customers.find((c) => c.id === bill.customerId);
  const job = jobs.find((j) => j.id === bill.jobId);
  const billPayments = payments.filter((p) => p.billId === bill.id);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Controls (Hidden on Print) */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setCurrentPage('bills_list')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Bills
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="erp-btn-secondary"
          >
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>

          {bill.pendingAmount > 0 && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="erp-btn-brand"
            >
              <CreditCard className="w-3.5 h-3.5" /> Record Payment
            </button>
          )}
        </div>
      </div>

      {/* Invoice Card / Printable Document */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                P
              </span>
              <span className="font-extrabold text-sm tracking-wider text-slate-900">
                PLATING MANAGEMENT FACTORY
              </span>
            </div>
            <p className="text-2xs text-slate-500 max-w-xs">
              Industrial Silver Jewellery Plating, Rhodium & Gold Finishing Facility. GIDC Industrial Estate, Rajkot, Gujarat.
            </p>
          </div>

          <div className="text-right space-y-1">
            <h1 className="text-lg font-black text-slate-900 font-mono">{bill.billNumber}</h1>
            <p className="text-xs text-slate-500 font-mono">Date: {formatDate(bill.billDate)}</p>
            <div className="pt-1">
              <StatusBadge type="payment" value={bill.paymentStatus} size="md" />
            </div>
          </div>
        </div>

        {/* Customer & Job Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To:
            </span>
            <p className="font-bold text-sm text-slate-900">{bill.customerName}</p>
            {customer && (
              <div className="text-slate-600 mt-1 space-y-0.5 text-[11px]">
                <p>{customer.address}</p>
                <p className="font-mono">Mobile: {customer.mobile}</p>
                <p className="font-mono text-slate-400">Customer ID: {customer.id}</p>
              </div>
            )}
          </div>

          <div className="sm:text-right space-y-1 text-slate-600 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Job Traceability:
            </span>
            <p>
              Job ID:{' '}
              <strong
                onClick={() => job && navigateToJob(job.id)}
                className="font-mono text-slate-900 cursor-pointer underline text-xs"
              >
                {bill.jobId}
              </strong>
            </p>
            {job && (
              <>
                <p>Plating Type: <strong>{job.platingType}</strong></p>
                <p>Inward Received: <strong>{formatDate(job.inwardDate)}</strong></p>
                {job.outwardWeight && (
                  <p>Outward Dispatched: <strong>{formatWeight(job.outwardWeight)}</strong></p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Itemized Manufacturing Charges Table */}
        <div>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <th className="py-2.5 px-3 font-bold text-slate-700">Description / Operation</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Inward Weight</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Rate / KG</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-900 block">
                    Jewellery Plating Processing — {job?.platingType || 'White Gold'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Chemical electroplating bath, binding, quality finish, and verification for Job {bill.jobId}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-medium text-slate-900">
                  {formatWeight(bill.inwardWeight)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-900">
                  ₹{bill.pricePerKg.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(bill.totalAmount, true)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Settlement Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200">
          <div className="space-y-1 text-xs max-w-sm">
            <span className="font-semibold text-slate-700">Payment Terms & Notes:</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {bill.remarks || 'Standard plating charges payable upon delivery or credit terms agreed.'}
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Total Invoice Amount:</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(bill.totalAmount, true)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Amount Received:</span>
              <span className="font-mono font-bold text-emerald-700">
                {formatCurrency(bill.amountPaid, true)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 bg-slate-50 px-2 rounded font-bold">
              <span className="text-slate-900">Pending Balance:</span>
              <span className={`font-mono text-sm ${bill.pendingAmount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatCurrency(bill.pendingAmount, true)}
              </span>
            </div>
          </div>
        </div>

        {/* Recorded Payments History on Invoice */}
        {billPayments.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Payment Receipts Recorded
            </h4>
            <div className="space-y-1">
              {billPayments.map((p) => (
                <div key={p.id} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="font-mono font-semibold text-slate-900">{p.paymentNumber}</span>
                    <span className="text-slate-500 ml-2">({p.paymentMode} • {formatDate(p.paymentDate)})</span>
                    {p.referenceNumber && (
                      <span className="text-2xs text-slate-400 font-mono ml-2">Ref: {p.referenceNumber}</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-emerald-700">
                    {formatCurrency(p.amountReceived, true)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isPaymentModalOpen && (
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          defaultBillId={bill.id}
        />
      )}
    </div>
  );
};
