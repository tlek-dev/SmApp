import React, { useEffect, useState } from 'react';
import { Card, Text, Flex, Box, Grid } from '@radix-ui/themes';
import { CalendarIcon, ClockIcon, StarIcon } from '@radix-ui/react-icons';
import { useShiftContext } from '../../context/ShiftContext';

const ShiftSchedule = () => {
  const { monthStats } = useShiftContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const styles = {
    card: {
      padding: isMobile ? '12px' : '16px',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '100%' : '400px'
    },
    label: {
      fontSize: isMobile ? '12px' : '13px',
      color: 'var(--gray-11)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.01em'
    },
    value: {
      fontSize: isMobile ? '13px' : '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.01em',
      fontWeight: 500
    },
    header: {
      fontSize: isMobile ? '14px' : '15px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '-0.01em',
      fontWeight: 600
    },
    icon: {
      width: isMobile ? '16px' : '18px',
      height: isMobile ? '16px' : '18px'
    },
    smallIcon: {
      width: isMobile ? '14px' : '16px',
      height: isMobile ? '14px' : '16px'
    }
  };

  return (
    <Card size="2" style={styles.card}>
      <Flex direction="column" gap={isMobile ? "2" : "3"}>
        <Flex align="center" gap="2">
          <CalendarIcon style={styles.icon} />
          <Text style={styles.header}>График работы</Text>
        </Flex>

        <Grid columns={isMobile ? "1" : "2"} gap={isMobile ? "2" : "3"}>
          <Box>
            <Text style={styles.label}>Рабочие часы</Text>
            <Flex align="center" gap="2" style={{ marginTop: isMobile ? '2px' : '4px' }}>
              <ClockIcon style={styles.smallIcon} />
              <Text style={styles.value}>
                Обычные: {monthStats.regularHours}
              </Text>
            </Flex>
            <Flex align="center" gap="2" style={{ marginTop: isMobile ? '2px' : '4px' }}>
              <StarIcon style={{ ...styles.smallIcon, color: 'var(--red-9)' }} />
              <Text style={{ ...styles.value, color: 'var(--red-9)' }}>
                Праздничные: {monthStats.holidayHours}
              </Text>
            </Flex>
          </Box>

          <Box>
            <Text style={styles.label}>Дни в месяце</Text>
            <Grid columns="1" gap={isMobile ? "1" : "2"} style={{ marginTop: isMobile ? '2px' : '4px' }}>
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

        <Box style={{ marginTop: isMobile ? '2px' : '4px' }}>
          <Text style={styles.label}>Всего часов за месяц</Text>
          <Text style={{ ...styles.header, fontSize: isMobile ? '15px' : '16px', marginTop: isMobile ? '2px' : '4px' }}>
            {monthStats.regularHours + monthStats.holidayHours}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default ShiftSchedule;
