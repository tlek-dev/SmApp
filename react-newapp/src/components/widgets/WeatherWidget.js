import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Flex, Button } from '@radix-ui/themes';
import { SunIcon, MoonIcon, CloudIcon, UpdateIcon } from '@radix-ui/react-icons';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Замените на ваш API ключ
const ALMATY_COORDS = { lat: 43.2567, lon: 76.9286 };

const getWeatherIcon = (code, isNight) => {
  // Коды погоды OpenWeatherMap: https://openweathermap.org/weather-conditions
  if (code >= 200 && code < 300) return '⛈️'; // Гроза
  if (code >= 300 && code < 400) return '🌧️'; // Морось
  if (code >= 500 && code < 600) return '🌧️'; // Дождь
  if (code >= 600 && code < 700) return '🌨️'; // Снег
  if (code >= 700 && code < 800) return '🌫️'; // Туман и другие
  if (code === 800) return isNight ? '🌙' : '☀️'; // Ясно
  if (code > 800) return '☁️'; // Облачно
  return '❓';
};

const formatTemp = (temp) => {
  return Math.round(temp) + '°';
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${ALMATY_COORDS.lat}&lon=${ALMATY_COORDS.lon}&appid=${API_KEY}&units=metric&lang=ru`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      // Проверяем, день или ночь
      const now = new Date();
      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);
      const isNight = now < sunrise || now > sunset;

      setWeather({
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].id, isNight),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        isNight
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Обновляем погоду каждые 30 минут
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card size="2" style={{ width: '100%', backgroundColor: 'var(--color-page-background)', border: '1px solid var(--gray-4)' }}>
        <Flex align="center" justify="center" style={{ height: '120px' }}>
          <Text>Загрузка погоды...</Text>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card size="2" style={{ width: '100%', backgroundColor: 'var(--color-page-background)', border: '1px solid var(--gray-4)' }}>
        <Flex align="center" justify="center" style={{ height: '120px' }}>
          <Text color="red">Ошибка загрузки погоды</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="2" style={{ width: '100%', backgroundColor: 'var(--color-page-background)', border: '1px solid var(--gray-4)' }}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            {weather?.isNight ? <MoonIcon width="16" height="16" /> : <SunIcon width="16" height="16" />}
            <Text size="2" weight="bold">Погода в Алматы</Text>
          </Flex>
          <Button variant="ghost" onClick={fetchWeather}>
            <UpdateIcon width="16" height="16" />
          </Button>
        </Flex>

        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <Text style={{ fontSize: '32px' }}>{weather?.icon}</Text>
            <Box>
              <Text size="6" weight="bold">{formatTemp(weather?.temp)}</Text>
              <Text size="2" color="gray">Ощущается как {formatTemp(weather?.feels_like)}</Text>
            </Box>
          </Flex>
          <Box>
            <Text size="2" style={{ textTransform: 'capitalize' }}>{weather?.description}</Text>
            <Text size="2" color="gray">💨 {Math.round(weather?.wind_speed)} м/с</Text>
            <Text size="2" color="gray">💧 {weather?.humidity}%</Text>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
};

export default WeatherWidget;
