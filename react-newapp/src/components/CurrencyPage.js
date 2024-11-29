import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, Flex, Text, Container } from '@radix-ui/themes';
import { TriangleUpIcon, TriangleDownIcon, UpdateIcon } from '@radix-ui/react-icons';

const mockCurrencyData = {
  data: [
    {
      id: 'usd',
      name: 'USD',
      fullName: 'Доллар США',
      rate: 450.25,
      change: 0.5,
      icon: '$'
    },
    {
      id: 'eur',
      name: 'EUR',
      fullName: 'Евро',
      rate: 485.80,
      change: -0.3,
      icon: '€'
    },
    {
      id: 'gbp',
      name: 'GBP',
      fullName: 'Британский фунт',
      rate: 565.45,
      change: 0.2,
      icon: '£'
    },
    {
      id: 'cny',
      name: 'CNY',
      fullName: 'Китайский юань',
      rate: 62.30,
      change: -0.1,
      icon: '¥'
    },
    {
      id: 'rub',
      name: 'RUB',
      fullName: 'Российский рубль',
      rate: 4.85,
      change: 0.4,
      icon: '₽'
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

const fetchCurrencyData = async () => {
  return mockCurrencyData;
};

const CurrencyPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['currency'],
    queryFn: fetchCurrencyData,
    refetchInterval: 30000
  });

  if (isLoading) return <Text>Загрузка...</Text>;
  if (error) return <Text>Ошибка: {error.message}</Text>;

  return (
    <Container>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="5" weight="bold">Курсы валют</Text>
          <Flex align="center" gap="2">
            <UpdateIcon />
            <Text size="2" color="gray">
              Обновлено: {data.lastUpdated}
            </Text>
          </Flex>
        </Flex>

        <Box>
          {data.data.map((currency) => (
            <Card key={currency.id} style={{ marginBottom: '8px' }}>
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Text size="6" style={{ minWidth: '30px' }}>{currency.icon}</Text>
                  <Box>
                    <Text weight="bold">{currency.name}</Text>
                    <Text size="2" color="gray">{currency.fullName}</Text>
                  </Box>
                </Flex>
                <Flex direction="column" align="end">
                  <Text weight="bold">{currency.rate.toFixed(2)} ₸</Text>
                  <Flex align="center" gap="1">
                    {currency.change >= 0 ? (
                      <TriangleUpIcon style={{ color: 'green' }} />
                    ) : (
                      <TriangleDownIcon style={{ color: 'red' }} />
                    )}
                    <Text 
                      size="2"
                      style={{ 
                        color: currency.change >= 0 ? 'green' : 'red'
                      }}
                    >
                      {Math.abs(currency.change)}%
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Box>
      </Flex>
    </Container>
  );
};

export default CurrencyPage;
