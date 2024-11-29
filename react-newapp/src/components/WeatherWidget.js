import React, { useState, useEffect } from 'react';
import { Box, Card, Text, Flex } from '@radix-ui/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faMoon, faCloudSun, faCloudMoon, faCloud,
  faCloudShowersHeavy, faCloudSunRain, faCloudMoonRain,
  faBolt, faSnowflake, faSmog, faTint, faWind,
  faCompressArrowsAlt, faEye, faExclamationCircle,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

const weatherIcons = {
  '01d': faSun,           // ясно (день)
  '01n': faMoon,          // ясно (ночь)
  '02d': faCloudSun,      // малооблачно (день)
  '02n': faCloudMoon,     // малооблачно (ночь)
  '03d': faCloud,         // облачно
  '03n': faCloud,
  '04d': faCloud,         // пасмурно
  '04n': faCloud,
  '09d': faCloudShowersHeavy, // сильный дождь
  '09n': faCloudShowersHeavy,
  '10d': faCloudSunRain,  // дождь (день)
  '10n': faCloudMoonRain, // дождь (ночь)
  '11d': faBolt,          // гроза
  '11n': faBolt,
  '13d': faSnowflake,     // снег
  '13n': faSnowflake,
  '50d': faSmog,          // туман
  '50n': faSmog
};

const getWindDirection = (degrees) => {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Получение названия города по координатам
  const getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=d8c487d6cd0636dff09181c6e4e98776`
      );
      const data = await response.json();
      if (data && data[0]) {
        // Используем local_names.ru если доступно, иначе используем обычное name
        return data[0].local_names?.ru || data[0].name;
      }
      return 'Неизвестное местоположение';
    } catch (error) {
      console.error('Ошибка получения названия города:', error);
      return 'Неизвестное местоположение';
    }
  };

  // Получение погоды по координатам
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=d8c487d6cd0636dff09181c6e4e98776`
      );

      if (!response.ok) {
        throw new Error("Ошибка получения данных погоды");
      }

      const data = await response.json();
      
      // Получаем название города
      const cityName = await getLocationName(lat, lon);
      setLocationName(cityName);

      setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        windDirection: getWindDirection(data.wind.deg),
        pressure: Math.round(data.main.pressure * 0.750062),
        visibility: (data.visibility / 1000).toFixed(1)
      });
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Не удалось загрузить данные о погоде");
    } finally {
      setLoading(false);
    }
  };

  // Получение геолокации
  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим браузером");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error("Ошибка геолокации:", error);
        setError("Не удалось определить ваше местоположение. Проверьте, что у браузера есть доступ к геолокации.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getLocation();
    const interval = setInterval(getLocation, 60 * 60 * 1000); // Обновление каждый час
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Card>
        <Box p="4">
          <Flex align="center" gap="2" style={{ color: 'var(--red-9)' }}>
            <FontAwesomeIcon icon={faExclamationCircle} />
            <Text>{error}</Text>
          </Flex>
        </Box>
      </Card>
    );
  }

  if (!weather || loading) {
    return (
      <Card>
        <Box p="4">
          <Text>Определение местоположения...</Text>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box p="4">
        <Flex align="center" gap="2" mb="3">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <Text size="5" weight="bold">Погода в {locationName}</Text>
        </Flex>
        
        <Flex direction="column" gap="4">
          <Flex align="center" justify="between">
            <Flex align="center" gap="3">
              <Box style={{ fontSize: '2rem', color: 'var(--accent-9)' }}>
                <FontAwesomeIcon icon={weatherIcons[weather.icon] || faCloud} />
              </Box>
              <Box>
                <Text size="6" weight="bold">{weather.temp}°C</Text>
                <Text size="2" color="gray">Ощущается как {weather.feelsLike}°C</Text>
              </Box>
            </Flex>
            <Text style={{ textTransform: 'capitalize' }}>
              {weather.description}
            </Text>
          </Flex>

          <Flex gap="4">
            <Flex align="center" gap="2" style={{ flex: 1 }}>
              <FontAwesomeIcon icon={faTint} />
              <Box>
                <Text size="1" color="gray">Влажность</Text>
                <Text size="2">{weather.humidity}%</Text>
              </Box>
            </Flex>
            <Flex align="center" gap="2" style={{ flex: 1 }}>
              <FontAwesomeIcon icon={faWind} />
              <Box>
                <Text size="1" color="gray">Ветер</Text>
                <Text size="2">{weather.windSpeed} м/с {weather.windDirection}</Text>
              </Box>
            </Flex>
          </Flex>

          <Flex gap="4">
            <Flex align="center" gap="2" style={{ flex: 1 }}>
              <FontAwesomeIcon icon={faCompressArrowsAlt} />
              <Box>
                <Text size="1" color="gray">Давление</Text>
                <Text size="2">{weather.pressure} мм</Text>
              </Box>
            </Flex>
            <Flex align="center" gap="2" style={{ flex: 1 }}>
              <FontAwesomeIcon icon={faEye} />
              <Box>
                <Text size="1" color="gray">Видимость</Text>
                <Text size="2">{weather.visibility} км</Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
};

export default WeatherWidget;
