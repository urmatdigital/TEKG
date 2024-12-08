import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Referral, Transaction } from '../types/dashboard';

export function useDashboardData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError('Не авторизован');
        return;
      }

      // Получаем рефералов
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', session.user.id);

      if (referralsError) throw referralsError;

      // Получаем транзакции
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      setReferrals(referralsData || []);
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Ошибка при загрузке данных');
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    transactions,
    referrals,
    loading,
    error,
    retryCount,
    fetchData,
  };
} 