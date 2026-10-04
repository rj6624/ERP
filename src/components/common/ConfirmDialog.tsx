import { Button } from '../ui/Primitives';
import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, RotateCcw } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: 'trash' | 'warning' | 'restore';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon = 'warning',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const IconComponent = () => {
    if (icon === 'trash') return <Trash2 className="w-5 h-5 text-red-600" />;
    if (icon === 'restore') return <RotateCcw className="w-5 h-5 text-emerald-600" />;
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} className="">
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="p-2 rounded-full bg-slate-100 shrink-0">
          <IconComponent />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};
