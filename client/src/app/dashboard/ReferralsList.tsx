'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaUser, FaCalendar, FaShoppingBag, FaCoins } from 'react-icons/fa'
import { User } from '@supabase/supabase-js'
import { formatPhoneNumber } from '@/utils/phone'

interface ReferralTransaction {
  id: string
  amount: number
  type: string
  created_at: string
}

interface Referral {
  id: string
  full_name: string
  username: string
  phone: string
  client_code: string
  photo_url?: string
  created_at: string
  total_orders: number
  total_earnings: number
  status: string
  transactions: ReferralTransaction[]
}

export default function ReferralsList() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем текущего пользователя
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Получаем профиль пользователя
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('telegram_id', user.user_metadata.telegram_id)
          .single()

        if (!profile) return

        // Получаем список рефералов
        const { data: referralsData } = await supabase
          .from('profiles')
          .select('*')
          .eq('referred_by', profile.id)
          .order('created_at', { ascending: false })

        if (!referralsData) {
          setReferrals([])
          setLoading(false)
          return
        }

        // Получаем транзакции для каждого реферала
        const { data: transactionsData } = await supabase
          .from('referral_transactions_view')
          .select('*')
          .in('referred_id', referralsData.map(r => r.id))
          .order('created_at', { ascending: false })

        // Объединяем данные
        const referralsWithTransactions = referralsData.map(referral => ({
          ...referral,
          transactions: transactionsData?.filter(t => t.referred_id === referral.id) || []
        }))

        setReferrals(referralsWithTransactions)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Подписываемся на изменения
    const channel = supabase
      .channel('referrals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchData() // Обновляем данные при любых изменениях
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div className="text-center py-4">Загрузка...</div>
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Приглашенные пользователи ({referrals.length})
        </h3>
      </div>

      {referrals.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          У вас пока нет приглашенных пользователей
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {referrals.map((referral) => (
            <div key={referral.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {referral.photo_url ? (
                    <img 
                      src={referral.photo_url} 
                      alt="" 
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {referral.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPhoneNumber(referral.phone)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-sm text-gray-500">
                    <FaCalendar className="inline-block mr-1" />
                    {new Date(referral.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    <FaShoppingBag className="inline-block mr-1" />
                    {referral.total_orders || 0} заказов
                  </div>
                  <div className="text-sm text-gray-500">
                    <FaCoins className="inline-block mr-1" />
                    {referral.total_earnings || 0} сом
                  </div>
                </div>
              </div>

              {referral.transactions.length > 0 && (
                <div className="mt-4 pl-14">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    История начислений:
                  </div>
                  <div className="space-y-1">
                    {referral.transactions.map(tx => (
                      <div key={tx.id} className="text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()}: +{tx.amount} сом ({tx.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}