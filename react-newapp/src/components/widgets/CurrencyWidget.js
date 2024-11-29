import React, { useState } from 'react';
import { Card, Text, Box, Flex, Grid, Badge, Dialog, Button } from '@radix-ui/themes';
import { GlobeIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';

const CurrencyWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { data: usdData, loading: usdLoading } = useMarketData('USD');
  const { data: eurData, loading: eurLoading } = useMarketData('EUR');
  const { data: rubData, loading: rubLoading } = useMarketData('RUB');
  const { data: cnyData, loading: cnyLoading } = useMarketData('CNY');
  const { data: gbpData, loading: gbpLoading } = useMarketData('GBP');
  const { data: jpyData, loading: jpyLoading } = useMarketData('JPY');

  const allCurrencies = [
    {
      id: 1,
      name: 'US Dollar',
      symbol: 'USD',
      flag: '🇺🇸',
      data: usdData,
      loading: usdLoading
    },
    {
      id: 2,
      name: 'Euro',
      symbol: 'EUR',
      flag: '🇪🇺',
      data: eurData,
      loading: eurLoading
    },
    {
      id: 3,
      name: 'Russian Ruble',
      symbol: 'RUB',
      flag: '🇷🇺',
      data: rubData,
      loading: rubLoading
    },
    {
      id: 4,
      name: 'Chinese Yuan',
      symbol: 'CNY',
      flag: '🇨🇳',
      data: cnyData,
      loading: cnyLoading
    },
    {
      id: 5,
      name: 'British Pound',
      symbol: 'GBP',
      flag: '🇬🇧',
      data: gbpData,
      loading: gbpLoading
    },
    {
      id: 6,
      name: 'Japanese Yen',
      symbol: 'JPY',
      flag: '🇯🇵',
      data: jpyData,
      loading: jpyLoading
    }
  ];

  const displayedCurrencies = showAll ? allCurrencies : allCurrencies.slice(0, 4);

  const formatRate = (rate) => {
    if (typeof rate !== 'number' || isNaN(rate)) return '0.00';
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rate);
  };

  const getBadgeColor = (change) => {
    if (!change || isNaN(change)) return 'gray';
    return change >= 0 ? 'green' : 'red';
  };

  const renderCurrencyItem = (currency) => (
    <Box key={currency.id}>
      <Card 
        size="1" 
        style={{ 
          height: '80px',
          padding: '8px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)',
          cursor: 'pointer'
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Flex direction="column" gap="1" justify="between" style={{ height: '100%' }}>
          <Flex justify="between" align="center">
            <Flex align="center" gap="1">
              <Text style={{ fontSize: '10px' }}>{currency.flag}</Text>
              <Text size="2" weight="bold">{currency.symbol}</Text>
            </Flex>
            <GlobeIcon width="12" height="12" style={{ color: 'var(--gray-8)' }} />
          </Flex>

          {currency.loading ? (
            <Text size="2" style={{ color: 'var(--gray-9)' }}>Loading...</Text>
          ) : (
            <Flex direction="column" gap="1">
              <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
                {formatRate(currency.data?.price)} 
              </Text>
              <Badge size="1" color={getBadgeColor(currency.data?.change)} variant="soft">
                <Flex align="center" gap="1">
                  {currency.data?.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  <Text size="1">{Math.abs(currency.data?.change || 0).toFixed(2)}%</Text>
                </Flex>
              </Badge>
            </Flex>
          )}
        </Flex>
      </Card>
    </Box>
  );

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
              <GlobeIcon width="16" height="16" />
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
            {displayedCurrencies.map(renderCurrencyItem)}
          </Grid>
        </Flex>
      </Card>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Currency Market</Dialog.Title>
          
          <Flex direction="column" gap="3" style={{ marginTop: 20 }}>
            {allCurrencies.map((currency) => (
              <Box key={currency.id}>
                <Flex justify="between" align="center" style={{ padding: '8px 0' }}>
                  <Flex align="center" gap="2">
                    <Text>{currency.flag}</Text>
                    <Box>
                      <Text weight="bold">{currency.symbol}</Text>
                      <Text color="gray" size="2">{currency.name}</Text>
                    </Box>
                  </Flex>
                  
                  <Flex direction="column" align="end" gap="1">
                    {currency.loading ? (
                      <Text size="2">Loading...</Text>
                    ) : (
                      <>
                        <Text size="2" weight="bold">
                          {formatRate(currency.data?.price)} 
                        </Text>
                        <Badge size="1" color={getBadgeColor(currency.data?.change)} variant="soft">
                          <Flex align="center" gap="1">
                            {currency.data?.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            <Text size="1">{Math.abs(currency.data?.change || 0).toFixed(2)}%</Text>
                          </Flex>
                        </Badge>
                      </>
                    )}
                  </Flex>
                </Flex>
                <Box style={{ borderBottom: '1px solid var(--gray-4)' }} />
              </Box>
            ))}
          </Flex>

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
