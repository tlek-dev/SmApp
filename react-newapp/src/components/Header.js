import React from 'react';
import { Flex, Button, Text } from '@radix-ui/themes';
import { HomeIcon, BarChartIcon, CubeIcon } from '@radix-ui/react-icons';

const Header = ({ onNavigate, currentPage }) => {
  return (
    <Flex 
      px="6" 
      py="3" 
      justify="between" 
      align="center"
      style={{
        backgroundColor: 'var(--color-panel-solid)',
        borderBottom: '1px solid var(--gray-a5)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Text size="5" weight="bold">
        NewApp
      </Text>

      <Flex gap="4">
        <Button
          variant={currentPage === 'main' ? 'solid' : 'ghost'}
          onClick={() => onNavigate('main')}
        >
          <HomeIcon width="16" height="16" />
          Главная
        </Button>
        <Button
          variant={currentPage === 'currency' ? 'solid' : 'ghost'}
          onClick={() => onNavigate('currency')}
        >
          <BarChartIcon width="16" height="16" />
          Курсы валют
        </Button>
        <Button
          variant={currentPage === 'crypto' ? 'solid' : 'ghost'}
          onClick={() => onNavigate('crypto')}
        >
          <CubeIcon width="16" height="16" />
          Криптовалюты
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
