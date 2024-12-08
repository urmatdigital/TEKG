import { Transaction } from '../../types/dashboard';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (!transactions?.length) {
    return <div className="text-gray-500">Нет транзакций</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Транзакции</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="border rounded p-4">
            <div className="font-medium">
              {transaction.amount} {transaction.type === 'income' ? '(Доход)' : '(Вывод)'}
            </div>
            <div className="text-sm text-gray-500">
              Дата: {new Date(transaction.created_at).toLocaleDateString()}
            </div>
            <div className={`text-sm ${
              transaction.status === 'completed' ? 'text-green-500' :
              transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              Статус: {
                transaction.status === 'completed' ? 'Завершено' :
                transaction.status === 'pending' ? 'В обработке' : 'Ошибка'
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 