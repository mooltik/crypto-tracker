export type ConnectionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Purchase {
  id: number | string;
  price: string;
  amount: string;
}

export interface Asset {
  id: string;
  ticker: string;
  purchases: Purchase[];
  currentPrice: string;
  source: string;
  connectionStatus: ConnectionStatus;
}

export interface AssetStats {
  totalCost: number;
  totalTokens: number;
  averagePrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface GlobalStats {
  totalInvested: number;
  totalPortfolioValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  hasPriceData: boolean;
}

export interface PortfolioExportData {
  version: number;
  assets: Asset[];
  isLiveMode: boolean;
  exportDate: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  currency: 'USD' | 'EUR' | 'UAH' | 'RUB';
  refreshInterval: number;
}