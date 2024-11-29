import React from 'react';
import { Box, Text, Flex, Badge } from '@radix-ui/themes';
import { HomeIcon, TimerIcon, RocketIcon, LightningBoltIcon, HeartIcon } from '@radix-ui/react-icons';
import { useShiftContext } from '../../context/ShiftContext';

const Home = () => {
  const { monthStats, getDayStatus } = useShiftContext();
  const today = new Date();
  const todayStatus = getDayStatus(today);

  const getStatusColor = (type) => {
    switch (type) {
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
    <Box className="nav-item">
      <Flex align="center" gap="2">
        <HomeIcon width="18" height="18" />
        <Text>Главная</Text>
        <Badge size="1" color={getStatusColor(todayStatus.type)}>
          {monthStats.shifts} смен
        </Badge>
      </Flex>
    </Box>
  );
};

export default Home;
