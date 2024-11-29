import React, { useState, useEffect } from 'react';
import { Container, Box, Card, Text, Flex, IconButton } from '@radix-ui/themes';
import { UpdateIcon } from '@radix-ui/react-icons';

const CryptoPage = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [error, setError] = useState(null);

  const popularCryptos = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "ripple",
    "dogecoin",
    "the-open-network",  // TON Coin
    "hamster",           // Hamster Coin
    "shiba-inu",
    "litecoin",
    "solana",
    "cardano"
  ];

  const fetchCryptoRates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }

      const data = await response.json();
      const filteredData = data.filter(crypto => popularCryptos.includes(crypto.id));
      
      setCryptoData(filteredData);
      setLastUpdate(new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setError("Ошибка загрузки данных криптовалют");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoRates();
    const interval = setInterval(fetchCryptoRates, 60 * 1000); // Обновление каждую минуту
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Container size="4">
        <Box my="6">
          <Card>
            <Box p="6">
              <Text color="red" size="4">{error}</Text>
            </Box>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="4">
      <Box my="6">
        <Card>
          <Box p="6">
            <Flex justify="between" align="center" mb="6">
              <Text size="6" weight="bold">Курсы криптовалют</Text>
              <Flex align="center" gap="2">
                <Text size="2" color="gray">
                  Обновлено: {lastUpdate}
                </Text>
                <IconButton 
                  variant="soft" 
                  onClick={fetchCryptoRates}
                  disabled={loading}
                >
                  <UpdateIcon 
                    style={{ 
                      animation: loading ? 'spin 1s linear infinite' : 'none'
                    }} 
                  />
                </IconButton>
              </Flex>
            </Flex>

            <Flex direction="column" gap="3" style={{ opacity: loading ? 0.7 : 1 }}>
              {cryptoData.map((crypto) => (
                <Card key={crypto.id}>
                  <Flex 
                    justify="between" 
                    align="center" 
                    p="4"
                    style={{
                      transition: 'background-color 0.2s',
                      cursor: 'default'
                    }}
                  >
                    <Flex align="center" gap="3">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name}
                        style={{ 
                          width: '32px', 
                          height: '32px',
                          borderRadius: '50%'
                        }} 
                      />
                      <Box>
                        <Text weight="bold">{crypto.name}</Text>
                        <Text size="2" color="gray">{crypto.symbol.toUpperCase()}</Text>
                      </Box>
                    </Flex>
                    <Flex direction="column" align="end">
                      <Text weight="bold">
                        ${crypto.current_price.toFixed(2)}
                      </Text>
                      <Text 
                        size="2" 
                        color={crypto.price_change_percentage_24h >= 0 ? 'green' : 'red'}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default CryptoPage;
