import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-w-sm w-full p-6 shadow-2xl transition-colors">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="text-red-600 dark:text-red-500" /> Reset Portfolio?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">This will delete all portfolios and coins permanently.</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
          >
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;