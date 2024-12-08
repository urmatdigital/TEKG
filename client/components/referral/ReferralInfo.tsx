'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Typography, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

export default function ReferralInfo() {
  const { user } = useAuth();

  const copyReferralLink = async () => {
    const referralLink = `https://t.me/tulparkgbot?start=${user?.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      alert('Реферальная ссылка скопирована!');
    } catch (err) {
      console.error('Ошибка при копировании ссылки:', err);
      alert('Не удалось скопировать ссылку');
    }
  };

  if (!user) return null;

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Реферальная программа
      </Typography>
      
      <Typography variant="body1" paragraph>
        Ваш реферальный код: <strong>{user.referralCode}</strong>
      </Typography>
      
      <Typography variant="body1" paragraph>
        Баланс реферальных бонусов: <strong>{user.referralBalance} ₸</strong>
      </Typography>
      
      <Typography variant="body1" paragraph>
        Кэшбэк баланс: <strong>{user.cashbackBalance} ₸</strong>
      </Typography>

      <Button
        variant="contained"
        startIcon={<ShareIcon />}
        onClick={copyReferralLink}
      >
        Скопировать реферальную ссылку
      </Button>
    </Card>
  );
}
