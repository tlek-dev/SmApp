import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Flex, Select, TextField } from '@radix-ui/themes';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KZT');
  const [result, setResult] = useState('');

  // Получаем курсы напрямую через хук useMarketData
  const { data: usdData } = useMarketData('USD');
  const { data: eurData } = useMarketData('EUR');
  const { data: rubData } = useMarketData('RUB');
  const { data: cnyData } = useMarketData('CNY');
  const { data: gbpData } = useMarketData('GBP');
  const { data: jpyData } = useMarketData('JPY');

  // Собираем все курсы в один объект
  const rates = {
    USD: usdData?.price,
    EUR: eurData?.price,
    RUB: rubData?.price,
    CNY: cnyData?.price,
    GBP: gbpData?.price,
    JPY: jpyData?.price
  };

  // Конвертируем валюту при изменении любого параметра
  useEffect(() => {
    if (!amount || !fromCurrency || !toCurrency || isNaN(amount)) {
      setResult('');
      return;
    }

    const numAmount = parseFloat(amount);

    if (fromCurrency === toCurrency) {
      setResult(numAmount.toFixed(2));
      return;
    }

    let convertedAmount;
    if (fromCurrency === 'KZT' && rates[toCurrency]) {
      convertedAmount = numAmount / rates[toCurrency];
    } else if (toCurrency === 'KZT' && rates[fromCurrency]) {
      convertedAmount = numAmount * rates[fromCurrency];
    } else if (rates[fromCurrency] && rates[toCurrency]) {
      const amountInKZT = numAmount * rates[fromCurrency];
      convertedAmount = amountInKZT / rates[toCurrency];
    } else {
      setResult('');
      return;
    }

    setResult(convertedAmount.toFixed(2));
  }, [amount, fromCurrency, toCurrency, rates]);

  const currencies = [
    { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' }
  ];

  return (
    <Card 
      size="2" 
      style={{ 
        width: '100%',
        backgroundColor: 'var(--color-page-background)',
        border: '1px solid var(--gray-4)'
      }}
    >
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold">Currency Converter</Text>

        <Flex direction="column" gap="3">
          <Box>
            <Text size="2" mb="1" color="gray">Amount</Text>
            <TextField.Root>
              <TextField.Input 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Enter amount"
              />
            </TextField.Root>
          </Box>

          <Flex gap="2" align="end">
            <Box style={{ flex: 1 }}>
              <Text size="2" mb="1" color="gray">From</Text>
              <Select.Root value={fromCurrency} onValueChange={setFromCurrency}>
                <Select.Trigger />
                <Select.Content>
                  {currencies.map((currency) => (
                    <Select.Item key={currency.code} value={currency.code}>
                      <Flex gap="2" align="center">
                        <Text>{currency.flag}</Text>
                        <Text>{currency.code}</Text>
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box style={{ paddingBottom: '10px' }}>
              <ArrowRightIcon width="20" height="20" />
            </Box>

            <Box style={{ flex: 1 }}>
              <Text size="2" mb="1" color="gray">To</Text>
              <Select.Root value={toCurrency} onValueChange={setToCurrency}>
                <Select.Trigger />
                <Select.Content>
                  {currencies.map((currency) => (
                    <Select.Item key={currency.code} value={currency.code}>
                      <Flex gap="2" align="center">
                        <Text>{currency.flag}</Text>
                        <Text>{currency.code}</Text>
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>

          <Box style={{ marginTop: '10px' }}>
            <Card style={{ backgroundColor: 'var(--gray-1)', padding: '12px' }}>
              <Flex justify="between" align="center">
                <Text size="2" color="gray">Result</Text>
                <Text size="4" weight="bold">
                  {result ? `${result} ${toCurrency}` : '---'}
                </Text>
              </Flex>
            </Card>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CurrencyConverter;
