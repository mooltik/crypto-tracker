import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AssetEditor from './components/Asset/AssetEditor';
import SettingsPage from './components/Settings/SettingsPage';
import ResetModal from './components/Modals/ResetModal';
import { usePortfolio } from './hooks/usePortfolio';
import { fetchCryptoPrice, fetchExchangeRate } from './services/priceService';
import { calculateGlobalStats } from './utils';
import { PortfolioExportData, AppSettings } from './types';

const App = () => {
  // Logic & State Hooks
  const { 
    assets, assetsRef, activeAsset, activeAssetId,
    setActiveAssetId, addNewAsset, removeAsset, updateAssetField,
    addPurchase, removePurchase, updatePurchase, updateAssets,
    resetPortfolio, importPortfolio 
  } = usePortfolio();

  // Local UI State
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  
  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    currency: 'USD',
    refreshInterval: 5000
  });

  const [exchangeRate, setExchangeRate] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Theme Effect ---
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // --- Exchange Rate Effect ---
  useEffect(() => {
    const updateRate = async () => {
      const rate = await fetchExchangeRate(settings.currency);
      setExchangeRate(rate);
    };
    updateRate();
  }, [settings.currency]);

  // --- Helpers ---
  const getCurrencySymbol = (code: string) => {
    switch(code) {
      case 'EUR': return '€';
      case 'UAH': return '₴';
      case 'RUB': return '₽';
      default: return '$';
    }
  };
  const currencySymbol = getCurrencySymbol(settings.currency);

  // --- Live Price Update Effect ---
  useEffect(() => {
    let intervalId: any;

    const updateAllPrices = async () => {
      setIsUpdating(true); // Start animation
      const currentAssetsList = assetsRef.current;
      
      const updates: Record<string, any> = {};
      let errorOccurred = false;
      
      await Promise.all(currentAssetsList.map(async (asset) => {
        const result = await fetchCryptoPrice(asset.ticker);
        if (result) {
          updates[asset.id] = { 
            currentPrice: result.price.toString(),
            source: result.source,
            connectionStatus: 'success'
          };
        } else {
          errorOccurred = true;
          updates[asset.id] = { connectionStatus: 'error' };
        }
      }));

      updateAssets(prevAssets => prevAssets.map(asset => {
        if (updates[asset.id]) {
          return { ...asset, ...updates[asset.id] };
        }
        return asset;
      }));

      setHasFetchError(errorOccurred);
      
      // Small delay to let the animation play out visually if the API is too fast
      setTimeout(() => setIsUpdating(false), 500); 
    };

    if (isLiveMode) {
      updateAllPrices(); // Initial fetch
      intervalId = setInterval(updateAllPrices, settings.refreshInterval);
    } else {
      // Reset status when turning off live mode
      setIsUpdating(false);
      setHasFetchError(false);
      updateAssets(prev => prev.map(a => ({ ...a, connectionStatus: 'idle', source: '' })));
    }

    return () => clearInterval(intervalId);
  }, [isLiveMode, updateAssets, assetsRef, settings.refreshInterval]);

  // --- Handlers ---

  const handleExport = () => {
    const data: PortfolioExportData = {
      version: 2,
      assets,
      isLiveMode,
      exportDate: new Date().toISOString()
    };
    const fileName = `crypto_portfolio_${new Date().toISOString().slice(0,10)}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const shouldSetLive = importPortfolio(parsed);
        if (shouldSetLive !== undefined) setIsLiveMode(shouldSetLive);
      } catch (error) {
        console.error('Import Error', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleResetConfirm = () => {
    resetPortfolio();
    setIsLiveMode(false);
    setShowResetModal(false);
  };

  // --- Calculations ---
  // Pass the real exchange rate here to affect Header stats
  const globalStats = calculateGlobalStats(assets, exchangeRate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      <ResetModal 
        isOpen={showResetModal} 
        onClose={() => setShowResetModal(false)} 
        onConfirm={handleResetConfirm} 
      />

      <Header 
        stats={globalStats}
        isLiveMode={isLiveMode}
        isUpdating={isUpdating}
        hasFetchError={hasFetchError}
        currencySymbol={currencySymbol}
        toggleLiveMode={() => setIsLiveMode(!isLiveMode)}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
        onResetClick={() => setShowResetModal(true)}
        onSettingsClick={() => setCurrentView('settings')}
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json" 
      />

      {currentView === 'settings' ? (
        <SettingsPage 
          settings={settings}
          onUpdateSettings={setSettings}
          onBack={() => setCurrentView('dashboard')}
        />
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          <Sidebar 
            assets={assets}
            activeAssetId={activeAssetId}
            currencySymbol={currencySymbol}
            exchangeRate={exchangeRate}
            onSelectAsset={setActiveAssetId}
            onRemoveAsset={removeAsset}
            onAddAsset={addNewAsset}
          />

          {activeAsset ? (
            <AssetEditor 
              asset={activeAsset}
              currencySymbol={currencySymbol}
              exchangeRate={exchangeRate}
              onUpdateAsset={updateAssetField}
              onAddPurchase={addPurchase}
              onRemovePurchase={removePurchase}
              onUpdatePurchase={updatePurchase}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select or add an asset to get started
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;