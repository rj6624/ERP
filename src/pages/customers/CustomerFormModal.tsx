import React, { useState, useEffect } from 'react';
import { Customer } from '../../types/erp';
import { Modal } from '../../components/common/Modal';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; mobile: string; address: string }) => void;
  initialData?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMobile(initialData.mobile);
      setAddress(initialData.address);
    } else {
      setName('');
      setMobile('');
      setAddress('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!mobile.trim()) {
      setError('Mobile number is required for job tracking alerts.');
      return;
    }
    onSubmit({ name, mobile, address });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Customer Account' : 'Register New Customer Account'}
      subtitle="Job IDs are generated automatically from Customer Name (e.g. DARSHAN1, DARSHAN2)"
      maxWidth="md"
      footer={
        <>
          <button type="button" onClick={onClose} className="erp-btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="erp-btn-primary">
            {initialData ? 'Save Changes' : 'Create Customer'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Darshan, Maganlal, Rajesh Jewellers"
            className="erp-input"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Automatic Job IDs will use this name as the prefix (e.g. {name ? name.toUpperCase().replace(/\s+/g, '') + '1' : 'DARSHAN1'}).
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98250 12345"
            className="erp-input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Workshop / Showroom Address
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Shop / Unit number, Bazaar area, City"
            className="erp-input"
          />
        </div>

        {initialData && (
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-700">System Information (Admin Only):</span>
            <div className="flex justify-between">
              <span>Customer ID:</span>
              <span className="font-mono font-bold text-slate-900">{initialData.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Next Auto Sequence:</span>
              <span className="font-mono text-slate-900">#{initialData.lastIdSeq + 1}</span>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
