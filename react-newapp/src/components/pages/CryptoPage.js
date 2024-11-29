import React from 'react';
import { Container } from '@radix-ui/themes';
import CryptoWidget from '../widgets/CryptoWidget';

const CryptoPage = () => {
  return (
    <Container size="4">
      <CryptoWidget />
    </Container>
  );
};

export default CryptoPage;
