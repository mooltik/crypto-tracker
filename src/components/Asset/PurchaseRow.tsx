import React from 'react';
import { Trash2 } from 'lucide-react';
import { Purchase } from '../../types';

interface PurchaseRowProps {
  purchase: Purchase;
  index: number;
  currencySymbol: string;
  onUpdate: (id: number | string, field: keyof Purchase, value: string) => void;
  onRemove: (id: number | string) => void;
}

const PurchaseRow: React.FC<PurchaseRowProps> = ({ purchase, index, currencySymbol, onUpdate, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <div className="hidden md:block col-span-1 text-center text-slate-400 dark:text-slate-500 font-mono text-sm opacity-50">
        {index + 1}
      </div>
      
      <div className="col-span-12 md:col-span-5 relative">
        <label className="md:hidden text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-bold">Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{currencySymbol}</span>
          <input
            type="number"
            placeholder="0.00"
            value={purchase.price}
            onChange={(e) => onUpdate(purchase.id, 'price', e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-6 pr-3 text-sm focus:border-cyan-500 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
          />
        </div>
      </div>

      <div className="col-span-12 md:col-span-5 relative">
         <label className="md:hidden text-[10px] text-slate-500 dark:text-slate-400 mb-1 block uppercase font-bold">Cost</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm text-green-600">{currencySymbol}</span>
          <input
            type="number"
            placeholder="0.00"
            value={purchase.amount}
            onChange={(e) => onUpdate(purchase.id, 'amount', e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-6 pr-3 text-sm focus:border-green-500 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
          />
        </div>
      </div>

      <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center">
        <button
          onClick={() => onRemove(purchase.id)}
          className="p-2 text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Optimization: Only re-render if props change significantly
export default React.memo(PurchaseRow);