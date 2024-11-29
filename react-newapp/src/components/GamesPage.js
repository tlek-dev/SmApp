import React, { useState, useEffect, useCallback } from 'react';
import { Container, Flex, Card, Text, Table } from '@radix-ui/themes';
import Tetris from './games/Tetris';

const GamesPage = () => {
  const [highScores, setHighScores] = useState([]);
  const [error, setError] = useState(null);

  const loadHighScores = useCallback(async () => {
    try {
      // Добавляем параметры сортировки в URL
      const response = await fetch('http://localhost:3005/api/scores?sortBy=score&sortOrder=desc');
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const data = await response.json();
      setHighScores(data.scores || []); // Extract scores array from response
    } catch (err) {
      console.error('Error loading scores:', err);
      setError('Failed to load high scores');
    }
  }, []);

  useEffect(() => {
    loadHighScores();
    const interval = setInterval(loadHighScores, 5000);
    return () => clearInterval(interval);
  }, [loadHighScores]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Flex gap="4" style={{ padding: '20px' }}>
        {/* Игра Тетрис */}
        <div style={{ flex: 1 }}>
          <Tetris onGameOver={loadHighScores} />
        </div>

        {/* Таблица рекордов */}
        <Card style={{ width: '400px', height: 'fit-content' }}>
          <Text size="5" weight="bold" style={{ marginBottom: '16px' }}>🏆 Таблица рекордов</Text>
          {error && <Text color="red">{error}</Text>}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Место</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Игрок</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Очки</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Дата</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {highScores && highScores.map((score, index) => (
                <Table.Row key={score.id}>
                  <Table.Cell>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                  </Table.Cell>
                  <Table.Cell>{score.nickname}</Table.Cell>
                  <Table.Cell>{score.score}</Table.Cell>
                  <Table.Cell>{formatDate(score.date)}</Table.Cell>
                </Table.Row>
              ))}
              {(!highScores || highScores.length === 0) && (
                <Table.Row>
                  <Table.Cell colSpan="4" style={{ textAlign: 'center' }}>
                    Пока нет рекордов
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Card>
      </Flex>
    </Container>
  );
};

export default GamesPage;
