import React from 'react';
import { Card, Text, Box, Flex, Grid, Badge } from '@radix-ui/themes';
import { BarChartIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

const IndicesWidget = () => {
  const indices = [
    {
      id: 1,
      name: 'S&P 500',
      value: '4,783.45',
      change: '+1.23',
      isPositive: true
    },
    {
      id: 2,
      name: 'NASDAQ',
      value: '15,003.22',
      change: '+1.56',
      isPositive: true
    },
    {
      id: 3,
      name: 'FTSE 100',
      value: '7,487.71',
      change: '-0.34',
      isPositive: false
    },
    {
      id: 4,
      name: 'Nikkei 225',
      value: '33,452.80',
      change: '+0.89',
      isPositive: true
    }
  ];

  return (
    <Card size="2">
      <Box p="4">
        <Flex align="center" gap="2" mb="4">
          <BarChartIcon width="24" height="24" />
          <Text size="6" weight="bold">
            Мировые индексы
          </Text>
        </Flex>
        <Grid columns="2" gap="3">
          {indices.map((index) => (
            <Card key={index.id} variant="surface">
              <Box p="3">
                <Text as="div" size="2" mb="1" weight="bold">
                  {index.name}
                </Text>
                <Flex justify="between" align="center">
                  <Text size="3">{index.value}</Text>
                  <Flex align="center" gap="1">
                    {index.isPositive ? (
                      <ArrowUpIcon color="green" />
                    ) : (
                      <ArrowDownIcon color="red" />
                    )}
                    <Badge
                      size="1"
                      color={index.isPositive ? 'green' : 'red'}
                    >
                      {index.change}%
                    </Badge>
                  </Flex>
                </Flex>
              </Box>
            </Card>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default IndicesWidget;
