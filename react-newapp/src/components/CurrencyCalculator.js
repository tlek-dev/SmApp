import React, { useState } from 'react';
import { 
  Card, 
  Text,
  Box,
  Flex, 
  Grid, 
  Select,
  Button,
} from '@radix-ui/themes';
import { 
  MixerHorizontalIcon, 
  InputIcon,
  ExitIcon,
  EnterIcon,
  CounterClockwiseClockIcon
} from '@radix-ui/react-icons';

const CurrencyCalculator = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KZT');
  const [result, setResult] = useState(null);

  // Static exchange rates (example rates)
  const exchangeRates = {
    USD: 499.00,
    EUR: 543.25,
    KZT: 1.00,
    RUB: 5.45,
    GBP: 632.80,
    CNY: 69.32
  };

  const currencies = [
    { code: 'USD', name: 'Доллар США' },
    { code: 'EUR', name: 'Евро' },
    { code: 'KZT', name: 'Тенге' },
    { code: 'RUB', name: 'Рубль' },
    { code: 'GBP', name: 'Фунт' },
    { code: 'CNY', name: 'Юань' }
  ];

  const calculateExchange = () => {
    if (!amount) return null;
    
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    return (amount * fromRate) / toRate;
  };

  const handleConvert = () => {
    const result = calculateExchange();
    setResult(result);
  };

  return (
    <Card size="2">
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center" mb="1">
          <Flex align="center" gap="1">
            <MixerHorizontalIcon width="12" height="12" />
            <Text size="1" weight="bold">Конвертер валют</Text>
          </Flex>
        </Flex>

        <Grid columns="3" gap="1">
          <Box style={{ width: '120px' }}>
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">Сумма</Text>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  fontSize: '11px',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  border: '1px solid var(--gray-a7)',
                  width: '100%',
                  height: '20px',
                }}
              />
            </Flex>
          </Box>

          <Box>
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">Из</Text>
              <Select.Root 
                defaultValue={fromCurrency} 
                onValueChange={setFromCurrency}
                size="1"
              >
                <Select.Trigger style={{ height: '20px', fontSize: '11px' }} />
                <Select.Content>
                  {currencies.map((currency) => (
                    <Select.Item 
                      key={currency.code} 
                      value={currency.code}
                    >
                      <Text size="1">{currency.code}</Text>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Box>

          <Box>
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">В</Text>
              <Select.Root 
                defaultValue={toCurrency} 
                onValueChange={setToCurrency}
                size="1"
              >
                <Select.Trigger style={{ height: '20px', fontSize: '11px' }} />
                <Select.Content>
                  {currencies.map((currency) => (
                    <Select.Item 
                      key={currency.code} 
                      value={currency.code}
                    >
                      <Text size="1">{currency.code}</Text>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Box>
        </Grid>

        <Box mt="1">
          <Button 
            size="1" 
            onClick={handleConvert}
            style={{ width: '100%', height: '24px', fontSize: '12px' }}
          >
            Конвертировать
          </Button>
        </Box>

        {result !== null && (
          <Box style={{ 
            padding: '8px', 
            borderRadius: '4px', 
            backgroundColor: 'var(--accent-a3)',
            border: '1px solid var(--accent-a5)'
          }}>
            <Flex direction="column" gap="1">
              <Flex align="center" justify="between">
                <Text size="2" weight="bold">
                  {result.toFixed(2)}
                </Text>
                <Text size="1" color="gray">{toCurrency}</Text>
              </Flex>
              <Text size="1" color="gray">
                1 {fromCurrency} = {(exchangeRates[fromCurrency] / exchangeRates[toCurrency]).toFixed(2)} {toCurrency}
              </Text>
            </Flex>
          </Box>
        )}
      </Flex>
    </Card>
  );
};

export default CurrencyCalculator;
