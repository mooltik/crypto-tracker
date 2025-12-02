import { useState, useCallback, useRef, useEffect } from 'react';
import { Asset, Purchase } from '../types';
import { generateId } from '../utils';

const INITIAL_ASSET: Asset = {
  id: '', 
  ticker: 'BTC',
  purchases: [
    { id: 1, price: '', amount: '' }, 
    { id: 2, price: '', amount: '' }
  ],
  currentPrice: '',
  source: '',
  connectionStatus: 'idle'
};

export const usePortfolio = () => {
  const [assets, setAssets] = useState<Asset[]>([{ ...INITIAL_ASSET, id: generateId() }]);
  const [activeAssetId, setActiveAssetId] = useState<string>(assets[0]?.id);

  // Ref is exposed to help with intervals avoiding stale closures
  const assetsRef = useRef(assets);
  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);

  const activeAsset = assets.find(a => a.id === activeAssetId) || assets[0];

  const addNewAsset = useCallback(() => {
    const newId = generateId();
    setAssets(prev => [
      ...prev, 
      { ...INITIAL_ASSET, id: newId, ticker: 'ETH' }
    ]);
    setActiveAssetId(newId);
  }, []);

  const removeAsset = useCallback((id: string) => {
    setAssets(prev => {
      if (prev.length === 1) return prev; // Prevent deleting last asset
      const newAssets = prev.filter(a => a.id !== id);
      if (activeAssetId === id) {
        setActiveAssetId(newAssets[0].id);
      }
      return newAssets;
    });
  }, [activeAssetId]);

  const updateAssetField = useCallback((assetId: string, field: keyof Asset, value: any) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, [field]: value } : a));
  }, []);

  // Purchase Logic
  const addPurchase = useCallback((assetId: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          purchases: [...a.purchases, { id: Date.now(), price: '', amount: '' }]
        };
      }
      return a;
    }));
  }, []);

  const removePurchase = useCallback((assetId: string, purchaseId: number | string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId && a.purchases.length > 1) {
        return {
          ...a,
          purchases: a.purchases.filter(p => p.id !== purchaseId)
        };
      }
      return a;
    }));
  }, []);

  const updatePurchase = useCallback((assetId: string, purchaseId: number | string, field: keyof Purchase, value: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const newPurchases = a.purchases.map(p => {
          if (p.id === purchaseId) return { ...p, [field]: value };
          return p;
        });
        return { ...a, purchases: newPurchases };
      }
      return a;
    }));
  }, []);

  // Bulk update (for price fetching)
  const updateAssets = useCallback((updater: (prev: Asset[]) => Asset[]) => {
    setAssets(updater);
  }, []);

  const resetPortfolio = useCallback(() => {
    const newId = generateId();
    const newAssets = [{ ...INITIAL_ASSET, id: newId }];
    setAssets(newAssets);
    setActiveAssetId(newId);
  }, []);

  const importPortfolio = useCallback((data: any) => {
    try {
      // Version 2 support
      if (Array.isArray(data.assets)) {
        setAssets(data.assets);
        setActiveAssetId(data.assets[0].id);
        return data.isLiveMode;
      }
      // Version 1 support (legacy)
      else if (Array.isArray(data.purchases)) {
        const oldAsset: Asset = {
          id: generateId(),
          ticker: data.ticker ? data.ticker.replace(/USDT$/i, '') : 'IMPORTED',
          purchases: data.purchases.map((p: any, i: number) => ({ ...p, id: p.id || Date.now() + i })),
          currentPrice: data.currentMarketPrice || '',
          connectionStatus: 'idle',
          source: ''
        };
        setAssets([oldAsset]);
        setActiveAssetId(oldAsset.id);
        return false;
      }
    } catch (error) {
      console.error('Import failed', error);
    }
    return false;
  }, []);

  return {
    assets,
    assetsRef,
    activeAssetId,
    activeAsset,
    setActiveAssetId,
    addNewAsset,
    removeAsset,
    updateAssetField,
    addPurchase,
    removePurchase,
    updatePurchase,
    updateAssets,
    resetPortfolio,
    importPortfolio
  };
};