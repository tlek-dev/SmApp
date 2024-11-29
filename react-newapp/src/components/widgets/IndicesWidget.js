import React, { useState } from 'react';
import { Card, Text, Flex, Box, Badge, Grid, Button, Dialog } from '@radix-ui/themes';
import { DashboardIcon, ArrowUpIcon, ArrowDownIcon, BarChartIcon } from '@radix-ui/react-icons';

const IndicesWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const indices = [
    { id: 1, symbol: 'SPX', name: 'S&P 500', icon: '🇺🇸', price: 4780.25, change: 0.45 },
    { id: 2, symbol: 'DJI', name: 'Dow Jones', icon: '🇺🇸', price: 37650.80, change: -0.32 },
    { id: 3, symbol: 'IXIC', name: 'NASDAQ', icon: '🇺🇸', price: 15055.15, change: 0.28 },
    { id: 4, symbol: 'RUT', name: 'Russell 2000', icon: '🇺🇸', price: 2012.60, change: -0.15 },
    { id: 5, symbol: 'FTSE', name: 'FTSE 100', icon: '🇬🇧', price: 7685.00, change: 0.55 },
    { id: 6, symbol: 'DAX', name: 'DAX 40', icon: '🇩🇪', price: 16750.85, change: -0.22 },
    { id: 7, symbol: 'CAC', name: 'CAC 40', icon: '🇫🇷', price: 7425.15, change: 0.18 },
    { id: 8, symbol: 'STOXX', name: 'Euro Stoxx 50', icon: '🇪🇺', price: 4520.40, change: -0.28 },
    { id: 9, symbol: 'N225', name: 'Nikkei 225', icon: '🇯🇵', price: 33450.45, change: 0.32 },
    { id: 10, symbol: 'HSI', name: 'Hang Seng', icon: '🇭🇰', price: 16720.80, change: -0.15 },
    { id: 11, symbol: 'SSEC', name: 'Shanghai Composite', icon: '🇨🇳', price: 2920.50, change: 0.42 },
    { id: 12, symbol: 'KOSPI', name: 'KOSPI', icon: '🇰🇷', price: 2580.25, change: -0.25 },
    { id: 13, symbol: 'SENSEX', name: 'BSE SENSEX', icon: '🇮🇳', price: 71850.00, change: 0.65 },
    { id: 14, symbol: 'BVSP', name: 'IBOVESPA', icon: '🇧🇷', price: 132580.80, change: 0.48 },
    { id: 15, symbol: 'ASX', name: 'ASX 200', icon: '🇦🇺', price: 7450.40, change: -0.18 },
    { id: 16, symbol: 'TSX', name: 'S&P/TSX', icon: '🇨🇦', price: 20850.85, change: 0.22 },
    { id: 17, symbol: 'MOEX', name: 'MOEX Russia', icon: '🇷🇺', price: 3250.90, change: -0.15 },
    { id: 18, symbol: 'TASI', name: 'Tadawul All Share', icon: '🇸🇦', price: 11860.60, change: 0.35 },
    { id: 19, symbol: 'MERVAL', name: 'S&P MERVAL', icon: '🇦🇷', price: 950250.95, change: -0.28 },
    { id: 20, symbol: 'TA35', name: 'TA-35', icon: '🇮🇱', price: 1925.25, change: 0.18 }
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

  const renderIndexItem = (index) => (
    <Box key={index.id}>
      <Card size="1">
        <Flex direction="column" gap="1">
          <Flex justify="between" align="center">
            <Flex align="center" gap="1">
              <Text style={{ fontSize: '10px' }}>{index.icon}</Text>
              <Text size="1" weight="bold" style={{ fontSize: '10px' }}>{index.symbol}</Text>
            </Flex>
            <BarChartIcon width="10" height="10" />
          </Flex>

          <Text size="2" weight="bold">
            {formatPrice(index.price)}
          </Text>

          <Badge size="1" color={getBadgeColor(index.change)} style={{ padding: '2px 4px' }}>
            <Flex align="center" gap="1">
              {index.change > 0 ? <ArrowUpIcon width="8" height="8" /> : <ArrowDownIcon width="8" height="8" />}
              <Text style={{ fontSize: '9px' }}>{Math.abs(index.change).toFixed(2)}%</Text>
            </Flex>
          </Badge>
        </Flex>
      </Card>
    </Box>
  );

  const renderModalItem = (index) => (
    <React.Fragment key={index.id}>
      <Flex justify="between" align="center" my="2">
        <Flex align="center" gap="2">
          <Text size="2">{index.icon}</Text>
          <Box>
            <Text size="2" weight="bold">{index.name}</Text>
            <Text size="1" color="gray">{index.symbol}</Text>
          </Box>
        </Flex>
        <Flex direction="column" align="end">
          <Text size="2" weight="bold">
            {formatPrice(index.price)}
          </Text>
          <Badge size="1" color={getBadgeColor(index.change)}>
            <Flex align="center" gap="1">
              {index.change > 0 ? <ArrowUpIcon width="10" height="10" /> : <ArrowDownIcon width="10" height="10" />}
              <Text size="1">{Math.abs(index.change).toFixed(2)}%</Text>
            </Flex>
          </Badge>
        </Flex>
      </Flex>
      <Box style={{ borderBottom: '1px solid var(--gray-5)' }} />
    </React.Fragment>
  );

  return (
    <>
      <Card size="2" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center" mb="1">
            <Flex align="center" gap="1">
              <DashboardIcon width="12" height="12" />
              <Text size="1" weight="bold">Мировые индексы</Text>
            </Flex>
          </Flex>

          <Grid columns="2" gap="1">
            {indices.slice(0, 4).map(renderIndexItem)}
          </Grid>
        </Flex>
      </Card>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content>
          <Dialog.Title>
            <Flex align="center" gap="2">
              <DashboardIcon width="16" height="16" />
              <Text size="3" weight="bold">Мировые индексы</Text>
            </Flex>
          </Dialog.Title>

          <Box mt="4">
            {indices.map(renderModalItem)}
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" size="1">
                Закрыть
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default IndicesWidget;
