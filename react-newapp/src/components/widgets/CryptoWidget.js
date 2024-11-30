import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Flex, Grid, Badge, Dialog, Button } from '@radix-ui/themes';
import { CubeIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
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

const getCryptoIcon = (crypto) => {
  const icons = {
    BTC: '₿',
    ETH: 'Ξ',
    TON: '💎',
    SOL: '◎',
    ADA: '₳',
    LINK: '⬡',
    XRP: '✕',
    DOT: '●',
    DOGE: 'Ð',
    AVAX: '🔺',
    MATIC: '⬡',
    UNI: '🦄'
  };
  return icons[crypto] || '🪙';
};

const CryptoCard = ({ crypto, onClick, showKZT = false }) => {
  const { data, loading, error } = useMarketData(crypto);

  if (loading) {
    return (
      <Card 
        size="1" 
        style={{ 
          height: showKZT ? '100px' : '80px',
          padding: '8px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)',
          cursor: 'pointer'
        }}
      >
        <Text>Loading {crypto} data...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        size="1" 
        style={{ 
          height: showKZT ? '100px' : '80px',
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
          height: showKZT ? '100px' : '80px',
          padding: '8px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)',
          cursor: 'pointer'
        }}
      >
        <Text>No data available for {crypto}</Text>
      </Card>
    );
  }

  return (
    <Card 
      size="1" 
      style={{ 
        height: showKZT ? '100px' : '80px',
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
            <Text style={{ fontSize: '14px' }}>{getCryptoIcon(crypto)}</Text>
            <Text size="2" weight="bold">{crypto}</Text>
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
            {formatPrice(data.price.usd, 'USD')}
          </Text>
          {showKZT && (
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              ≈ {new Intl.NumberFormat('ru-RU').format(data.price.kzt)} ₸
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

const ModalCryptoItem = ({ crypto }) => {
  const { data, loading, error } = useMarketData(crypto);

  if (loading) {
    return (
      <Card 
        size="1"
        style={{ 
          padding: '12px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)'
        }}
      >
        <Text>Loading {crypto} data...</Text>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card 
        size="1"
        style={{ 
          padding: '12px',
          backgroundColor: 'var(--gray-1)',
          border: '1px solid var(--gray-4)'
        }}
      >
        <Text color="red">Error loading {crypto} data</Text>
      </Card>
    );
  }

  return (
    <Card 
      key={crypto}
      size="1"
      style={{ 
        padding: '12px',
        backgroundColor: 'var(--gray-1)',
        border: '1px solid var(--gray-4)'
      }}
    >
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Text style={{ fontSize: '20px' }}>{getCryptoIcon(crypto)}</Text>
          <Box>
            <Text size="2" weight="bold">{crypto}</Text>
            <Text size="2" color="gray">{data.name || crypto}</Text>
          </Box>
        </Flex>
        <Flex direction="column" align="end">
          <Text size="2" weight="bold">
            {formatPrice(data.price, 'USD')}
          </Text>
          <Text size="2" color="gray">
            ≈ {new Intl.NumberFormat('ru-RU').format(data.price_kzt)} ₸
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const ModalCryptoList = ({ cryptos }) => {
  return (
    <Grid columns="1" gap="2" width="auto">
      {cryptos.map((crypto) => (
        <ModalCryptoItem key={crypto} crypto={crypto} />
      ))}
    </Grid>
  );
};

const CryptoWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const cryptos = [
    'BTC', 'ETH', 'TON', 'SOL', 'ADA', 'LINK',
    'XRP', 'DOT', 'DOGE', 'AVAX', 'MATIC', 'UNI'
  ];
  const displayedCryptos = showAll ? cryptos : cryptos.slice(0, 4);

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
              <CubeIcon width="16" height="16" />
              <Text size="2" weight="bold">Crypto Market</Text>
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
            {displayedCryptos.map((crypto) => (
              <CryptoCard 
                key={crypto} 
                crypto={crypto} 
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
              <CubeIcon width="20" height="20" />
              <Text size="5" weight="bold">Crypto Market</Text>
            </Flex>
          </Dialog.Title>
          
          <Box style={{ marginTop: 20 }}>
            <ModalCryptoList cryptos={cryptos} />
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

export default CryptoWidget;
