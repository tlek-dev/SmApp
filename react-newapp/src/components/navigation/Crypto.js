import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Badge } from '@radix-ui/themes';
import { DashboardIcon } from '@radix-ui/react-icons';

const Crypto = () => {
  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 60000); // Обновление каждую минуту

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="nav-item">
      <Flex align="center" gap="2">
        <DashboardIcon width="18" height="18" />
        <Text>Криптовалюты</Text>
        {btcPrice && (
          <Badge size="1" color="orange">
            BTC ${btcPrice.toLocaleString()}
          </Badge>
        )}
      </Flex>
    </Box>
  );
};

export default Crypto;
