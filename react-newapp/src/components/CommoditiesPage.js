import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, Flex, Text, Container } from '@radix-ui/themes';
import { TriangleUpIcon, TriangleDownIcon, UpdateIcon } from '@radix-ui/react-icons';
import { fetchCommoditiesData, convertToKZT } from '../api/marketData';

const mockCommoditiesData = {
  data: [
    {
      id: 'oil',
      name: 'Нефть',
      price: 85.30,
      change: 1.2,
      icon: '🛢️'
    },
    {
      id: 'gold',
      name: 'Золото',
      price: 1950.75,
      change: 0.8,
      icon: '🥇'
    },
    {
      id: 'silver',
      name: 'Серебро',
      price: 23.45,
      change: -0.5,
      icon: '🥈'
    },
    {
      id: 'copper',
      name: 'Медь',
      price: 3.85,
      change: 0.3,
      icon: '🔶'
    },
    {
      id: 'gas',
      name: 'Природный газ',
      price: 2.75,
      change: -0.7,
      icon: '⛽'
    }
  ],
  lastUpdated: new Date().toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
};

const CommoditiesPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['commodities'],
    queryFn: fetchCommoditiesData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Container size="4">
        <Box p="4">
          <Text>Загрузка данных...</Text>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="4">
        <Box p="4">
          <Text color="red">Ошибка загрузки данных</Text>
        </Box>
      </Container>
    );
  }

  // Проверяем, что data существует и является объектом с нужными полями
  const commodities = Array.isArray(data?.data) ? data.data : [];
  const lastUpdated = data?.lastUpdated || '';

  return (
    <Container size="4">
      <Box p="4">
        <Flex justify="between" align="center" mb="4">
          <Text size="6" weight="bold">
            Сырьевые товары
          </Text>
          <Flex align="center" gap="2">
            <UpdateIcon />
            <Text size="2" color="gray">
              {lastUpdated}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="column" gap="3">
          {commodities.map((commodity) => (
            <Card key={commodity.id}>
              <Flex justify="between" align="center">
                <Flex align="center" gap="2">
                  <Text size="6">{commodity.icon}</Text>
                  <Box>
                    <Text size="5" weight="bold">
                      {commodity.name}
                    </Text>
                    <Text color="gray" size="2">
                      {commodity.description}
                    </Text>
                  </Box>
                </Flex>
                <Flex direction="column" align="end">
                  <Text size="4" weight="bold">
                    ${commodity.price.toFixed(2)}
                  </Text>
                  <Text size="2">
                    {convertToKZT(commodity.price).toLocaleString('ru-KZ')} ₸
                  </Text>
                  <Flex align="center" gap="1">
                    {commodity.change >= 0 ? (
                      <TriangleUpIcon style={{ color: 'green' }} />
                    ) : (
                      <TriangleDownIcon style={{ color: 'red' }} />
                    )}
                    <Text
                      size="2"
                      style={{
                        color: commodity.change >= 0 ? 'green' : 'red',
                      }}
                    >
                      {Math.abs(commodity.change)}%
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Box>
    </Container>
  );
};

export default CommoditiesPage;
