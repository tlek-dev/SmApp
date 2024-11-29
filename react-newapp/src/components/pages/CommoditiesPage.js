import React from 'react';
import { Container } from '@radix-ui/themes';
import CommoditiesWidget from '../widgets/CommoditiesWidget';

const CommoditiesPage = () => {
  return (
    <Container size="4">
      <CommoditiesWidget />
    </Container>
  );
};

export default CommoditiesPage;
