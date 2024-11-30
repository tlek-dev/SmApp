import { useState, useEffect } from 'react';

// Конфигурация для криптовалют
const CRYPTO_CONFIG = {
  BTC: { id: 'bitcoin', name: 'Bitcoin', position: 1 },
  ETH: { id: 'ethereum', name: 'Ethereum', position: 2 },
  TON: { id: 'the-open-network', name: 'TON', position: 3 },
  SOL: { id: 'solana', name: 'Solana', position: 4 },
  ADA: { id: 'cardano', name: 'Cardano', position: 5 },
  LINK: { id: 'chainlink', name: 'Chainlink', position: 6 },
  XRP: { id: 'ripple', name: 'Ripple', position: 7 },
  DOT: { id: 'polkadot', name: 'Polkadot', position: 8 },
  DOGE: { id: 'dogecoin', name: 'Dogecoin', position: 9 },
  AVAX: { id: 'avalanche-2', name: 'Avalanche', position: 10 },
  MATIC: { id: 'matic-network', name: 'Polygon', position: 11 },
  UNI: { id: 'uniswap', name: 'Uniswap', position: 12 }
};

// Конфигурация для валют
const CURRENCY_CONFIG = {
  USD: { name: 'US Dollar', position: 1 },
  EUR: { name: 'Euro', position: 2 },
  RUB: { name: 'Russian Ruble', position: 3 },
  CNY: { name: 'Chinese Yuan', position: 4 },
  GBP: { name: 'British Pound', position: 5 },
  JPY: { name: 'Japanese Yen', position: 6 },
  CHF: { name: 'Swiss Franc', position: 7 },
  TRY: { name: 'Turkish Lira', position: 8 },
  AED: { name: 'UAE Dirham', position: 9 },
  SGD: { name: 'Singapore Dollar', position: 10 },
  KRW: { name: 'South Korean Won', position: 11 },
  INR: { name: 'Indian Rupee', position: 12 }
};

export const useMarketData = (type) => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchCryptoData = async () => {
      if (!CRYPTO_CONFIG[type]) {
        throw new Error('Invalid cryptocurrency type');
      }

      try {
        const coinId = CRYPTO_CONFIG[type].id;
        // Using CoinGecko API v3
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,kzt&include_24h_change=true`,
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${type}`);
        }

        const data = await response.json();
        
        if (!data[coinId]) {
          throw new Error(`No data available for ${type}`);
        }

        return {
          symbol: type,
          name: CRYPTO_CONFIG[type].name,
          position: CRYPTO_CONFIG[type].position,
          price: {
            usd: Number(data[coinId].usd),
            kzt: Number(data[coinId].kzt || data[coinId].usd * 450)
          },
          change: Number(data[coinId].usd_24h_change?.toFixed(2)) || 0
        };
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        throw error;
      }
    };

    const fetchCurrencyData = async () => {
      if (!CURRENCY_CONFIG[type]) {
        throw new Error('Invalid currency type');
      }

      try {
        // Using Open Exchange Rates API
        const response = await fetch('https://open.er-api.com/v6/latest/USD');

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${type}`);
        }

        const data = await response.json();
        
        if (!data.rates || !data.rates.KZT || !data.rates[type]) {
          throw new Error(`No exchange rate data available for ${type}`);
        }

        // Calculate rates
        const usdToKzt = data.rates.KZT;
        const usdToCurrency = data.rates[type];
        const kztToCurrency = usdToKzt / usdToCurrency;

        return {
          symbol: type,
          name: CURRENCY_CONFIG[type].name,
          position: CURRENCY_CONFIG[type].position,
          price: {
            kzt: Number(kztToCurrency.toFixed(2)),
            usd: Number((1 / usdToCurrency).toFixed(2))
          },
          change: 0
        };
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        throw error;
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = type in CRYPTO_CONFIG 
          ? await fetchCryptoData()
          : await fetchCurrencyData();

        if (isMounted) {
          setMarketData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setMarketData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    timeoutId = setInterval(fetchData, 60000);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [type]);

  return {
    data: marketData,
    loading,
    error,
    isCrypto: type in CRYPTO_CONFIG
  };
};

export default useMarketData;
