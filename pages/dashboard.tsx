import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import { Profile, AdminDashboardData } from '../types/dashboard';
import { DeleteAccountModal } from '../components/dashboard/DeleteAccountModal';
import { ReferralsList } from '../components/dashboard/ReferralsList';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { LoadingState } from '../components/dashboard/LoadingState';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Dashboard() {
  const router = useRouter();
  const { transactions, referrals, loading, error, retryCount, fetchData } = useDashboardData();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          // Проверяем роль пользователя
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile?.role === 'admin') {
            setIsAdmin(true);
            // Загружаем данные для админа
            const { data: adminStats, error: statsError } = await supabase
              .rpc('get_admin_stats');
            
            if (statsError) throw statsError;
            setAdminData(adminStats);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Показываем загрузку при проверке авторизации
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState retryCount={0} maxRetries={3} />
      </div>
    );
  }

  // Показываем состояние загрузки данных
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState retryCount={retryCount} maxRetries={3} />
      </div>
    );
  }

  // Показываем ошибку, если она есть
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="text-red-700 mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="w-full px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">
            {isAdmin ? 'Панель администратора' : 'Панель управления'}
          </h1>
          
          {isAdmin && adminData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Всего пользователей</h3>
                <p className="text-2xl font-bold text-blue-900">{adminData.totalUsers}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Всего рефералов</h3>
                <p className="text-2xl font-bold text-green-900">{adminData.totalReferrals}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Всего транзакций</h3>
                <p className="text-2xl font-bold text-purple-900">{adminData.totalTransactions}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Общий заработок</h3>
                <p className="text-2xl font-bold text-yellow-900">{adminData.totalEarnings}</p>
              </div>
            </div>
          )}

          <ReferralsList referrals={referrals} />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <TransactionsList transactions={transactions} />
        </div>
        
        {!isAdmin && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Опасная зона</h2>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Удалить аккаунт
            </button>
          </div>
        )}

        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          isDeleting={isDeleting}
          deleteError={deleteError}
        />
      </div>
    </div>
  );
} 