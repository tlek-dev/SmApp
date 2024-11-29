import React from 'react';
import { Card, Text, Flex, Box, Grid } from '@radix-ui/themes';
import { CalendarIcon, ClockIcon, StarIcon } from '@radix-ui/react-icons';
import { useShiftContext } from '../../context/ShiftContext';

const ShiftSchedule = () => {
  const { monthStats } = useShiftContext();

  const styles = {
    label: {
      fontSize: '13px',
      color: 'var(--gray-11)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.01em'
    },
    value: {
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.01em',
      fontWeight: 500
    },
    header: {
      fontSize: '15px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.01em',
      fontWeight: 600
    }
  };

  return (
    <Card size="2" style={{ padding: '16px' }}>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="2">
          <CalendarIcon width="18" height="18" />
          <Text style={styles.header}>График работы</Text>
        </Flex>

        <Grid columns="2" gap="3">
          <Box>
            <Text style={styles.label}>Рабочие часы</Text>
            <Flex align="center" gap="2" style={{ marginTop: '4px' }}>
              <ClockIcon width="16" height="16" />
              <Text style={styles.value}>
                Обычные: {monthStats.regularHours}
              </Text>
            </Flex>
            <Flex align="center" gap="2" style={{ marginTop: '4px' }}>
              <StarIcon width="16" height="16" style={{ color: 'var(--red-9)' }} />
              <Text style={{ ...styles.value, color: 'var(--red-9)' }}>
                Праздничные: {monthStats.holidayHours}
              </Text>
            </Flex>
          </Box>

          <Box>
            <Text style={styles.label}>Дни в месяце</Text>
            <Grid columns="1" gap="2" style={{ marginTop: '4px' }}>
              <Flex align="center" justify="between">
                <Text style={styles.value}>Рабочие:</Text>
                <Text style={styles.value}>{monthStats.workDays}</Text>
              </Flex>
              <Flex align="center" justify="between">
                <Text style={styles.value}>Выходные:</Text>
                <Text style={styles.value}>{monthStats.offDays}</Text>
              </Flex>
              <Flex align="center" justify="between">
                <Text style={{ ...styles.value, color: 'var(--red-9)' }}>Праздники:</Text>
                <Text style={{ ...styles.value, color: 'var(--red-9)' }}>{monthStats.holidays}</Text>
              </Flex>
            </Grid>
          </Box>
        </Grid>

        <Box style={{ marginTop: '4px' }}>
          <Text style={styles.label}>Всего часов за месяц</Text>
          <Text style={{ ...styles.header, fontSize: '16px', marginTop: '4px' }}>
            {monthStats.regularHours + monthStats.holidayHours}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default ShiftSchedule;
