import { useState, useEffect } from 'react';

export const useMarketData = (type = 'currency') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [prevData, setPrevData] = useState({});

  useEffect(() => {
    const calculateChange = (current, previous) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        let result;
        let newData;

        // Определяем базовую валюту для конвертации
        const toCurrency = 'KZT';
        let fromCurrency;

        switch (type) {
          case 'currency':
          case 'USD':
            fromCurrency = 'USD';
            break;
          case 'EUR':
            fromCurrency = 'EUR';
            break;
          case 'RUB':
            fromCurrency = 'RUB';
            break;
          case 'CNY':
            fromCurrency = 'CNY';
            break;

          case 'crypto':
          case 'BTC':
            response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            result = await response.json();
            if (result.bitcoin) {
              const price = result.bitcoin.usd;
              newData = {
                price,
                change: calculateChange(price, prevData[type]?.price),
                symbol: 'BTC'
              };
            }
            break;

          case 'ETH':
            response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            result = await response.json();
            if (result.ethereum) {
              const price = result.ethereum.usd;
              newData = {
                price,
                change: calculateChange(price, prevData[type]?.price),
                symbol: 'ETH'
              };
            }
            break;

          case 'TON':
            response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
            result = await response.json();
            if (result['the-open-network']) {
              const price = result['the-open-network'].usd;
              newData = {
                price,
                change: calculateChange(price, prevData[type]?.price),
                symbol: 'TON'
              };
            }
            break;

          case 'SOL':
            response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
            result = await response.json();
            if (result.solana) {
              const price = result.solana.usd;
              newData = {
                price,
                change: calculateChange(price, prevData[type]?.price),
                symbol: 'SOL'
              };
            }
            break;

          case 'commodities':
          case 'XAU':
            // Временные демо-данные для золота
            newData = {
              price: 1977.50,
              change: calculateChange(1977.50, prevData[type]?.price),
              symbol: 'XAU'
            };
            break;

          case 'XAG':
            // Временные демо-данные для серебра
            newData = {
              price: 23.15,
              change: calculateChange(23.15, prevData[type]?.price),
              symbol: 'XAG'
            };
            break;

          case 'XPT':
            // Временные демо-данные для платины
            newData = {
              price: 895.60,
              change: calculateChange(895.60, prevData[type]?.price),
              symbol: 'XPT'
            };
            break;

          case 'XPD':
            // Временные демо-данные для палладия
            newData = {
              price: 1012.30,
              change: calculateChange(1012.30, prevData[type]?.price),
              symbol: 'XPD'
            };
            break;

          default:
            throw new Error('Unknown market data type');
        }

        // Если это валюта, делаем запрос к Alpha Vantage
        if (fromCurrency) {
          response = await fetch(
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=demo`
          );
          result = await response.json();
          
          if (result["Realtime Currency Exchange Rate"]) {
            const rate = parseFloat(result["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
            newData = {
              rate,
              symbol: `${fromCurrency}/${toCurrency}`,
              change: calculateChange(rate, prevData[type]?.rate)
            };
          } else {
            // Резервный API для валют
            response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            result = await response.json();
            
            if (result.rates && result.rates[toCurrency]) {
              const rate = result.rates[toCurrency];
              newData = {
                rate,
                symbol: `${fromCurrency}/${toCurrency}`,
                change: calculateChange(rate, prevData[type]?.rate)
              };
            }
          }
        }

        if (newData) {
          setData(newData);
          setPrevData(prev => ({ ...prev, [type]: newData }));
        }

        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Обновление каждую минуту

    return () => clearInterval(interval);
  }, [type]);

  return { data, loading, error, lastUpdate };
};

export default useMarketData;
