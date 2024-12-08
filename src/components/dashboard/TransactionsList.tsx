import React from 'react';
import { Transaction } from '../../types/dashboard';

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const fullName = (firstName: string | null, lastName: string | null) => 
    `${firstName || ''} ${lastName || ''}`.trim() || 'Без имени';

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">История начислений</h2>
      {transactions.length === 0 ? (
        <div className="text-gray-500">Нет данных о начислениях</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Реферер</th>
                <th className="px-4 py-2">Реферал</th>
                <th className="px-4 py-2">Сумма</th>
                <th className="px-4 py-2">Тип</th>
                <th className="px-4 py-2">Дата</th>
                <th className="px-4 py-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">
                    {fullName(transaction.referrer_first_name, transaction.referrer_last_name)}
                  </td>
                  <td className="px-4 py-2">
                    {fullName(transaction.referred_first_name, transaction.referred_last_name)}
                  </td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.type}</td>
                  <td className="px-4 py-2">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 