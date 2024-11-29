import React, { useState, useEffect } from 'react';
import { Card, Text, Flex, Box, Grid, Separator } from '@radix-ui/themes';
import { PersonIcon, MinusIcon } from '@radix-ui/react-icons';

const ManualSalaryCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState('');
  const [regularHours, setRegularHours] = useState('');
  const [holidayHours, setHolidayHours] = useState('');
  const [grossSalary, setGrossSalary] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [regularPay, setRegularPay] = useState(0);
  const [holidayPay, setHolidayPay] = useState(0);

  useEffect(() => {
    const rate = hourlyRate === '' ? 0 : Number(hourlyRate);
    const regHours = regularHours === '' ? 0 : Number(regularHours);
    const holHours = holidayHours === '' ? 0 : Number(holidayHours);

    const regularPayAmount = rate * regHours;
    const holidayPayAmount = rate * 1.5 * holHours;
    const gross = regularPayAmount + holidayPayAmount;
    
    setRegularPay(regularPayAmount);
    setHolidayPay(holidayPayAmount);
    setGrossSalary(gross);

    const pensionDeduction = gross * 0.10;
    const taxDeduction = gross * 0.10;
    const unionDues = gross * 0.01;
    const net = gross - pensionDeduction - taxDeduction - unionDues;
    
    setNetSalary(net);
  }, [hourlyRate, regularHours, holidayHours]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('kk-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const InputField = ({ label, value, onChange, placeholder }) => (
    <Box>
      <Text as="label" size="1" weight="bold" style={{ color: 'var(--gray-11)', display: 'block', marginBottom: '4px' }}>
        {label}
      </Text>
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid var(--gray-6)',
          borderRadius: 'var(--radius-2)',
          fontSize: '14px',
          backgroundColor: 'var(--gray-2)',
          color: 'var(--gray-12)',
          transition: 'all 0.2s ease',
          outline: 'none',
          '&:focus': {
            borderColor: 'var(--accent-8)',
            boxShadow: '0 0 0 1px var(--accent-8)'
          }
        }}
      />
    </Box>
  );

  const StatBox = ({ label, value, highlight, size = "4" }) => (
    <Box 
      style={{ 
        padding: '12px',
        borderRadius: 'var(--radius-3)',
        backgroundColor: highlight ? 'var(--accent-3)' : 'var(--gray-3)',
        border: `1px solid ${highlight ? 'var(--accent-6)' : 'var(--gray-5)'}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Text size="1" style={{ color: highlight ? 'var(--accent-11)' : 'var(--gray-11)' }}>
        {label}
      </Text>
      <Text 
        size={size}
        weight="bold"
        style={{ 
          color: highlight ? 'var(--accent-9)' : 'var(--gray-12)',
          marginTop: '4px',
          wordBreak: 'break-word'
        }}
      >
        {value}
      </Text>
    </Box>
  );

  const DeductionBox = ({ label, amount }) => (
    <Box style={{ 
      padding: '8px',
      backgroundColor: 'var(--gray-3)',
      borderRadius: 'var(--radius-2)',
      border: '1px solid var(--gray-5)'
    }}>
      <Text size="1" style={{ color: 'var(--gray-11)' }}>{label}</Text>
      <Text size="2" weight="bold" style={{ color: 'var(--gray-12)', marginTop: '2px' }}>
        {formatCurrency(amount)}
      </Text>
    </Box>
  );

  return (
    <Card size="2" style={{ height: '100%' }}>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="2" style={{ borderBottom: '1px solid var(--gray-5)', paddingBottom: '8px' }}>
          <PersonIcon width="16" height="16" style={{ color: 'var(--accent-9)' }} />
          <Text size="2" weight="bold" style={{ color: 'var(--gray-12)' }}>
            Ручной расчет
          </Text>
        </Flex>

        <Grid columns="1" gap="3">
          <InputField
            label="Почасовая ставка (тенге)"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="Введите ставку"
          />
          
          <Grid columns="2" gap="3">
            <InputField
              label="Обычные часы"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
              placeholder="0"
            />
            <InputField
              label="Праздничные часы"
              value={holidayHours}
              onChange={(e) => setHolidayHours(e.target.value)}
              placeholder="0"
            />
          </Grid>
        </Grid>

        <Separator size="4" />

        <Grid columns="2" gap="3">
          <StatBox 
            label="Обычная оплата" 
            value={formatCurrency(regularPay)} 
          />
          <StatBox 
            label="Праздничная оплата" 
            value={formatCurrency(holidayPay)} 
          />
        </Grid>

        <Box>
          <Flex align="center" gap="2" style={{ marginBottom: '4px' }}>
            <MinusIcon width="14" height="14" />
            <Text size="1" weight="bold" style={{ color: 'var(--gray-11)' }}>Удержания</Text>
          </Flex>
          <Grid columns="3" gap="2">
            <DeductionBox label="Пенсионный (10%)" amount={grossSalary * 0.10} />
            <DeductionBox label="Налог (10%)" amount={grossSalary * 0.10} />
            <DeductionBox label="Профсоюз (1%)" amount={grossSalary * 0.01} />
          </Grid>
        </Box>

        <Grid columns="2" gap="3">
          <StatBox 
            label="Общий доход" 
            value={formatCurrency(grossSalary)} 
          />
          <StatBox 
            label="К выплате" 
            value={formatCurrency(netSalary)} 
            highlight={true}
          />
        </Grid>
      </Flex>
    </Card>
  );
};

export default ManualSalaryCalculator;
