import { useState, useEffect } from 'react';

const COIN_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  TON: 'the-open-network',
  SOL: 'solana',
  ADA: 'cardano',
  LINK: 'chainlink'
};

const CURRENCY_SYMBOLS = ['USD', 'EUR', 'RUB', 'CNY', 'GBP', 'JPY'];

export const useMarketData = (type = 'currency') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCryptoData = async (coinId) => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24h_change=true`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch crypto data for ${type}`);
      }

      const result = await response.json();
      
      if (!result[coinId]) {
        throw new Error(`Invalid crypto data received for ${type}`);
      }

      const coinData = result[coinId];
      return {
        price: parseFloat(coinData.usd) || 0,
        change: parseFloat(coinData.usd_24h_change) || 0,
        symbol: type
      };
    };

    const fetchCurrencyData = async (currency) => {
      // Используем API для получения курсов валют
      const response = await fetch(
        `https://open.er-api.com/v6/latest/KZT`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch currency data for ${currency}`);
      }

      const result = await response.json();
      
      if (!result.rates || !result.rates[currency]) {
        throw new Error(`Invalid currency data received for ${currency}`);
      }

      // Конвертируем курс из KZT в целевую валюту
      const rate = 1 / result.rates[currency];
      
      return {
        price: rate,
        change: 0, // К сожалению, API не предоставляет изменение курса
        symbol: currency
      };
    };

    const fetchData = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);
        setError(null);

        let marketData;

        if (COIN_IDS[type]) {
          marketData = await fetchCryptoData(COIN_IDS[type]);
        } else if (CURRENCY_SYMBOLS.includes(type)) {
          marketData = await fetchCurrencyData(type);
        } else {
          throw new Error(`Unknown market data type: ${type}`);
        }

        if (isMounted) {
          setData(marketData);
        }
      } catch (err) {
        console.error('Error fetching market data:', err);
        if (isMounted) {
          setError(err.message);
          setData({
            price: 0,
            change: 0,
            symbol: type
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Обновляем каждую минуту

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [type]);

  return { data, loading, error };
};

export default useMarketData;
