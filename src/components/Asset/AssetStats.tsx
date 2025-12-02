import React from 'react';
import { Calculator, Coins, Briefcase } from 'lucide-react';
import { AssetStats as AssetStatsType } from '../../types';

interface AssetStatsProps {
  stats: AssetStatsType;
  ticker: string;
  currencySymbol: string;
}

const AssetStats: React.FC<AssetStatsProps> = ({ stats, ticker, currencySymbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none relative overflow-hidden group transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Calculator className="w-16 h-16 text-slate-900 dark:text-white"/></div>
        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Avg Price</p>
        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 truncate">
          {stats.averagePrice > 0 ? `${currencySymbol}${stats.averagePrice.toFixed(stats.averagePrice < 1 ? 6 : 2)}` : '---'}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none relative overflow-hidden group transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Coins className="w-16 h-16 text-slate-900 dark:text-white"/></div>
        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Holdings</p>
        <div className="text-2xl font-bold text-slate-900 dark:text-white truncate">
          {stats.totalTokens > 0 ? stats.totalTokens.toLocaleString(undefined, {maximumFractionDigits: 4}) : '0'}
          <span className="text-sm text-slate-500 ml-1">{ticker}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none relative overflow-hidden group transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Briefcase className="w-16 h-16 text-slate-900 dark:text-white"/></div>
        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Total Cost</p>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400 truncate">
          {currencySymbol}{stats.totalCost.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssetStats);