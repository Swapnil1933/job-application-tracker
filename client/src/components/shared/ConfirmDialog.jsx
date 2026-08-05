import { HiExclamation } from 'react-icons/hi';
import Button from './Button';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <HiExclamation className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-surface-600 dark:text-surface-300 mb-6">
          {message || 'Are you sure? This action cannot be undone.'}
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
