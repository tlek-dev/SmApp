import React, { useState } from 'react';
import { Card, Text, Box, Flex, Grid, Badge } from '@radix-ui/themes';
import { DashboardIcon, ArrowUpIcon, ArrowDownIcon, GlobeIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';
import MarketDataModal from '../common/MarketDataModal';

const CurrencyWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: usdData } = useMarketData('USD');
  const { data: eurData } = useMarketData('EUR');
  const { data: rubData } = useMarketData('RUB');
  const { data: cnyData } = useMarketData('CNY');

  const defaultCurrencies = [
    { id: 1, symbol: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 447.50, change: -0.15 },
    { id: 2, symbol: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 486.20, change: 0.25 },
    { id: 3, symbol: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 567.80, change: -0.32 },
    { id: 4, symbol: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: 3.15, change: 0.18 },
    { id: 5, symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: 510.45, change: -0.21 },
    { id: 6, symbol: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', rate: 69.30, change: 0.12 },
    { id: 7, symbol: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 295.60, change: -0.28 },
    { id: 8, symbol: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: 332.40, change: 0.15 },
    { id: 9, symbol: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rate: 334.25, change: -0.19 },
    { id: 10, symbol: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', rate: 273.90, change: 0.22 },
    { id: 11, symbol: 'KRW', name: 'South Korean Won', flag: '🇰🇷', rate: 0.34, change: -0.16 },
    { id: 12, symbol: 'INR', name: 'Indian Rupee', flag: '🇮🇳', rate: 5.42, change: 0.28 },
    { id: 13, symbol: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', rate: 91.35, change: -0.24 },
    { id: 14, symbol: 'ZAR', name: 'South African Rand', flag: '🇿🇦', rate: 23.80, change: 0.17 },
    { id: 15, symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rate: 121.95, change: -0.11 },
    { id: 16, symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', rate: 119.30, change: 0.14 },
    { id: 17, symbol: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', rate: 15.60, change: -0.35 },
    { id: 18, symbol: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', rate: 43.25, change: 0.19 },
    { id: 19, symbol: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', rate: 42.80, change: -0.22 },
    { id: 20, symbol: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', rate: 26.15, change: 0.16 }
  ];

  const currencies = defaultCurrencies.map((currency) => {
    if (currency.symbol === 'USD') {
      return { ...currency, rate: usdData?.rate || currency.rate, change: usdData?.change || currency.change };
    }
    if (currency.symbol === 'EUR') {
      return { ...currency, rate: eurData?.rate || currency.rate, change: eurData?.change || currency.change };
    }
    if (currency.symbol === 'RUB') {
      return { ...currency, rate: rubData?.rate || currency.rate, change: rubData?.change || currency.change };
    }
    if (currency.symbol === 'CNY') {
      return { ...currency, rate: cnyData?.rate || currency.rate, change: cnyData?.change || currency.change };
    }
    return currency;
  });

  const formatRate = (rate) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rate);
  };

  const getBadgeColor = (change) => {
    return change > 0 ? 'green' : 'red';
  };

  const renderCurrencyItem = (currency) => (
    <Box key={currency.id}>
      <Card size="1">
        <Flex direction="column" gap="1">
          <Flex justify="between" align="center">
            <Flex align="center" gap="1">
              <Text style={{ fontSize: '10px' }}>{currency.flag}</Text>
              <Text size="1" weight="bold" style={{ fontSize: '10px' }}>{currency.symbol}</Text>
            </Flex>
            <GlobeIcon width="10" height="10" />
          </Flex>

          <Text size="2" weight="bold">
            {formatRate(currency.rate)} ₸
          </Text>

          <Badge size="1" color={getBadgeColor(currency.change)} style={{ padding: '2px 4px' }}>
            <Flex align="center" gap="1">
              {currency.change > 0 ? <ArrowUpIcon width="8" height="8" /> : <ArrowDownIcon width="8" height="8" />}
              <Text style={{ fontSize: '9px' }}>{Math.abs(currency.change).toFixed(2)}%</Text>
            </Flex>
          </Badge>
        </Flex>
      </Card>
    </Box>
  );

  const renderModalItem = (currency) => (
    <Box key={currency.id} mb="3">
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Text>{currency.flag}</Text>
          <Text weight="bold">{currency.symbol}</Text>
          <Text color="gray">{currency.name}</Text>
        </Flex>
        <Flex align="center" gap="3">
          <Text size="3" weight="bold">
            {formatRate(currency.rate)} ₸
          </Text>
          <Badge size="1" color={getBadgeColor(currency.change)}>
            <Flex align="center" gap="1">
              {currency.change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(currency.change).toFixed(2)}%
            </Flex>
          </Badge>
        </Flex>
      </Flex>
      <Box mt="2" style={{ borderBottom: '1px solid var(--gray-5)' }} />
    </Box>
  );

  return (
    <>
      <Card size="2" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center" mb="1">
            <Flex align="center" gap="1">
              <DashboardIcon width="12" height="12" />
              <Text size="1" weight="bold">Курсы валют</Text>
            </Flex>
          </Flex>

          <Grid columns="2" gap="1">
            {currencies.slice(0, 4).map(renderCurrencyItem)}
          </Grid>
        </Flex>
      </Card>

      <MarketDataModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Все курсы валют"
      >
        <Box>
          {currencies.map(renderModalItem)}
        </Box>
      </MarketDataModal>
    </>
  );
};

export default CurrencyWidget;
