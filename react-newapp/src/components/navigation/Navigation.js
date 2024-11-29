import React from 'react';
import { Flex } from '@radix-ui/themes';
import Home from './Home';
import Crypto from './Crypto';
import Currency from './Currency';
import ShiftSchedule from './ShiftSchedule';
import Commodities from './Commodities';

const Navigation = () => {
  return (
    <Flex gap="4" align="center" className="navigation">
      <Home />
      <Crypto />
      <Currency />
      <ShiftSchedule />
      <Commodities />
    </Flex>
  );
};

export default Navigation;
