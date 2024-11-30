import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Button, Flex, Card, Dialog, TextArea } from '@radix-ui/themes';
import { PlayIcon, PauseIcon, ResetIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';

// Константы
const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 400;
const GRID = 20;

// Цвета для фигур
const COLORS = {
  'I': '#00f0f0', // Голубой
  'O': '#f0f000', // Желтый
  'T': '#a000f0', // Фиолетовый
  'S': '#00f000', // Зеленый
  'Z': '#f00000', // Красный
  'J': '#0000f0', // Синий
  'L': '#f0a000'  // Оранжевый
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
  const [gameStarted, setGameStarted] = useState(false);
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
    color: null
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
    return {
      matrix: SHAPES[type],
      color: type,
      pos: { x: 0, y: 0 }
    };
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
          arena[y + player.pos.y][x + player.pos.x] = player.color;
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
    piece.current = {
      ...piece.current,
      matrix
    };
    
    while (collide(arena.current, piece.current)) {
      piece.current.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > piece.current.matrix[0].length) {
        piece.current = {
          ...piece.current,
          matrix: rotate(matrix),
          pos: { ...piece.current.pos, x: pos }
        };
        return;
      }
    }
  }

  function playerReset() {
    const pieces = 'ILJOTSZ';
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    piece.current = createPiece(type);
    
    // Центрируем фигуру по горизонтали
    piece.current.pos.x = Math.floor(arena.current[0].length / 2) - 
                         Math.floor(piece.current.matrix.length / 2);
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

  function handleGameOver() {
    setGameOver(true);
    setIsPaused(true);
    cancelAnimationFrame(requestRef.current);
  }

  function handleRestart() {
    setGameStarted(false);
    setIsPaused(false);
    setGameOver(false);
    arena.current = createMatrix(12, 20);
    setScore(0);
    dropCounter.current = 0;
    lastTime.current = 0;
    playerReset();
    draw();
  }

  function startGame() {
    setGameStarted(true);
    setIsPaused(false);
    setGameOver(false);
    arena.current = createMatrix(12, 20);
    setScore(0);
    dropCounter.current = 0;
    lastTime.current = 0;
    playerReset();
    draw();
    update();
  }

  function pauseGame() {
    if (!gameOver && gameStarted) {
      if (isPaused) {
        // Возобновляем игру
        setIsPaused(false);
        lastTime.current = 0;
        requestRef.current = requestAnimationFrame(update);
      } else {
        // Ставим на паузу
        setIsPaused(true);
        cancelAnimationFrame(requestRef.current);
      }
    }
  }

  function update(time = 0) {
    if (!isPaused && !gameOver && gameStarted) {
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

  function drawMatrix(matrix, offset, color) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.current.fillStyle = COLORS[color];
          ctx.current.fillRect(
            (x + offset.x) * GRID,
            (y + offset.y) * GRID,
            GRID - 1,
            GRID - 1
          );
          
          // Добавляем эффект блеска
          ctx.current.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.current.fillRect(
            (x + offset.x) * GRID,
            (y + offset.y) * GRID,
            GRID - 1,
            GRID / 2
          );
          
          // Добавляем тень
          ctx.current.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.current.fillRect(
            (x + offset.x) * GRID,
            (y + offset.y) * GRID + GRID / 2,
            GRID - 1,
            GRID / 2
          );
        }
      });
    });
  }

  function draw() {
    ctx.current.fillStyle = '#000';
    ctx.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Рисуем сетку
    ctx.current.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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

    // Рисуем арену
    arena.current.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.current.fillStyle = COLORS[value];
          ctx.current.fillRect(
            x * GRID,
            y * GRID,
            GRID - 1,
            GRID - 1
          );
          
          // Добавляем эффект блеска
          ctx.current.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.current.fillRect(
            x * GRID,
            y * GRID,
            GRID - 1,
            GRID / 2
          );
          
          // Добавляем тень
          ctx.current.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.current.fillRect(
            x * GRID,
            y * GRID + GRID / 2,
            GRID - 1,
            GRID / 2
          );
        }
      });
    });

    // Рисуем текущую фигуру
    drawMatrix(piece.current.matrix, piece.current.pos, piece.current.color);
  }

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

  useEffect(() => {
    if (!canvasRef.current) return;

    ctx.current = canvasRef.current.getContext('2d');
    
    // Инициализируем первую фигуру
    playerReset();
    draw();

    const handleKeyDown = (e) => {
      if (gameOver || !gameStarted) return;

      if (e.key === ' ') {
        pauseGame();
        return;
      }

      if (isPaused) return;

      if (e.key === 'ArrowLeft') {
        playerMove(-1);
      } else if (e.key === 'ArrowRight') {
        playerMove(1);
      } else if (e.key === 'ArrowDown') {
        playerDrop();
      } else if (e.key === 'ArrowUp') {
        playerRotate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameOver, isPaused, gameStarted]);

  useEffect(() => {
    if (!isPaused && !gameOver && gameStarted) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, gameOver, gameStarted]);

  return (
    <Card style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="6">🎮 Тетрис</Text>
          <Text size="6">Счет: {score}</Text>
        </Flex>

        <Flex gap="5" align="start">
          {/* Игровое поле */}
          <Box style={{ position: 'relative', flex: '1' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                border: '2px solid var(--gray-5)',
                backgroundColor: 'var(--gray-1)',
                borderRadius: '8px'
              }}
            />
            
            {gameOver && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="3"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              >
                <Text size="6" style={{ color: 'white' }}>Игра окончена!</Text>
                <Text size="4" style={{ color: 'white' }}>Счет: {score}</Text>
                <Button onClick={handleRestart}>
                  <ResetIcon /> Начать заново
                </Button>
              </Flex>
            )}
          </Box>

          {/* Джойстик и управление */}
          <Flex direction="column" gap="4" style={{ minWidth: '180px' }}>
            {/* Кнопки управления игрой */}
            <Flex gap="2" justify="between" wrap="wrap">
              <Button 
                onClick={startGame}
                disabled={gameStarted && !gameOver}
                style={{
                  width: '80px',
                  height: '40px',
                  background: 'var(--green-9)'
                }}
              >
                <PlayIcon />
                {gameOver ? 'Новая' : 'Старт'}
              </Button>
              <Button 
                onClick={pauseGame}
                disabled={!gameStarted || gameOver}
                style={{
                  width: '80px',
                  height: '40px',
                  background: isPaused ? 'var(--indigo-9)' : 'var(--violet-9)',
                  color: 'white',
                  fontWeight: 'bold',
                  opacity: (!gameStarted || gameOver) ? 0.5 : 1
                }}
              >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                {isPaused ? 'Играть' : 'Пауза'}
              </Button>
              <Button 
                onClick={handleRestart}
                style={{
                  width: '80px',
                  height: '40px',
                  background: 'var(--red-9)',
                  marginTop: '8px'
                }}
              >
                <ResetIcon /> Сброс
              </Button>
            </Flex>

            {/* Джойстик */}
            <Card style={{ 
              padding: '10px',
              background: 'var(--gray-3)',
              borderRadius: '12px',
              opacity: !gameStarted || isPaused || gameOver ? 0.5 : 1,
              pointerEvents: !gameStarted || isPaused || gameOver ? 'none' : 'auto'
            }}>
              {/* Верхняя кнопка (поворот) */}
              <Flex justify="center" mb="2">
                <Button 
                  onClick={playerRotate}
                  disabled={gameOver || isPaused || !gameStarted}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--blue-9)'
                  }}
                >
                  <ChevronUpIcon width="24" height="24" />
                </Button>
              </Flex>

              {/* Средний ряд (влево-вправо) */}
              <Flex justify="between" align="center" mb="2">
                <Button 
                  onClick={() => playerMove(-1)}
                  disabled={gameOver || isPaused || !gameStarted}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--blue-9)'
                  }}
                >
                  <ChevronLeftIcon width="24" height="24" />
                </Button>
                <Button 
                  onClick={() => playerMove(1)}
                  disabled={gameOver || isPaused || !gameStarted}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--blue-9)'
                  }}
                >
                  <ChevronRightIcon width="24" height="24" />
                </Button>
              </Flex>

              {/* Нижняя кнопка (вниз) */}
              <Flex justify="center">
                <Button 
                  onClick={playerDrop}
                  disabled={gameOver || isPaused || !gameStarted}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--blue-9)'
                  }}
                >
                  <ChevronDownIcon width="24" height="24" />
                </Button>
              </Flex>
            </Card>

            {/* Инструкции */}
            <Card style={{ 
              padding: '10px',
              background: 'var(--gray-3)',
              borderRadius: '8px',
              opacity: !gameStarted || isPaused || gameOver ? 0.5 : 1
            }}>
              <Text size="2" mb="2" weight="bold">Управление:</Text>
              <Text size="2">↑ Поворот фигуры</Text>
              <Text size="2">← → Движение</Text>
              <Text size="2">↓ Ускорить падение</Text>
              <Text size="2">Пробел: Пауза</Text>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Tetris;
