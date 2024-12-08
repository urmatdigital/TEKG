'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Typography, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

export default function ReferralInfo() {
  const { user } = useAuth();

  const copyReferralLink = async () => {
    const referralLink = `https://t.me/tulparkgbot?start=${user?.client_code}`;
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
        Ваш код приглашения: <strong>{user.client_code || '-'}</strong>
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<ShareIcon />}
        onClick={copyReferralLink}
      >
        Скопировать ссылку
      </Button>
    </Card>
  );
}
