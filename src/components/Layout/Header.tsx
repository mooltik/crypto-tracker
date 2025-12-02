import React from 'react';
import { 
  LayoutDashboard, Wifi, WifiOff, Download, Upload, RefreshCw, Settings, AlertTriangle, Loader2 
} from 'lucide-react';
import { GlobalStats } from '../../types';

interface HeaderProps {
  stats: GlobalStats;
  isLiveMode: boolean;
  isUpdating: boolean;
  hasFetchError: boolean;
  currencySymbol: string;
  toggleLiveMode: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onResetClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  stats, isLiveMode, isUpdating, hasFetchError, currencySymbol, toggleLiveMode, onExport, onImportClick, onResetClick, onSettingsClick 
}) => {
  
  // Determine button styles based on state
  let liveButtonClass = "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
  let liveButtonContent = (
    <>
      <WifiOff className="w-3 h-3" />
      <span>Live OFF</span>
    </>
  );

  if (isLiveMode) {
    if (hasFetchError) {
      liveButtonClass = "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/50 animate-pulse";
      liveButtonContent = (
        <>
          <AlertTriangle className="w-3 h-3" />
          <span>API Error</span>
        </>
      );
    } else if (isUpdating) {
       liveButtonClass = "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/50";
       liveButtonContent = (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Updating...</span>
        </>
      );
    } else {
      liveButtonClass = "bg-purple-600 text-white shadow-lg shadow-purple-900/20 dark:shadow-purple-900/50 border border-transparent";
      liveButtonContent = (
        <>
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>Live ON</span>
        </>
      );
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shadow-xl shadow-slate-200/50 dark:shadow-black/20 z-10 sticky top-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Crypto Portfolio</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Invested: <span className="text-slate-700 dark:text-slate-200">{currencySymbol}{stats.totalInvested.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></span>
                <span className={stats.totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  PnL: {stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL.toLocaleString(undefined, {maximumFractionDigits: 0})} ({stats.totalPnLPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
             <button 
                onClick={toggleLiveMode}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${liveButtonClass}`}
              >
                {liveButtonContent}
              </button>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
              <button onClick={onExport} title="Export" className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"><Download className="w-4 h-4"/></button>
              <button onClick={onImportClick} title="Import" className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"><Upload className="w-4 h-4"/></button>
              <button onClick={onResetClick} title="Reset" className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><RefreshCw className="w-4 h-4"/></button>
              <button onClick={onSettingsClick} title="Settings" className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Settings className="w-4 h-4"/></button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);