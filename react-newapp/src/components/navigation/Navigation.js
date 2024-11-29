import React from 'react';
import { Flex } from '@radix-ui/themes';
import Home from './Home';
import ShiftSchedule from './ShiftSchedule';

const Navigation = () => {
  return (
    <Flex gap="4" align="center" className="navigation">
      <Home />
      <ShiftSchedule />
    </Flex>
  );
};

export default Navigation;
