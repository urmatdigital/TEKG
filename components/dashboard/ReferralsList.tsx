import { Referral } from '../../types/dashboard';

interface ReferralsListProps {
  referrals: Referral[];
}

export function ReferralsList({ referrals }: ReferralsListProps) {
  if (!referrals?.length) {
    return <div className="text-gray-500">Нет рефералов</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Рефералы</h2>
      <div className="space-y-4">
        {referrals.map((referral) => (
          <div key={referral.id} className="border rounded p-4">
            <div className="font-medium">{referral.email}</div>
            <div className="text-sm text-gray-500">
              Присоединился: {new Date(referral.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
              Статус: {referral.status === 'active' ? 'Активный' : 'Неактивный'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 