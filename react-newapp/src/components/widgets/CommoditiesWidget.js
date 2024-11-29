import React, { useState } from 'react';
import { Card, Text, Flex, Box, Badge, Grid } from '@radix-ui/themes';
import { DashboardIcon, ArrowUpIcon, ArrowDownIcon, BarChartIcon } from '@radix-ui/react-icons';
import MarketDataModal from '../common/MarketDataModal';

const CommoditiesWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const commodities = [
    { id: 1, symbol: 'XAU', name: 'Gold', icon: '🥇', price: 2023.50, change: 0.45 },
    { id: 2, symbol: 'XAG', name: 'Silver', icon: '🥈', price: 23.80, change: -0.32 },
    { id: 3, symbol: 'PLT', name: 'Platinum', icon: '⚪', price: 928.15, change: 0.28 },
    { id: 4, symbol: 'PLD', name: 'Palladium', icon: '⚪', price: 1245.60, change: -0.15 },
    { id: 5, symbol: 'RHO', name: 'Rhodium', icon: '⚪', price: 4150.00, change: 0.55 },
    { id: 6, symbol: 'COP', name: 'Copper', icon: '🔶', price: 3.85, change: -0.22 },
    { id: 7, symbol: 'ALU', name: 'Aluminum', icon: '⬜', price: 2.15, change: 0.18 },
    { id: 8, symbol: 'NIC', name: 'Nickel', icon: '⬜', price: 16.40, change: -0.28 },
    { id: 9, symbol: 'ZNC', name: 'Zinc', icon: '⬜', price: 2.45, change: 0.32 },
    { id: 10, symbol: 'TIN', name: 'Tin', icon: '⬜', price: 25.80, change: -0.15 },
    { id: 11, symbol: 'IRO', name: 'Iron Ore', icon: '⬛', price: 120.50, change: 0.42 },
    { id: 12, symbol: 'STL', name: 'Steel', icon: '⬛', price: 780.25, change: -0.25 },
    { id: 13, symbol: 'LIT', name: 'Lithium', icon: '🔋', price: 38500.00, change: 0.65 },
    { id: 14, symbol: 'URN', name: 'Uranium', icon: '☢️', price: 65.80, change: 0.48 },
    { id: 15, symbol: 'COB', name: 'Cobalt', icon: '⬜', price: 32.40, change: -0.18 },
    { id: 16, symbol: 'TIT', name: 'Titanium', icon: '⬜', price: 4.85, change: 0.22 },
    { id: 17, symbol: 'CHR', name: 'Chromium', icon: '⬜', price: 8.90, change: -0.15 },
    { id: 18, symbol: 'MOL', name: 'Molybdenum', icon: '⬜', price: 42.60, change: 0.35 },
    { id: 19, symbol: 'MAN', name: 'Manganese', icon: '⬜', price: 2.95, change: -0.28 },
    { id: 20, symbol: 'VAD', name: 'Vanadium', icon: '⬜', price: 7.25, change: 0.18 }
  ];

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

  const renderCommodityItem = (commodity) => (
    <Box key={commodity.id}>
      <Card size="1">
        <Flex direction="column" gap="1">
          <Flex justify="between" align="center">
            <Flex align="center" gap="1">
              <Text style={{ fontSize: '10px' }}>{commodity.icon}</Text>
              <Text size="1" weight="bold" style={{ fontSize: '10px' }}>{commodity.symbol}</Text>
            </Flex>
            <BarChartIcon width="10" height="10" />
          </Flex>

          <Text size="2" weight="bold">
            ${formatPrice(commodity.price)}
          </Text>

          <Badge size="1" color={getBadgeColor(commodity.change)} style={{ padding: '2px 4px' }}>
            <Flex align="center" gap="1">
              {commodity.change > 0 ? <ArrowUpIcon width="8" height="8" /> : <ArrowDownIcon width="8" height="8" />}
              <Text style={{ fontSize: '9px' }}>{Math.abs(commodity.change).toFixed(2)}%</Text>
            </Flex>
          </Badge>
        </Flex>
      </Card>
    </Box>
  );

  const renderModalItem = (commodity) => (
    <Box key={commodity.id} mb="3">
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Text>{commodity.icon}</Text>
          <Text weight="bold">{commodity.symbol}</Text>
          <Text color="gray">{commodity.name}</Text>
        </Flex>
        <Flex align="center" gap="3">
          <Text size="3" weight="bold">
            ${formatPrice(commodity.price)}
          </Text>
          <Badge size="1" color={getBadgeColor(commodity.change)}>
            <Flex align="center" gap="1">
              {commodity.change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(commodity.change).toFixed(2)}%
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
              <Text size="1" weight="bold">Драгоценные металлы</Text>
            </Flex>
          </Flex>

          <Grid columns="2" gap="1">
            {commodities.slice(0, 4).map(renderCommodityItem)}
          </Grid>
        </Flex>
      </Card>

      <MarketDataModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Все металлы и сырье"
      >
        <Box>
          {commodities.map(renderModalItem)}
        </Box>
      </MarketDataModal>
    </>
  );
};

export default CommoditiesWidget;
