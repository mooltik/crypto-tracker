import React from 'react';
import { Activity, Plus, TrendingUp } from 'lucide-react';
import { Asset, Purchase } from '../../types';
import { calculateAssetStats } from '../../utils';
import AssetStats from './AssetStats';
import PurchaseRow from './PurchaseRow';

interface AssetEditorProps {
  asset: Asset;
  currencySymbol: string;
  exchangeRate: number;
  onUpdateAsset: (id: string, field: keyof Asset, value: any) => void;
  onAddPurchase: (assetId: string) => void;
  onRemovePurchase: (assetId: string, purchaseId: number | string) => void;
  onUpdatePurchase: (assetId: string, purchaseId: number | string, field: keyof Purchase, value: string) => void;
}

const AssetEditor: React.FC<AssetEditorProps> = ({
  asset,
  currencySymbol,
  exchangeRate,
  onUpdateAsset,
  onAddPurchase,
  onRemovePurchase,
  onUpdatePurchase
}) => {
  // Use the rate for display statistics
  const stats = calculateAssetStats(asset, exchangeRate);

  return (
    <div className="flex-1 space-y-6 animate-fadeIn">
      {/* Top Configuration Inputs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center shadow-lg dark:shadow-none transition-colors">
         <div className="w-full sm:w-auto flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1 block">Ticker Symbol</label>
            <div className="relative">
              <input
                type="text"
                value={asset.ticker}
                onChange={(e) => onUpdateAsset(asset.id, 'ticker', e.target.value.toUpperCase())}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-bold text-xl rounded-lg py-2 pl-3 pr-16 w-full uppercase focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="BTC"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs pointer-events-none">USDT</span>
            </div>
         </div>

         <div className="w-full sm:w-auto flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1 block flex justify-between">
              <span>Current Price (USD)</span>
              {asset.source && <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal">{asset.source}</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
              <input
                type="number"
                value={asset.currentPrice}
                onChange={(e) => onUpdateAsset(asset.id, 'currentPrice', e.target.value)}
                className={`bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white font-mono text-xl rounded-lg py-2 pl-7 pr-3 w-full focus:outline-none transition-colors
                  ${asset.connectionStatus === 'success' ? 'border-green-500/50 focus:border-green-500' : 'border-slate-200 dark:border-slate-600 focus:border-purple-500'}
                `}
                placeholder="0.00"
              />
               {asset.connectionStatus === 'loading' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Activity className="w-4 h-4 text-yellow-500 animate-spin" />
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Stats Cards (Converted Values) */}
      <AssetStats stats={stats} ticker={asset.ticker} currencySymbol={currencySymbol} />

      {/* Purchases Table (Raw USD Values) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none overflow-hidden flex-1 transition-colors">
        <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
            Purchases (Base USD)
          </h2>
          <span className="text-xs text-slate-500">Orders: {asset.purchases.length}</span>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Entry Price ($)</div>
            <div className="col-span-5">Cost ($)</div>
            <div className="col-span-1"></div>
          </div>

          {asset.purchases.map((p, index) => (
            <PurchaseRow
              key={p.id}
              purchase={p}
              index={index}
              currencySymbol="$" 
              onRemove={(pid) => onRemovePurchase(asset.id, pid)}
              onUpdate={(pid, f, v) => onUpdatePurchase(asset.id, pid, f, v)}
            />
          ))}

          <button
            onClick={() => onAddPurchase(asset.id)}
            className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Purchase Order
          </button>
        </div>
      </div>

      {/* Footer PnL for Asset (Converted Value) */}
      {stats.averagePrice > 0 && asset.currentPrice && (
        <div className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 p-1 rounded-xl shadow-lg transition-colors">
           <div className="bg-white/90 dark:bg-slate-900/90 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                 <div className="bg-purple-500/10 dark:bg-purple-500/20 p-2.5 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                 </div>
                 <div>
                    <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">PnL ({asset.ticker})</h4>
                    <div className={`text-2xl font-bold font-mono ${stats.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                       {stats.pnl >= 0 ? '+' : ''}{stats.pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {currencySymbol}
                    </div>
                 </div>
              </div>
              <div className={`px-4 py-2 rounded-lg border font-mono font-bold text-xl ${stats.pnlPercent >= 0 ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'}`}>
                 {stats.pnlPercent >= 0 ? '+' : ''}{stats.pnlPercent.toFixed(2)}%
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetEditor;