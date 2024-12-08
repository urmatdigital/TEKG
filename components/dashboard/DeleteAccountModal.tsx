interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDeleting: boolean;
  deleteError: string | null;
}

export function DeleteAccountModal({ isOpen, onClose, isDeleting, deleteError }: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Удаление аккаунта</h2>
        <p className="mb-4">Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.</p>
        {deleteError && (
          <div className="text-red-600 mb-4">{deleteError}</div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isDeleting}
          >
            Отмена
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  );
} 