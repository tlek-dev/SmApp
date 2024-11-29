import React, { useState, useEffect } from 'react';
import { Box, Card, Text, Grid, Button, Flex, Badge, Tooltip } from '@radix-ui/themes';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  SunIcon,
  RocketIcon,
  LightningBoltIcon,
  StarIcon,
  TimerIcon,
  HeartIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { useShiftContext } from '../context/ShiftContext';

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const { getDayStatus } = useShiftContext();

  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const holidays = [
    { date: '01-01', name: "Новый год" },
    { date: '01-02', name: "Новый год" },
    { date: '03-08', name: "Международный женский день" },
    { date: '03-21', name: "Наурыз мейрамы" },
    { date: '03-22', name: "Наурыз мейрамы" },
    { date: '03-23', name: "Наурыз мейрамы" },
    { date: '05-01', name: "Праздник единства народа Казахстана" },
    { date: '05-07', name: "День защитника Отечества" },
    { date: '05-09', name: "День Победы" },
    { date: '06-28', name: "День журналистики" },
    { date: '07-06', name: "День Столицы" },
    { date: '08-30', name: "День Конституции" },
    { date: '12-16', name: "День независимости" },
  ];

  const getHolidayName = (date) => {
    const formattedDate = `${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
    const holiday = holidays.find((h) => h.date === formattedDate);
    return holiday ? holiday.name : null;
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return start === 0 ? 6 : start - 1;
  };

  const calculateHours = () => {
    const totalDays = daysInMonth(currentDate);
    let shiftCount = 0;

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const status = getDayStatus(date);
      if (status.type === 'workday') {
        shiftCount++;
      }
    }

    setMonthlyHours(shiftCount * 11);
  };

  useEffect(() => {
    calculateHours();
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1);
      return newDate;
    });
    setSelectedHoliday(null);
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1);
      return newDate;
    });
    setSelectedHoliday(null);
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDayClick = (date, holidayName) => {
    setSelectedHoliday(holidayName);
  };

  const getCellStyle = (day) => {
    if (!day) return {};

    const baseStyle = {
      padding: '8px',
      borderRadius: 'var(--radius-2)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid transparent',
    };

    if (day.isSelected) {
      return {
        ...baseStyle,
        backgroundColor: 'var(--accent-9)',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 0 0 2px var(--accent-7)'
      };
    }

    // Если день и рабочий, и праздничный одновременно
    if (day.isWorkday && day.isHoliday) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, var(--green-9) 50%, var(--red-9) 50%)',
        color: 'white',
        fontWeight: 'bold',
        border: '1px solid var(--gray-8)',
        '&:hover': {
          opacity: 0.9,
          border: '1px solid var(--gray-9)'
        }
      };
    }

    if (day.isHoliday) {
      return {
        ...baseStyle,
        backgroundColor: 'var(--red-9)',
        color: 'white',
        fontWeight: 'bold',
        border: '1px solid var(--red-10)',
        '&:hover': {
          backgroundColor: 'var(--red-10)',
          border: '1px solid var(--red-11)'
        }
      };
    }

    if (day.isWorkday) {
      return {
        ...baseStyle,
        backgroundColor: 'var(--green-9)',
        color: 'white',
        fontWeight: 'bold',
        border: '1px solid var(--green-10)',
        '&:hover': {
          backgroundColor: 'var(--green-10)',
          border: '1px solid var(--green-11)'
        }
      };
    }

    return {
      ...baseStyle,
      backgroundColor: 'var(--gray-2)',
      border: '1px solid var(--gray-4)',
      color: 'var(--gray-11)',
      '&:hover': {
        backgroundColor: 'var(--gray-3)',
        border: '1px solid var(--gray-5)'
      }
    };
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = startOfMonth(currentDate);

    for (let i = 0; i < startDay; i++) {
      days.push(
        <Box key={`empty-${i}`} style={{ 
          background: 'var(--gray-4)',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px'
        }}>
          <Text size="1" color="gray" style={{ visibility: 'hidden', fontSize: '11px' }}>
            00
          </Text>
        </Box>
      );
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isCurrentDay = isToday(date);
      const holidayName = getHolidayName(date);
      const status = getDayStatus(date);

      days.push(
        <Box
          key={day}
          style={{
            cursor: 'pointer',
            position: 'relative',
            background: 'var(--gray-4)',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px'
          }}
          onClick={() => handleDayClick(date, status.holidayName || null)}
        >
          <Tooltip content={status.holidayName || status.message}>
            <Card
              style={{
                ...getCellStyle(status),
                border: isCurrentDay ? '2px solid var(--accent-9)' : 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
            >
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="1"
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '2px'
                }}
              >
                <Text
                  size="1"
                  weight={status.type === 'workday' ? 'bold' : 'regular'}
                  style={{
                    color: status.type === 'holiday' ? 'var(--red-11)' : 
                          status.type === 'dayoff' ? 'var(--gray-11)' : 
                          'var(--gray-12)',
                    fontSize: '11px'
                  }}
                >
                  {day}
                </Text>
                {isCurrentDay && <StarIcon width="10" height="10" />}
                {holidayName && status.type !== 'workday' && <HeartIcon width="10" height="10" style={{ color: 'var(--gray-12)' }} />}
                {status.type === 'workday' && !holidayName && <RocketIcon width="10" height="10" style={{ color: 'var(--gray-12)' }} />}
              </Flex>
            </Card>
          </Tooltip>
        </Box>
      );
    }

    return days;
  };

  return (
    <Flex direction="column" gap="2" style={{ 
      background: 'var(--gray-4)', 
      padding: '8px', 
      borderRadius: 'var(--radius-3)',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <Flex justify="between" align="center" style={{ marginBottom: '4px' }}>
        <Flex direction="column" gap="1">
          <Flex align="center" gap="1">
            <TimerIcon width="20" height="20" />
            <Text size="3" weight="bold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </Flex>
          <Badge color="cyan" size="1">
            <Flex align="center" gap="1">
              <ClockIcon width="12" height="12" />
              {monthlyHours} часов в этом месяце
            </Flex>
          </Badge>
        </Flex>
        <Flex gap="1">
          <Button variant="soft" onClick={prevMonth} style={{ padding: '4px', minWidth: '28px' }}>
            <ChevronLeftIcon width="16" height="16" />
          </Button>
          <Button variant="soft" onClick={nextMonth} style={{ padding: '4px', minWidth: '28px' }}>
            <ChevronRightIcon width="16" height="16" />
          </Button>
        </Flex>
      </Flex>

      <Grid columns="7" gap="1" style={{ 
        background: 'var(--gray-4)',
        width: '100%',
        aspectRatio: '7/6'
      }}>
        {weekDays.map((day, index) => (
          <Box key={index} style={{ 
            background: 'var(--gray-4)',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px'
          }}>
            <Flex align="center" justify="center" gap="1">
              <SunIcon width="10" height="10" />
              <Text size="1" align="center" weight="bold" style={{ fontSize: '11px' }}>
                {day}
              </Text>
            </Flex>
          </Box>
        ))}
        {renderCalendar()}
      </Grid>

      <Flex gap="3" mt="4" justify="center">
        <Flex 
          align="center" 
          gap="2"
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--green-9)',
            borderRadius: 'var(--radius-2)',
          }}
        >
          <Box 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%',
              backgroundColor: 'white'
            }} 
          />
          <Text size="1" style={{ color: 'white' }}>Рабочий день</Text>
        </Flex>

        <Flex 
          align="center" 
          gap="2"
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--red-9)',
            borderRadius: 'var(--radius-2)',
          }}
        >
          <Box 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%',
              backgroundColor: 'white'
            }} 
          />
          <Text size="1" style={{ color: 'white' }}>Праздник</Text>
        </Flex>

        <Flex 
          align="center" 
          gap="2"
          style={{
            padding: '8px 12px',
            background: 'linear-gradient(135deg, var(--green-9) 50%, var(--red-9) 50%)',
            borderRadius: 'var(--radius-2)',
          }}
        >
          <Box 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%',
              backgroundColor: 'white'
            }} 
          />
          <Text size="1" style={{ color: 'white' }}>Праздничный рабочий</Text>
        </Flex>
      </Flex>

      {selectedHoliday && (
        <Box style={{ marginTop: '4px' }}>
          <Badge color="blue" size="1">
            <Flex align="center" gap="1">
              <ClockIcon width="12" height="12" />
              {selectedHoliday}
            </Flex>
          </Badge>
        </Box>
      )}
    </Flex>
  );
};

export default Calendar;
