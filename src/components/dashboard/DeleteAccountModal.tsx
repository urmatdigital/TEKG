import React from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDeleting: boolean;
  deleteError: string | null;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  isDeleting,
  deleteError,
}) => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      const { error: deleteError } = await supabase.rpc('delete_user_cascade', {
        user_id: user.id
      });

      if (deleteError) throw deleteError;

      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Подтверждение удаления</h3>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.
          Все ваши данные, включая историю транзакций и реферальные связи, будут удалены.
        </p>
        {deleteError && (
          <div className="mb-4 text-red-500">
            {deleteError}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            disabled={isDeleting}
          >
            Отмена
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  );
}; 