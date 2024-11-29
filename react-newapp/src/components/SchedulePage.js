import React from 'react';
import { Container, Box, Text, Card, Grid, Flex } from '@radix-ui/themes';
import { CalendarIcon } from '@radix-ui/react-icons';
import Calendar from './Calendar';
import SalaryCalculator from './SalaryCalculator';
import ManualSalaryCalculator from './ManualSalaryCalculator';

const SchedulePage = () => {
  return (
    <Container size="4" style={{ maxWidth: '1400px', padding: '16px' }}>
      <Grid columns="3" gap="4">
        <Box style={{ gridColumn: '1' }}>
          <Card size="2">
            <Flex direction="column" gap="4">
              <Flex align="center" gap="2" style={{ borderBottom: '1px solid var(--gray-5)', paddingBottom: '12px' }}>
                <CalendarIcon width="16" height="16" style={{ color: 'var(--accent-9)' }} />
                <Text size="2" weight="bold">График смен</Text>
              </Flex>
              <Box style={{ height: '600px' }}>
                <Calendar />
              </Box>
            </Flex>
          </Card>
        </Box>

        <Box style={{ gridColumn: '2 / 4' }}>
          <Grid columns="2" gap="4">
            <SalaryCalculator />
            <ManualSalaryCalculator />
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};

export default SchedulePage;
