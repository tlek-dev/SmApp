import React, { useState } from 'react';
import { Card, Text, Box, Flex, Grid, Badge } from '@radix-ui/themes';
import { DashboardIcon, ArrowUpIcon, ArrowDownIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';
import MarketDataModal from '../common/MarketDataModal';

const EnergyWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: brentData } = useMarketData('BRENT');
  const { data: wtiData } = useMarketData('WTI');
  const { data: ngasData } = useMarketData('NGAS');
  const { data: hhubData } = useMarketData('HHUB');

  const energyProducts = [
    { id: 1, symbol: 'BRENT', name: 'Brent Crude Oil', icon: '🛢️', price: 82.45, change: 0.85, unit: 'USD/bbl' },
    { id: 2, symbol: 'WTI', name: 'WTI Crude Oil', icon: '🛢️', price: 78.30, change: 0.65, unit: 'USD/bbl' },
    { id: 3, symbol: 'NGAS', name: 'Natural Gas (EU)', icon: '🔥', price: 2.85, change: -1.20, unit: 'EUR/MMBtu' },
    { id: 4, symbol: 'HHUB', name: 'Henry Hub Gas', icon: '🔥', price: 2.45, change: -0.95, unit: 'USD/MMBtu' },
    { id: 5, symbol: 'DIESEL', name: 'Diesel', icon: '⛽', price: 3.25, change: 0.45, unit: 'USD/gal' },
    { id: 6, symbol: 'GASOLINE', name: 'Gasoline', icon: '⛽', price: 2.95, change: 0.35, unit: 'USD/gal' },
    { id: 7, symbol: 'HEATING', name: 'Heating Oil', icon: '🔥', price: 2.75, change: -0.55, unit: 'USD/gal' },
    { id: 8, symbol: 'PROPANE', name: 'Propane', icon: '🔥', price: 0.95, change: -0.25, unit: 'USD/gal' },
    { id: 9, symbol: 'TTF', name: 'TTF Gas', icon: '🔥', price: 35.40, change: -1.50, unit: 'EUR/MWh' },
    { id: 10, symbol: 'NBP', name: 'NBP Gas', icon: '🔥', price: 32.15, change: -1.25, unit: 'GBp/therm' },
    { id: 11, symbol: 'JKM', name: 'JKM LNG', icon: '❄️', price: 12.45, change: 0.75, unit: 'USD/MMBtu' },
    { id: 12, symbol: 'COAL', name: 'Coal', icon: '⚫', price: 145.20, change: -0.85, unit: 'USD/t' }
  ];

  const products = energyProducts.map((product) => {
    if (product.symbol === 'BRENT') {
      return { ...product, price: brentData?.price || product.price, change: brentData?.change || product.change };
    }
    if (product.symbol === 'WTI') {
      return { ...product, price: wtiData?.price || product.price, change: wtiData?.change || product.change };
    }
    if (product.symbol === 'NGAS') {
      return { ...product, price: ngasData?.price || product.price, change: ngasData?.change || product.change };
    }
    if (product.symbol === 'HHUB') {
      return { ...product, price: hhubData?.price || product.price, change: hhubData?.change || product.change };
    }
    return product;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getBadgeColor = (change) => {
    return change > 0 ? 'green' : 'red';
  };

  const renderEnergyItem = (product) => (
    <Box key={product.id}>
      <Card size="1">
        <Flex direction="column" gap="1">
          <Flex justify="between" align="center">
            <Flex align="center" gap="1">
              <Text style={{ fontSize: '10px' }}>{product.icon}</Text>
              <Text size="1" weight="bold" style={{ fontSize: '10px' }}>{product.symbol}</Text>
            </Flex>
            <LightningBoltIcon width="10" height="10" />
          </Flex>

          <Text size="2" weight="bold">
            {formatPrice(product.price)}
          </Text>

          <Badge size="1" color={getBadgeColor(product.change)} style={{ padding: '2px 4px' }}>
            <Flex align="center" gap="1">
              {product.change > 0 ? <ArrowUpIcon width="8" height="8" /> : <ArrowDownIcon width="8" height="8" />}
              <Text style={{ fontSize: '9px' }}>{Math.abs(product.change).toFixed(2)}%</Text>
            </Flex>
          </Badge>
        </Flex>
      </Card>
    </Box>
  );

  const renderModalItem = (product) => (
    <Box key={product.id} mb="3">
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Text>{product.icon}</Text>
          <Text weight="bold">{product.symbol}</Text>
          <Text color="gray">{product.name}</Text>
        </Flex>
        <Flex align="center" gap="3">
          <Flex direction="column" align="end">
            <Text size="3" weight="bold">
              {formatPrice(product.price)}
            </Text>
            <Text size="1" color="gray">
              {product.unit}
            </Text>
          </Flex>
          <Badge size="1" color={getBadgeColor(product.change)}>
            <Flex align="center" gap="1">
              {product.change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              <Text>{Math.abs(product.change).toFixed(2)}%</Text>
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
              <Text size="1" weight="bold">Энергоресурсы</Text>
            </Flex>
          </Flex>

          <Grid columns="2" gap="1">
            {products.slice(0, 4).map(renderEnergyItem)}
          </Grid>
        </Flex>
      </Card>

      <MarketDataModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Энергоресурсы"
      >
        <Box>
          {products.map(renderModalItem)}
        </Box>
      </MarketDataModal>
    </>
  );
};

export default EnergyWidget;
