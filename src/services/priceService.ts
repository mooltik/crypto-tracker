export interface PriceResult {
  price: number;
  source: string;
}

export const fetchCryptoPrice = async (ticker: string): Promise<PriceResult | null> => {
  if (!ticker) return null;
  const baseSymbol = ticker.toUpperCase().trim();
  const cleanTicker = baseSymbol.endsWith('USDT') ? baseSymbol : baseSymbol + 'USDT';

  try {
    // 1. Binance
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${cleanTicker}`);
      if (res.ok) {
        const data = await res.json();
        return { price: parseFloat(data.price), source: 'Binance' };
      }
    } catch (e) {
        // Silent fail to try next provider
    }

    // 2. Bybit
    try {
      const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${cleanTicker}`);
      if (res.ok) {
        const data = await res.json();
        if (data.retCode === 0 && data.result.list?.[0]) {
          return { price: parseFloat(data.result.list[0].lastPrice), source: 'Bybit' };
        }
      }
    } catch (e) {}

    // 3. Gate.io
    try {
      let gateTicker = cleanTicker;
      if (!gateTicker.includes('_') && gateTicker.endsWith('USDT')) {
        gateTicker = gateTicker.replace('USDT', '_USDT');
      }
      const res = await fetch(`https://api.gateio.ws/api/v4/spot/tickers?currency_pair=${gateTicker}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.[0]) {
          return { price: parseFloat(data[0].last), source: 'Gate.io' };
        }
      }
    } catch (e) {}
    
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
  }
  return null;
};

// Cache to prevent spamming the rate API
const RATE_CACHE: Record<string, { rate: number, timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const fetchExchangeRate = async (targetCurrency: string): Promise<number> => {
  if (targetCurrency === 'USD') return 1;

  // Check cache
  if (RATE_CACHE[targetCurrency]) {
    const { rate, timestamp } = RATE_CACHE[targetCurrency];
    if (Date.now() - timestamp < CACHE_DURATION) {
      return rate;
    }
  }

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates[targetCurrency];
      if (rate) {
        RATE_CACHE[targetCurrency] = { rate, timestamp: Date.now() };
        return rate;
      }
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
  }

  // Fallback if API fails (approximate values)
  const fallbacks: Record<string, number> = {
    'EUR': 0.92,
    'UAH': 41.5,
    'RUB': 92.0
  };
  return fallbacks[targetCurrency] || 1;
};