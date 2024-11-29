import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Button, Flex, Card, Dialog, TextArea } from '@radix-ui/themes';
import { PlayIcon, PauseIcon, ResetIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';

// Константы
const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 400;
const GRID = 20;

// Цвета для фигур
const COLORS = {
  'I': '#00f0f0',
  'O': '#f0f000',
  'T': '#a000f0',
  'S': '#00f000',
  'Z': '#f00000',
  'J': '#0000f0',
  'L': '#f0a000'
};

// Фигуры Тетриса
const SHAPES = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'O': [
    [1, 1],
    [1, 1],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const Tetris = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState(null);
  const requestRef = useRef(null);
  const dropCounter = useRef(0);
  const dropInterval = useRef(1000);
  const lastTime = useRef(0);
  const ctx = useRef(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const minSwipeDistance = 30; // минимальное расстояние для свайпа
  
  const piece = useRef({
    pos: { x: 0, y: 0 },
    matrix: null,
  });
  
  const arena = useRef(createMatrix(12, 20));

  function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }

  function createPiece(type) {
    return SHAPES[type];
  }

  function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (arena[y + o.y] &&
            arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  function merge(arena, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  function rotate(matrix) {
    const N = matrix.length;
    const rotated = Array.from({ length: N }, () => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[i][j] = matrix[N - 1 - j][i];
      }
    }
    return rotated;
  }

  function playerDrop() {
    piece.current.pos.y++;
    if (collide(arena.current, piece.current)) {
      piece.current.pos.y--;
      merge(arena.current, piece.current);
      playerReset();
      arenaSweep();
      dropCounter.current = 0;
    }
    dropCounter.current = 0;
  }

  function playerMove(dir) {
    piece.current.pos.x += dir;
    if (collide(arena.current, piece.current)) {
      piece.current.pos.x -= dir;
    }
  }

  function playerRotate() {
    const pos = piece.current.pos.x;
    let offset = 1;
    const matrix = rotate(piece.current.matrix);
    piece.current.matrix = matrix;
    
    while (collide(arena.current, piece.current)) {
      piece.current.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > piece.current.matrix[0].length) {
        piece.current.matrix = matrix;
        piece.current.pos.x = pos;
        return;
      }
    }
  }

  function playerReset() {
    const pieces = 'ILJOTSZ';
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    piece.current = {
      pos: { x: 0, y: 0 },
      matrix: createPiece(type),
    };
    
    // Центрируем фигуру по горизонтали
    piece.current.pos.x = Math.floor(arena.current[0].length / 2) - 
                         Math.floor(piece.current.matrix[0].length / 2);
    piece.current.pos.y = 0;

    // Проверяем столкновение
    if (collide(arena.current, piece.current)) {
      handleGameOver();
    }
  }

  function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.current.length - 1; y > 0; --y) {
      for (let x = 0; x < arena.current[y].length; ++x) {
        if (arena.current[y][x] === 0) {
          continue outer;
        }
      }
      const row = arena.current.splice(y, 1)[0].fill(0);
      arena.current.unshift(row);
      ++y;
      setScore(prev => prev + rowCount * 10);
      rowCount *= 2;
    }
  }

  function startGame() {
    if (nickname) {
      setShowNicknameDialog(false);
      setIsPaused(false);
      setGameOver(false);
      
      // Очищаем арену
      arena.current = createMatrix(12, 20);
      
      // Сбрасываем счет и счетчики
      setScore(0);
      dropCounter.current = 0;
      lastTime.current = 0;
      
      // Создаем первую фигуру
      playerReset();
      
      // Запускаем игровой цикл
      draw();
      update();
    }
  };

  function update(time = 0) {
    if (!isPaused && !gameOver) {
      const deltaTime = time - lastTime.current;
      lastTime.current = time;
      dropCounter.current += deltaTime;
      
      if (dropCounter.current > dropInterval.current) {
        playerDrop();
        dropCounter.current = 0;
      }
      
      draw();
      requestRef.current = requestAnimationFrame(update);
    }
  };

  const draw = () => {
    if (!canvasRef.current || !ctx.current) return;
    
    // Очищаем канвас
    ctx.current.fillStyle = '#000';
    ctx.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Рисуем сетку
    ctx.current.strokeStyle = '#333';
    for (let i = 0; i < CANVAS_WIDTH; i += GRID) {
      ctx.current.beginPath();
      ctx.current.moveTo(i, 0);
      ctx.current.lineTo(i, CANVAS_HEIGHT);
      ctx.current.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += GRID) {
      ctx.current.beginPath();
      ctx.current.moveTo(0, i);
      ctx.current.lineTo(CANVAS_WIDTH, i);
      ctx.current.stroke();
    }

    // Рисуем арену и текущую фигуру
    drawMatrix(arena.current, { x: 0, y: 0 });
    if (piece.current.matrix) {
      drawMatrix(piece.current.matrix, piece.current.pos);
    }
  };

  const drawMatrix = (matrix, offset) => {
    if (!ctx.current) return;
    
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.current.fillStyle = COLORS[value] || '#fff';
          ctx.current.fillRect(
            (x + offset.x) * GRID,
            (y + offset.y) * GRID,
            GRID - 1,
            GRID - 1
          );
        }
      });
    });
  };

  const handleTouchStart = (e) => {
    if (isPaused || gameOver) return;
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTouchMove = (e) => {
    if (isPaused || gameOver) return;
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTouchEnd = () => {
    if (isPaused || gameOver) return;
    
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    
    // Определяем направление свайпа
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Горизонтальный свайп
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          playerMove(1); // Вправо
        } else {
          playerMove(-1); // Влево
        }
      }
    } else {
      // Вертикальный свайп
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          // Свайп вниз - быстрое падение
          while (!collide(arena.current, piece.current)) {
            piece.current.pos.y++;
          }
          piece.current.pos.y--;
          merge(arena.current, piece.current);
          playerReset();
          arenaSweep();
          dropCounter.current = 0;
        } else {
          // Свайп вверх - поворот
          playerRotate();
        }
      }
    }
    draw();
  };

  const loadHighScores = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/scores');
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const scores = await response.json();
      // Removed setHighScores(scores);
    } catch (err) {
      console.error('Error loading scores:', err);
      setError('Failed to load high scores');
    }
  };

  const saveScore = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          score,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }
    } catch (err) {
      console.error('Error saving score:', err);
      setError('Failed to save score');
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsPaused(true);
    if (nickname && score > 0) {
      saveScore();
    }
  };

  const resetGame = () => {
    // Очищаем арену
    arena.current = createMatrix(12, 20);
    
    // Сбрасываем состояние игры
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
    
    // Сбрасываем счетчики
    dropCounter.current = 0;
    lastTime.current = 0;
    
    // Создаем новую фигуру
    playerReset();
    
    // Перерисовываем игру
    draw();
  };

  useEffect(() => {
    // Removed loadHighScores();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    ctx.current = canvasRef.current.getContext('2d');
    canvasRef.current.width = CANVAS_WIDTH;
    canvasRef.current.height = CANVAS_HEIGHT;

    // Добавляем обработчики touch событий
    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    playerReset();
    draw();

    const handleKeyDown = (e) => {
      if (isPaused || gameOver) return;

      switch(e.keyCode) {
        case 37: // Left
          playerMove(-1);
          break;
        case 39: // Right
          playerMove(1);
          break;
        case 40: // Down
          playerDrop();
          break;
        case 38: // Up
          playerRotate();
          break;
        case 32: // Space
          while (!collide(arena.current, piece.current)) {
            piece.current.pos.y++;
          }
          piece.current.pos.y--;
          merge(arena.current, piece.current);
          playerReset();
          arenaSweep();
          dropCounter.current = 0;
          break;
      }
      draw();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, gameOver]);

  return (
    <Card>
      <Flex direction="column" gap="4" align="center" p="4">
        <Text size="5" weight="bold">Тетрис</Text>
        <Flex gap="4" align="center">
          <Text size="4" weight="medium">Счет: {score}</Text>
          <Button 
            onClick={() => {
              if (!gameOver) {
                if (isPaused) {
                  setShowNicknameDialog(true);
                } else {
                  setIsPaused(true);
                }
              }
            }}
            disabled={gameOver}
            variant="soft"
          >
            {isPaused ? <PlayIcon width="16" height="16" /> : <PauseIcon width="16" height="16" />}
          </Button>
          <Button onClick={resetGame} variant="soft">
            <ResetIcon width="16" height="16" />
          </Button>
        </Flex>

        <Dialog.Root open={showNicknameDialog} onOpenChange={setShowNicknameDialog}>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Введите ваш никнейм</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Ваш никнейм будет использован для сохранения рекордов.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <TextArea 
                placeholder="Введите никнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ height: '40px' }}
              />
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Отмена
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button onClick={startGame} disabled={!nickname}>
                  Начать игру
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        <Box 
          style={{ 
            border: '2px solid var(--gray-6)', 
            borderRadius: 'var(--radius-3)',
            background: '#000',
            padding: '2px',
            touchAction: 'none'
          }}
        >
          <canvas ref={canvasRef} />
        </Box>
        
        {/* Touch Controls */}
        <Flex direction="column" gap="2" align="center" style={{ marginTop: '16px' }}>
          <Button 
            size="3" 
            onClick={() => !isPaused && !gameOver && playerRotate()} 
            variant="soft"
            style={{ width: '60px', height: '60px' }}
          >
            <ChevronUpIcon width="24" height="24" />
          </Button>
          <Flex gap="2" align="center">
            <Button 
              size="3" 
              onClick={() => !isPaused && !gameOver && playerMove(-1)} 
              variant="soft"
              style={{ width: '60px', height: '60px' }}
            >
              <ChevronLeftIcon width="24" height="24" />
            </Button>
            <Button 
              size="3" 
              onClick={() => !isPaused && !gameOver && playerDrop()} 
              variant="soft"
              style={{ width: '60px', height: '60px' }}
            >
              <ChevronDownIcon width="24" height="24" />
            </Button>
            <Button 
              size="3" 
              onClick={() => !isPaused && !gameOver && playerMove(1)} 
              variant="soft"
              style={{ width: '60px', height: '60px' }}
            >
              <ChevronRightIcon width="24" height="24" />
            </Button>
          </Flex>
          <Button 
            size="3" 
            onClick={() => {
              if (isPaused || gameOver) return;
              while (!collide(arena.current, piece.current)) {
                piece.current.pos.y++;
              }
              piece.current.pos.y--;
              merge(arena.current, piece.current);
              playerReset();
              arenaSweep();
              dropCounter.current = 0;
              draw();
            }} 
            variant="soft"
            style={{ width: '180px', height: '40px' }}
          >
            Сброс
          </Button>
        </Flex>

        {gameOver && (
          <Text size="6" color="red" weight="bold">Игра окончена!</Text>
        )}
        {isPaused && !gameOver && (
          <Text size="4">Нажмите Play чтобы начать</Text>
        )}
        <Box>
          <Text size="3" weight="medium">Управление:</Text>
          <Text size="2">← → : Движение влево/вправо</Text>
          <Text size="2">↑ : Поворот</Text>
          <Text size="2">↓ : Ускорить падение</Text>
          <Text size="2">Пробел : Мгновенное падение</Text>
          <Text size="2">Свайп: Управление на мобильных устройствах</Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default Tetris;
