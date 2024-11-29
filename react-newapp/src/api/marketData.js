// Функция для получения данных о сырьевых товарах
export const fetchCommoditiesData = async () => {
  // Здесь можно добавить реальный API-запрос
  const mockData = {
    data: [
      {
        id: 'oil',
        name: 'Нефть',
        price: 85.30,
        change: 1.2,
        icon: '🛢️'
      },
      {
        id: 'gold',
        name: 'Золото',
        price: 1950.75,
        change: 0.8,
        icon: '🥇'
      },
      {
        id: 'silver',
        name: 'Серебро',
        price: 23.45,
        change: -0.5,
        icon: '🥈'
      },
      {
        id: 'copper',
        name: 'Медь',
        price: 3.85,
        change: 0.3,
        icon: '🔶'
      },
      {
        id: 'gas',
        name: 'Природный газ',
        price: 2.75,
        change: -0.7,
        icon: '⛽'
      }
    ],
    lastUpdated: new Date().toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  return mockData;
};

// Функция для конвертации в тенге
export const convertToKZT = (usdAmount) => {
  const usdToKZT = 450; // Примерный курс
  return (usdAmount * usdToKZT).toFixed(2);
};
