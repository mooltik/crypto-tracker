import { Asset, AssetStats, GlobalStats } from './types';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const calculateAssetStats = (asset: Asset, exchangeRate: number = 1): AssetStats => {
  const stats = asset.purchases.reduce((acc, curr) => {
    const price = parseFloat(curr.price);
    const cost = parseFloat(curr.amount);
    if (!isNaN(price) && !isNaN(cost) && price > 0) {
      acc.totalCost += cost;
      acc.totalTokens += cost / price;
    }
    return acc;
  }, { totalCost: 0, totalTokens: 0 });

  const avgPrice = stats.totalTokens > 0 ? stats.totalCost / stats.totalTokens : 0;
  
  // PnL Calculation (Base USD)
  const currentPrice = parseFloat(asset.currentPrice);
  let currentValue = 0;
  let pnl = 0;
  let pnlPercent = 0;

  if (!isNaN(currentPrice) && stats.totalTokens > 0) {
    currentValue = currentPrice * stats.totalTokens;
    pnl = currentValue - stats.totalCost;
    pnlPercent = (pnl / stats.totalCost) * 100;
  }

  // Apply Exchange Rate to Monetary Values
  return {
    totalCost: stats.totalCost * exchangeRate,
    totalTokens: stats.totalTokens,
    averagePrice: avgPrice * exchangeRate,
    currentValue: currentValue * exchangeRate,
    pnl: pnl * exchangeRate,
    pnlPercent
  };
};

export const calculateGlobalStats = (assets: Asset[], exchangeRate: number = 1): GlobalStats => {
  const result = assets.reduce((acc, asset) => {
    // We pass exchangeRate here so individual asset stats are already converted
    const stats = calculateAssetStats(asset, exchangeRate);
    
    acc.totalInvested += stats.totalCost;
    
    if (parseFloat(asset.currentPrice) > 0) {
        acc.totalPortfolioValue += stats.currentValue;
        acc.hasPriceData = true;
    } else {
        acc.totalPortfolioValue += stats.totalCost; 
    }
    return acc;
  }, { totalInvested: 0, totalPortfolioValue: 0, hasPriceData: false } as GlobalStats);

  result.totalPnL = result.totalPortfolioValue - result.totalInvested;
  result.totalPnLPercent = result.totalInvested > 0 
    ? (result.totalPnL / result.totalInvested) * 100 
    : 0;
    
  return result;
};