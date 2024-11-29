import React from 'react';
import { Container, Flex } from '@radix-ui/themes';
import CurrencyWidget from '../widgets/CurrencyWidget';
import CurrencyCalculator from '../CurrencyCalculator';

const CurrencyPage = () => {
  return (
    <Container size="4">
      <Flex direction="column" gap="4">
        <CurrencyWidget />
        <CurrencyCalculator />
      </Flex>
    </Container>
  );
};

export default CurrencyPage;
