import React, { useState } from 'react';
import { Card, Text, Box, Flex, Grid, Badge, Dialog, Button } from '@radix-ui/themes';
import { CubeIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { useMarketData } from '../../hooks/useMarketData';

const CryptoWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { data: btcData, loading: btcLoading } = useMarketData('BTC');
  const { data: ethData, loading: ethLoading } = useMarketData('ETH');
  const { data: tonData, loading: tonLoading } = useMarketData('TON');
  const { data: solData, loading: solLoading } = useMarketData('SOL');
  const { data: adaData, loading: adaLoading } = useMarketData('ADA');
  const { data: linkData, loading: linkLoading } = useMarketData('LINK');

  const allCryptos = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      data: btcData,
      loading: btcLoading,
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    },
    {
      id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      data: ethData,
      loading: ethLoading,
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      id: 3,
      name: 'TON',
      symbol: 'TON',
      data: tonData,
      loading: tonLoading,
      icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png'
    },
    {
      id: 4,
      name: 'Solana',
      symbol: 'SOL',
      data: solData,
      loading: solLoading,
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png'
    },
    {
      id: 5,
      name: 'Cardano',
      symbol: 'ADA',
      data: adaData,
      loading: adaLoading,
      icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
    },
    {
      id: 6,
      name: 'Chainlink',
      symbol: 'LINK',
      data: linkData,
      loading: linkLoading,
      icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
    }
  ];

  const displayedCryptos = showAll ? allCryptos : allCryptos.slice(0, 4);

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getBadgeColor = (change) => {
    if (!change || isNaN(change)) return 'gray';
    return change >= 0 ? 'green' : 'red';
  };

  const renderCryptoItem = (crypto) => (
    <Box key={crypto.id}>
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
              <img 
                src={crypto.icon} 
                alt={crypto.name}
                style={{ width: '16px', height: '16px' }}
              />
              <Text size="2" weight="bold">{crypto.symbol}</Text>
            </Flex>
            <CubeIcon width="12" height="12" style={{ color: 'var(--gray-8)' }} />
          </Flex>

          {crypto.loading ? (
            <Text size="2" style={{ color: 'var(--gray-9)' }}>Loading...</Text>
          ) : (
            <Flex direction="column" gap="1">
              <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
                {formatPrice(crypto.data?.price)}
              </Text>
              <Badge size="1" color={getBadgeColor(crypto.data?.change)} variant="soft">
                <Flex align="center" gap="1">
                  {crypto.data?.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  <Text size="1">{Math.abs(crypto.data?.change || 0).toFixed(2)}%</Text>
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
            {displayedCryptos.map(renderCryptoItem)}
          </Grid>
        </Flex>
      </Card>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Cryptocurrency Market</Dialog.Title>
          
          <Flex direction="column" gap="3" style={{ marginTop: 20 }}>
            {allCryptos.map((crypto) => (
              <Box key={crypto.id}>
                <Flex justify="between" align="center" style={{ padding: '8px 0' }}>
                  <Flex align="center" gap="2">
                    <img 
                      src={crypto.icon} 
                      alt={crypto.name} 
                      style={{ width: '24px', height: '24px' }} 
                    />
                    <Box>
                      <Text weight="bold">{crypto.symbol}</Text>
                      <Text color="gray" size="2">{crypto.name}</Text>
                    </Box>
                  </Flex>
                  
                  <Flex direction="column" align="end" gap="1">
                    {crypto.loading ? (
                      <Text size="2">Loading...</Text>
                    ) : (
                      <>
                        <Text size="2" weight="bold">
                          {formatPrice(crypto.data?.price)}
                        </Text>
                        <Badge size="1" color={getBadgeColor(crypto.data?.change)} variant="soft">
                          <Flex align="center" gap="1">
                            {crypto.data?.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            <Text size="1">{Math.abs(crypto.data?.change || 0).toFixed(2)}%</Text>
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

export default CryptoWidget;
