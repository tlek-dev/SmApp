import React from 'react';
import { Box, Text, Flex, Badge } from '@radix-ui/themes';
import { CurrencyDollarIcon, TriangleUpIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import useMarketData from '../../hooks/useMarketData';

const Currency = () => {
  const { data, loading, error, lastUpdate } = useMarketData('currency');

  const getBadgeColor = (change) => {
    if (error) return 'red';
    if (change > 0) return 'green';
    if (change < 0) return 'red';
    return 'blue';
  };

  return (
    <Box className="nav-item">
      <Flex align="center" gap="2">
        <CurrencyDollarIcon width="18" height="18" />
        <Text>Валюты</Text>
        {error ? (
          <Badge size="1" color="red">{error}</Badge>
        ) : loading ? (
          <Badge size="1" color="blue">Загрузка...</Badge>
        ) : data && (
          <Flex gap="1">
            <Badge size="1" color={getBadgeColor(data.change)}>
              {data.symbol} {data.rate.toFixed(2)}
            </Badge>
            {data.change && (
              <Badge size="1" color={getBadgeColor(data.change)}>
                <Flex align="center" gap="1">
                  {data.change > 0 ? <TriangleUpIcon /> : <TriangleDownIcon />}
                  {Math.abs(data.change).toFixed(2)}%
                </Flex>
              </Badge>
            )}
            {lastUpdate && (
              <Badge size="1" variant="soft">
                {lastUpdate.toLocaleTimeString('ru-RU')}
              </Badge>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Currency;
