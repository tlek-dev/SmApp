import React from 'react';
import { Card, Text, Box, Flex, ScrollArea } from '@radix-ui/themes';
import { ReaderIcon } from '@radix-ui/react-icons';

const NewsWidget = () => {
  // Здесь можно подключить реальное API новостей
  const news = [
    {
      id: 1,
      title: 'ФРС сохранила ключевую ставку',
      category: 'Экономика',
      time: '2 часа назад'
    },
    {
      id: 2,
      title: 'Нефть Brent превысила $80 за баррель',
      category: 'Сырье',
      time: '3 часа назад'
    },
    {
      id: 3,
      title: 'Криптовалютный рынок показывает рост',
      category: 'Крипто',
      time: '4 часа назад'
    },
    {
      id: 4,
      title: 'Золото достигло нового максимума',
      category: 'Металлы',
      time: '5 часов назад'
    }
  ];

  return (
    <Card size="2">
      <Box p="4">
        <Flex align="center" gap="2" mb="4">
          <ReaderIcon width="24" height="24" />
          <Text size="6" weight="bold">
            Новости рынка
          </Text>
        </Flex>
        <ScrollArea scrollbars="vertical" style={{ height: '300px' }}>
          <Flex direction="column" gap="3">
            {news.map((item) => (
              <Card key={item.id} variant="surface">
                <Box p="3">
                  <Flex justify="between" mb="2">
                    <Text size="2" color="gray">
                      {item.category}
                    </Text>
                    <Text size="2" color="gray">
                      {item.time}
                    </Text>
                  </Flex>
                  <Text size="3">{item.title}</Text>
                </Box>
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      </Box>
    </Card>
  );
};

export default NewsWidget;
