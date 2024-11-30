import React from 'react';
import { Container, Flex } from '@radix-ui/themes';
import Tetris from './games/Tetris';

const GamesPage = () => {
  return (
    <Container>
      <Flex gap="4" style={{ padding: '20px' }}>
        {/* Игра Тетрис */}
        <div style={{ flex: 1 }}>
          <Tetris />
        </div>
      </Flex>
    </Container>
  );
};

export default GamesPage;
