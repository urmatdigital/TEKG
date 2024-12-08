'use client';

import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useRouter } from 'next/navigation';

export default function TelegramLogin() {
  const { loginWithTelegram } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleTelegramLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Открываем Telegram бота в новом окне
      window.open('https://t.me/tekg_bot?start=auth', '_blank');
      
      // Показываем инструкции пользователю
      setError('Пожалуйста, авторизуйтесь в Telegram и вернитесь на эту страницу');
    } catch (err) {
      setError('Произошла ошибка при подключении к Telegram');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <Button
        variant="contained"
        onClick={handleTelegramLogin}
        disabled={isLoading}
        startIcon={<TelegramIcon />}
        fullWidth
        sx={{
          bgcolor: '#0088cc',
          '&:hover': {
            bgcolor: '#006699'
          }
        }}
      >
        {isLoading ? 'Подключение...' : 'Войти через Telegram'}
      </Button>

      {error && (
        <Typography 
          color={error.includes('Пожалуйста, авторизуйтесь') ? 'primary' : 'error'} 
          variant="body2" 
          align="center"
        >
          {error}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary" align="center">
        При входе через Telegram вы соглашаетесь с условиями использования сервиса
      </Typography>
    </Box>
  );
}
