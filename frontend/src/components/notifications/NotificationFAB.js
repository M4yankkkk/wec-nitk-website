import { Bell } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

export default function NotificationFAB() {
  const { openPanel, hasUnread } = useNotification();

  return (
    <button
      onClick={openPanel}
      className="fixed bottom-6 right-6 z-50 p-4 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      aria-label="Open notifications"
    >
      <Bell className="w-6 h-6" />
      {hasUnread && (
        <span className="absolute top-0 right-0 block w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900" />
      )}
    </button>
  );
}