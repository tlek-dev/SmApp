import React, { useState } from 'react';
import { Card, Text, Box, Flex, Grid, Badge, Image } from '@radix-ui/themes';
import { CubeIcon, ArrowUpIcon, ArrowDownIcon, DashboardIcon, BarChartIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';
import MarketDataModal from '../common/MarketDataModal';

const CryptoWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: btcData, loading: btcLoading } = useMarketData('BTC');
  const { data: ethData, loading: ethLoading } = useMarketData('ETH');
  const { data: tonData, loading: tonLoading } = useMarketData('TON');
  const { data: solData, loading: solLoading } = useMarketData('SOL');

  const cryptos = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      price: btcData?.price || 0,
      change: btcData?.change || 0,
      loading: btcLoading,
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    },
    {
      id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      price: ethData?.price || 0,
      change: ethData?.change || 0,
      loading: ethLoading,
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      id: 3,
      name: 'TON',
      symbol: 'TON',
      price: tonData?.price || 0,
      change: tonData?.change || 0,
      loading: tonLoading,
      icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png'
    },
    {
      id: 4,
      name: 'Solana',
      symbol: 'SOL',
      price: solData?.price || 0,
      change: solData?.change || 0,
      loading: solLoading,
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png'
    },
    {
      id: 5,
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.605,
      change: 2.34,
      loading: false,
      icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
    },
    {
      id: 6,
      name: 'Polkadot',
      symbol: 'DOT',
      price: 7.82,
      change: -1.15,
      loading: false,
      icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
    },
    {
      id: 7,
      name: 'Ripple',
      symbol: 'XRP',
      price: 0.63,
      change: 1.45,
      loading: false,
      icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
    },
    {
      id: 8,
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0.085,
      change: -2.18,
      loading: false,
      icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png'
    },
    {
      id: 9,
      name: 'Avalanche',
      symbol: 'AVAX',
      price: 34.25,
      change: 3.75,
      loading: false,
      icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
    },
    {
      id: 10,
      name: 'Chainlink',
      symbol: 'LINK',
      price: 14.92,
      change: 0.85,
      loading: false,
      icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
    },
    {
      id: 11,
      name: 'Polygon',
      symbol: 'MATIC',
      price: 0.89,
      change: -1.25,
      loading: false,
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
    },
    {
      id: 12,
      name: 'Uniswap',
      symbol: 'UNI',
      price: 6.15,
      change: 1.12,
      loading: false,
      icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
    },
    {
      id: 13,
      name: 'Stellar',
      symbol: 'XLM',
      price: 0.12,
      change: -0.45,
      loading: false,
      icon: 'https://cryptologos.cc/logos/stellar-xlm-logo.png'
    },
    {
      id: 14,
      name: 'Cosmos',
      symbol: 'ATOM',
      price: 9.85,
      change: 2.35,
      loading: false,
      icon: 'https://cryptologos.cc/logos/cosmos-atom-logo.png'
    },
    {
      id: 15,
      name: 'VeChain',
      symbol: 'VET',
      price: 0.028,
      change: 1.15,
      loading: false,
      icon: 'https://cryptologos.cc/logos/vechain-vet-logo.png'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getBadgeColor = (change) => {
    if (change > 0) return 'green';
    if (change < 0) return 'red';
    return 'blue';
  };

  const renderCryptoItem = (crypto) => (
    <Box key={crypto.id}>
      <Card size="1">
        <Flex direction="column" gap="1">
          <Flex justify="between" align="center">
            <Flex align="center" gap="1">
              <img 
                src={crypto.icon} 
                alt={crypto.name}
                style={{ width: '12px', height: '12px' }}
              />
              <Text size="1" weight="bold" style={{ fontSize: '10px' }}>{crypto.symbol}</Text>
            </Flex>
            <BarChartIcon width="10" height="10" />
          </Flex>

          {crypto.loading ? (
            <Badge size="1" color="blue" style={{ padding: '2px 4px', fontSize: '9px' }}>Загрузка...</Badge>
          ) : (
            <>
              <Text size="2" weight="bold">
                {crypto.price ? formatPrice(crypto.price) : 'N/A'}
              </Text>

              <Badge size="1" color={getBadgeColor(crypto.change)} style={{ padding: '2px 4px' }}>
                <Flex align="center" gap="1">
                  {crypto.change > 0 ? <ArrowUpIcon width="8" height="8" /> : <ArrowDownIcon width="8" height="8" />}
                  <Text style={{ fontSize: '9px' }}>{Math.abs(crypto.change).toFixed(2)}%</Text>
                </Flex>
              </Badge>
            </>
          )}
        </Flex>
      </Card>
    </Box>
  );

  const renderModalItem = (crypto) => (
    <Box key={crypto.id} mb="3">
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <img 
            src={crypto.icon} 
            alt={crypto.name} 
            style={{ width: '24px', height: '24px' }} 
          />
          <Text weight="bold">{crypto.symbol}</Text>
          <Text color="gray">{crypto.name}</Text>
        </Flex>
        <Flex align="center" gap="3">
          {crypto.loading ? (
            <Badge size="1" color="blue">Загрузка...</Badge>
          ) : (
            <>
              <Text size="3" weight="bold">
                {crypto.price ? formatPrice(crypto.price) : 'N/A'}
              </Text>
              <Badge size="1" color={getBadgeColor(crypto.change)}>
                <Flex align="center" gap="1">
                  {crypto.change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {Math.abs(crypto.change || 0).toFixed(2)}%
                </Flex>
              </Badge>
            </>
          )}
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
              <Text size="1" weight="bold">Криптовалюты</Text>
            </Flex>
          </Flex>

          <Grid columns="2" gap="1">
            {cryptos.slice(0, 4).map(renderCryptoItem)}
          </Grid>
        </Flex>
      </Card>

      <MarketDataModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Все криптовалюты"
      >
        <Box>
          {cryptos.map(renderModalItem)}
        </Box>
      </MarketDataModal>
    </>
  );
};

export default CryptoWidget;
