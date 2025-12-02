import React from 'react';
import { Plus, X } from 'lucide-react';
import { Asset } from '../../types';
import { calculateAssetStats } from '../../utils';

interface SidebarProps {
  assets: Asset[];
  activeAssetId: string;
  currencySymbol: string;
  exchangeRate: number;
  onSelectAsset: (id: string) => void;
  onRemoveAsset: (id: string) => void;
  onAddAsset: () => void;
}

const SidebarAssetItem: React.FC<{ 
  asset: Asset; 
  isActive: boolean; 
  currencySymbol: string;
  exchangeRate: number;
  onSelect: () => void; 
  onRemove: (e: React.MouseEvent) => void; 
  canRemove: boolean;
}> = React.memo(({ asset, isActive, currencySymbol, exchangeRate, onSelect, onRemove, canRemove }) => {
  const stats = calculateAssetStats(asset, exchangeRate);
  
  return (
    <div 
      onClick={onSelect}
      className={`relative group cursor-pointer p-3 rounded-xl border transition-all min-w-[140px] md:min-w-0 flex-shrink-0 select-none
        ${isActive 
          ? 'bg-white dark:bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/10 dark:shadow-cyan-900/20' 
          : 'bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{asset.ticker}</span>
        {canRemove && (
          <button 
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex justify-between items-end">
        <div className="text-xs text-slate-500">Avg: {stats.averagePrice > 0 ? `${currencySymbol}${stats.averagePrice.toFixed(4)}` : '-'}</div>
        {stats.pnlPercent !== 0 && (
          <div className={`text-xs font-mono font-medium ${stats.pnlPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {stats.pnlPercent >= 0 ? '+' : ''}{stats.pnlPercent.toFixed(1)}%
          </div>
        )}
      </div>
      {asset.connectionStatus === 'success' && isActive && (
        <div className="absolute top-3 right-8 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-green-500/50 shadow"></div>
      )}
    </div>
  );
});

const Sidebar: React.FC<SidebarProps> = ({ 
  assets, activeAssetId, currencySymbol, exchangeRate, onSelectAsset, onRemoveAsset, onAddAsset 
}) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Coins</span>
        <button onClick={onAddAsset} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 text-sm flex items-center gap-1 font-medium transition-colors">
          <Plus className="w-3 h-3"/> Add New
        </button>
      </div>
      
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
        {assets.map(asset => (
          <SidebarAssetItem 
            key={asset.id} 
            asset={asset} 
            isActive={asset.id === activeAssetId}
            currencySymbol={currencySymbol}
            exchangeRate={exchangeRate}
            onSelect={() => onSelectAsset(asset.id)}
            onRemove={(e) => {
              e.stopPropagation();
              onRemoveAsset(asset.id);
            }}
            canRemove={assets.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);