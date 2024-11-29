import React, { useState, useEffect } from 'react';
import { Theme, Container, Flex, Box, Button, Text, IconButton } from '@radix-ui/themes';
import {
  SunIcon,
  MoonIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  HomeIcon,
  CalendarIcon,
  DashboardIcon
} from '@radix-ui/react-icons';
import MainPage from './components/MainPage';
import CryptoPage from './components/CryptoPage';
import CurrencyPage from './components/CurrencyPage';
import SchedulePage from './components/SchedulePage';
import CommoditiesPage from './components/CommoditiesPage';
import GamesPage from './components/GamesPage';
import AdminPanel from './components/admin/AdminPanel';
import { ShiftProvider } from './context/ShiftContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import './App.css';

const queryClient = new QueryClient();

function NavButton({ icon, text, isActive, onClick, isMobile }) {
  return (
    <Button 
      variant={isActive ? "solid" : "ghost"} 
      onClick={onClick}
      size={isMobile ? "3" : "2"}
      style={{
        width: isMobile ? '100%' : 'auto',
        minWidth: isMobile ? 'auto' : '120px',
        height: isMobile ? '48px' : '36px',
        padding: isMobile ? '0 16px' : '0 12px',
        transition: 'all 0.2s ease',
      }}
    >
      <Flex 
        gap="2" 
        align="center" 
        justify={isMobile ? "flex-start" : "center"}
        style={{ width: '100%' }}
      >
        {React.cloneElement(icon, {
          width: isMobile ? "20" : "16",
          height: isMobile ? "20" : "16"
        })}
        <Text size={isMobile ? "2" : "1"}>{text}</Text>
      </Flex>
    </Button>
  );
}

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <Box
      onClick={() => setDarkMode(!darkMode)}
      style={{
        cursor: 'pointer',
        background: darkMode ? 'var(--gray-12)' : 'var(--gray-4)',
        borderRadius: '24px',
        width: '48px',
        height: '24px',
        position: 'relative',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '2px'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: darkMode ? 'var(--gray-1)' : 'white',
          transform: `translateX(${darkMode ? '24px' : '0'})`,
          transition: 'transform 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {darkMode ? (
          <MoonIcon style={{ color: 'var(--gray-12)' }} width="14" height="14" />
        ) : (
          <SunIcon style={{ color: 'var(--amber-9)' }} width="14" height="14" />
        )}
      </Box>
    </Box>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const renderNavigationButtons = () => (
    <>
      <NavButton
        icon={<HomeIcon />}
        text="Главная"
        isActive={currentPage === 'main'}
        onClick={() => {
          setCurrentPage('main');
        }}
        isMobile={false}
      />
      <NavButton
        icon={<CalendarIcon />}
        text="График смен"
        isActive={currentPage === 'schedule'}
        onClick={() => {
          setCurrentPage('schedule');
        }}
        isMobile={false}
      />
      <NavButton
        icon={<DashboardIcon />}
        text="Игры"
        isActive={currentPage === 'games'}
        onClick={() => {
          setCurrentPage('games');
        }}
        isMobile={false}
      />
      <NavButton
        icon={<DashboardIcon />}
        text="Admin Panel"
        isActive={currentPage === 'admin'}
        onClick={() => {
          setCurrentPage('admin');
        }}
        isMobile={false}
      />
      <NavButton
        icon={<DashboardIcon />}
        text="Crypto"
        isActive={currentPage === 'crypto'}
        onClick={() => {
          setCurrentPage('crypto');
        }}
        isMobile={false}
      />
      <NavButton
        icon={<DashboardIcon />}
        text="Currency"
        isActive={currentPage === 'currency'}
        onClick={() => {
          setCurrentPage('currency');
        }}
        isMobile={false}
      />
      <NavButton
        icon={<DashboardIcon />}
        text="Commodities"
        isActive={currentPage === 'commodities'}
        onClick={() => {
          setCurrentPage('commodities');
        }}
        isMobile={false}
      />
    </>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage />;
      case 'crypto':
        return <CryptoPage />;
      case 'currency':
        return <CurrencyPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'commodities':
        return <CommoditiesPage />;
      case 'games':
        return <GamesPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <MainPage />;
    }
  };

  return (
    <Router basename="/react-newapp">
      <QueryClientProvider client={queryClient}>
        <ShiftProvider>
          <Theme appearance={darkMode ? 'dark' : 'light'}>
            <Box style={{ minHeight: '100vh' }}>
              {/* Header */}
              <Box style={{ 
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'var(--color-background)',
                borderBottom: '1px solid var(--gray-5)'
              }}>
                <Container size="4">
                  {/* Desktop Navigation */}
                  <Flex className="desktop-nav" justify="between" align="center" py="3">
                    <Flex gap="2">
                      {renderNavigationButtons()}
                    </Flex>
                    <Flex gap="2" align="center">
                      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                    </Flex>
                  </Flex>
                </Container>
              </Box>

              {/* Main Content */}
              <Box style={{ 
                position: 'relative',
                zIndex: 1
              }}>
                <Routes>
                  <Route path="/" element={renderPage()} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/crypto" element={<CryptoPage />} />
                  <Route path="/currency" element={<CurrencyPage />} />
                  <Route path="/commodities" element={<CommoditiesPage />} />
                </Routes>
              </Box>
            </Box>
          </Theme>
        </ShiftProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
