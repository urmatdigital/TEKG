import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Метод не поддерживается' });
  }

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const userId = session.user.id;

    // Получаем информацию о пользователе с его рефералами
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          select: {
            telegram_photo_url: true,
            telegram_username: true,
            telegram_first_name: true,
            telegram_last_name: true,
            created_at: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получаем количество заказов для каждого реферала
    const referralsWithOrders = await Promise.all(
      user.referrals.map(async (referral) => {
        const ordersCount = await prisma.order.count({
          where: { userId: referral.id }
        });

        return {
          user: {
            telegram_photo_url: referral.telegram_photo_url,
            telegram_username: referral.telegram_username,
            telegram_first_name: referral.telegram_first_name,
            telegram_last_name: referral.telegram_last_name,
          },
          totalOrders: ordersCount,
          registrationDate: referral.created_at,
        };
      })
    );

    const stats = {
      totalReferrals: user.referrals.length,
      totalReferralBalance: user.referral_balance,
      totalCashbackBalance: user.cashback_balance,
      referrals: referralsWithOrders,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
