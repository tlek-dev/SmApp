import React, { useState, useEffect } from 'react';
import { Box, Card, Text, Grid, Badge, Flex, Separator, Container } from '@radix-ui/themes';
import { 
  StarIcon,
  TimerIcon,
  RocketIcon,
  LightningBoltIcon,
  HeartIcon
} from '@radix-ui/react-icons';
import WeatherWidget from './WeatherWidget';
import Footer from './Footer';
import IndicesWidget from './IndicesWidget';
import CurrencyCalculator from './CurrencyCalculator';
import { useShiftContext } from '../context/ShiftContext';
import CurrencyWidget from './widgets/CurrencyWidget';
import CryptoWidget from './widgets/CryptoWidget';
import CommoditiesWidget from './widgets/CommoditiesWidget';
import EnergyWidget from './widgets/EnergyWidget';

const MainPage = () => {
  const [formattedDate, setFormattedDate] = useState('');
  const { monthStats, getDayStatus } = useShiftContext();
  const today = new Date();
  const todayStatus = getDayStatus(today);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setFormattedDate(now.toLocaleDateString('ru-RU', options));
    };

    updateDate();
    const timer = setInterval(updateDate, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status.type) {
      case 'holiday':
        return 'red';
      case 'workday':
        return 'cyan';
      case 'dayoff':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Container size={{ initial: '2', sm: '3', md: '4' }}>
        <Flex direction="column" gap="2">
          {/* Верхний ряд */}
          <Grid columns={{ initial: '1', sm: '2' }} gap="2">
            <WeatherWidget />
            <Card size="2">
              <Box p="2">
                <Flex direction="column" gap="2">
                  <Text weight="bold" size="5">{formattedDate}</Text>
                  <Badge color={getStatusColor(todayStatus)} size="2">
                    {todayStatus.message}
                  </Badge>
                  <Grid columns="2" gap="2">
                    <Flex align="center" gap="2">
                      <Box style={{ backgroundColor: 'var(--accent-3)', padding: '8px', borderRadius: '8px' }}>
                        <StarIcon width="16" height="16" />
                      </Box>
                      <Flex direction="column">
                        <Text size="2" color="gray">Рабочих смен</Text>
                        <Text weight="bold">{monthStats.shifts}</Text>
                      </Flex>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Box style={{ backgroundColor: 'var(--accent-3)', padding: '8px', borderRadius: '8px' }}>
                        <TimerIcon width="16" height="16" />
                      </Box>
                      <Flex direction="column">
                        <Text size="2" color="gray">Рабочих часов</Text>
                        <Text weight="bold">{monthStats.regularHours + monthStats.holidayHours}</Text>
                      </Flex>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Box style={{ backgroundColor: 'var(--accent-3)', padding: '8px', borderRadius: '8px' }}>
                        <HeartIcon width="16" height="16" />
                      </Box>
                      <Flex direction="column">
                        <Text size="2" color="gray">Выходных</Text>
                        <Text weight="bold">{monthStats.shifts ? (new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - monthStats.shifts) : 0}</Text>
                      </Flex>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Box style={{ backgroundColor: 'var(--accent-3)', padding: '8px', borderRadius: '8px' }}>
                        <RocketIcon width="16" height="16" />
                      </Box>
                      <Flex direction="column">
                        <Text size="2" color="gray">Праздников</Text>
                        <Text weight="bold">{monthStats.holidays || 0}</Text>
                      </Flex>
                    </Flex>
                  </Grid>
                </Flex>
              </Box>
            </Card>
          </Grid>

          {/* Market Data Section */}
          <Box>
            <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="2">
              <CurrencyWidget />
              <CryptoWidget />
              <CommoditiesWidget />
              <EnergyWidget />
            </Grid>
          </Box>

          {/* Indices and Calculator Section */}
          <Box>
            <Grid columns={{ initial: '1', sm: '2' }} gap="2">
              <IndicesWidget />
              <CurrencyCalculator />
            </Grid>
          </Box>
        </Flex>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainPage;
