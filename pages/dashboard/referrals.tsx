import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Avatar, Table, Typography, Button, Statistic, Row, Col, message } from 'antd';
import { CopyOutlined, UserOutlined } from '@ant-design/icons';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

const { Title, Text } = Typography;

interface ReferralStats {
  totalReferrals: number;
  totalReferralBalance: number;
  totalCashbackBalance: number;
  referrals: Array<{
    user: {
      telegram_photo_url: string;
      telegram_username: string;
      telegram_first_name: string;
      telegram_last_name: string;
    };
    totalOrders: number;
    registrationDate: string;
  }>;
}

const ReferralsDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchReferralStats();
    }
  }, [session]);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/referrals/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      message.error('Ошибка при загрузке статистики рефералов');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!stats) return;
    const referralLink = `https://t.me/tekg_bot?start=ref_${session?.user?.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    message.success('Реферальная ссылка скопирована');
  };

  const columns = [
    {
      title: 'Фото',
      dataIndex: ['user', 'telegram_photo_url'],
      key: 'photo',
      render: (photo: string) => (
        <Avatar 
          size={40} 
          src={photo} 
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: 'Имя пользователя',
      key: 'name',
      render: (record: any) => (
        <div>
          <div>{`${record.user.telegram_first_name} ${record.user.telegram_last_name || ''}`}</div>
          {record.user.telegram_username && (
            <Text type="secondary">@{record.user.telegram_username}</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date: string) => (
        formatDistance(new Date(date), new Date(), { 
          addSuffix: true,
          locale: ru 
        })
      ),
    },
    {
      title: 'Количество заказов',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
  ];

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <Title level={2}>Реферальная программа</Title>
      
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Всего рефералов"
              value={stats?.totalReferrals || 0}
              suffix="чел."
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Реферальный баланс"
              value={stats?.totalReferralBalance || 0}
              suffix="сом"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Кешбэк баланс"
              value={stats?.totalCashbackBalance || 0}
              suffix="сом"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} className="mb-0">Ваша реферальная ссылка</Title>
          <Button 
            type="primary" 
            icon={<CopyOutlined />}
            onClick={copyReferralLink}
          >
            Копировать ссылку
          </Button>
        </div>
        <Text>
          За каждого приглашенного пользователя вы получаете 50 сом на реферальный счет.
          Дополнительно вы получаете 1% от суммы оплаченных услуг приглашенных пользователей
          и 2% кешбэка от своих оплаченных услуг.
        </Text>
      </Card>

      <Card title="Приглашенные пользователи">
        <Table
          columns={columns}
          dataSource={stats?.referrals || []}
          rowKey={(record) => record.user.telegram_username || record.registrationDate}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ReferralsDashboard;
