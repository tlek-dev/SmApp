import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Flex, Grid, Badge, Dialog, Button } from '@radix-ui/themes';
import { DashboardIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';

const formatPrice = (price, currency = 'USD') => {
  if (!price || typeof price !== 'number' || isNaN(price)) {
    return '0.00';
  }
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const getCurrencyFlag = (currency) => {
  const flags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    RUB: '🇷🇺',
    CNY: '🇨🇳',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CHF: '🇨🇭',
    TRY: '🇹🇷',
    AED: '🇦🇪',
    SGD: '🇸🇬',
    KRW: '🇰🇷',
    INR: '🇮🇳'
  };
  return flags[currency] || '🌐';
};

const CurrencyCard = ({ currency, onClick, showUSD = false }) => {
  const { data, loading, error } = useMarketData(currency);

  if (loading) {
    return (
      <Card 
        size="1" 
        style={{ 
          height: showUSD ? '100px' : '80px',
          padding: '8px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)',
          cursor: 'pointer'
        }}
      >
        <Text>Loading {currency} data...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        size="1" 
        style={{ 
          height: showUSD ? '100px' : '80px',
          padding: '8px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)',
          cursor: 'pointer'
        }}
      >
        <Text color="red">Error: {error}</Text>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card 
        size="1" 
        style={{ 
          height: showUSD ? '100px' : '80px',
          padding: '8px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)',
          cursor: 'pointer'
        }}
      >
        <Text>No data available for {currency}</Text>
      </Card>
    );
  }

  return (
    <Card 
      size="1" 
      style={{ 
        height: showUSD ? '100px' : '80px',
        padding: '8px',
        backgroundColor: 'var(--gray-1)',
        border: '1px solid var(--gray-4)',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      <Flex direction="column" gap="1" justify="between" style={{ height: '100%' }}>
        <Flex justify="between" align="center">
          <Flex align="center" gap="1">
            <Text style={{ fontSize: '14px' }}>{getCurrencyFlag(currency)}</Text>
            <Text size="2" weight="bold">{currency}</Text>
          </Flex>
          <Badge size="1" color={data.change >= 0 ? 'green' : 'red'} variant="soft">
            <Flex align="center" gap="1">
              {data.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              <Text size="1">{Math.abs(data.change).toFixed(2)}%</Text>
            </Flex>
          </Badge>
        </Flex>

        <Flex direction="column" gap="1">
          <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
            {new Intl.NumberFormat('ru-RU').format(data.price.kzt)} ₸
          </Text>
          {showUSD && (
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              ≈ {formatPrice(data.price.usd, 'USD')}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

const ModalCurrencyItem = ({ currency }) => {
  const { data } = useMarketData(currency);

  return (
    <Card 
      key={currency}
      size="1"
      style={{ 
        padding: '12px',
        backgroundColor: 'var(--gray-1)',
        border: '1px solid var(--gray-4)'
      }}
    >
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Text style={{ fontSize: '20px' }}>{getCurrencyFlag(currency)}</Text>
          <Box>
            <Text size="2" weight="bold">{currency}</Text>
            <Text size="2" color="gray">{data?.name || currency}</Text>
          </Box>
        </Flex>
        <Flex direction="column" align="end">
          <Text size="2" weight="bold">
            {new Intl.NumberFormat('ru-RU').format(data?.price?.kzt)} ₸
          </Text>
          <Text size="2" color="gray">
            ≈ {formatPrice(data?.price?.usd, 'USD')}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const ModalCurrencyList = ({ currencies }) => {
  return (
    <Grid columns="1" gap="2" width="auto">
      {currencies.map((currency) => (
        <ModalCurrencyItem key={currency} currency={currency} />
      ))}
    </Grid>
  );
};

const CurrencyWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const currencies = [
    'USD', 'EUR', 'RUB', 'CNY', 'GBP', 'JPY',
    'CHF', 'TRY', 'AED', 'SGD', 'KRW', 'INR'
  ];
  const displayedCurrencies = showAll ? currencies : currencies.slice(0, 4);

  return (
    <>
      <Card 
        size="2" 
        style={{ 
          width: '100%',
          backgroundColor: 'var(--color-page-background)',
          border: '1px solid var(--gray-4)'
        }}
      >
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <DashboardIcon width="16" height="16" />
              <Text size="2" weight="bold">Currency Market</Text>
            </Flex>
            <Text 
              size="2"
              style={{ cursor: 'pointer', color: 'var(--accent-9)' }} 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </Text>
          </Flex>

          <Grid columns="2" gap="2" width="auto">
            {displayedCurrencies.map((currency) => (
              <CurrencyCard 
                key={currency} 
                currency={currency} 
                onClick={() => setIsModalOpen(true)}
              />
            ))}
          </Grid>
        </Flex>
      </Card>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>
            <Flex align="center" gap="2">
              <DashboardIcon width="20" height="20" />
              <Text size="5" weight="bold">Currency Market</Text>
            </Flex>
          </Dialog.Title>
          
          <Box style={{ marginTop: 20 }}>
            <ModalCurrencyList currencies={currencies} />
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default CurrencyWidget;
