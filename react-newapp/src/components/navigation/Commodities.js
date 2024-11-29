import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Badge } from '@radix-ui/themes';
import { BarChartIcon } from '@radix-ui/react-icons';

const Commodities = () => {
  const [goldPrice, setGoldPrice] = useState(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch('https://api.metals.live/v1/spot/gold');
        const data = await response.json();
        setGoldPrice(data[0].price);
      } catch (error) {
        console.error('Error fetching gold price:', error);
      }
    };

    fetchGoldPrice();
    const interval = setInterval(fetchGoldPrice, 60000); // Обновление каждую минуту

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="nav-item">
      <Flex align="center" gap="2">
        <BarChartIcon width="18" height="18" />
        <Text>Сырьевые товары</Text>
        {goldPrice && (
          <Badge size="1" color="yellow">
            Gold ${goldPrice.toFixed(2)}
          </Badge>
        )}
      </Flex>
    </Box>
  );
};

export default Commodities;
