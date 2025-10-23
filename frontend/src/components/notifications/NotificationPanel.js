import { X, Settings, Trash2 } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';
import { useState } from 'react';

// Sub-component for a single notification item
function NotificationItem({ notification }) {
  return (
    <div className="p-3 border-b border-gray-200">
      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
        {notification.type}
      </span>
      <p className="mt-1 text-sm text-gray-800">{notification.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {new Date(notification.timestamp).toLocaleString()}
      </p>
    </div>
  );
}

// Sub-component for a preference toggle
function PreferenceToggle({ label, pKey, isChecked, onChange }) {
  return (
    <label className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-gray-900 rounded focus:ring-gray-900"
        checked={isChecked}
        onChange={(e) => onChange(pKey, e.target.checked)}
      />
    </label>
  );
}

export default function NotificationPanel() {
  const {
    isPanelOpen,
    closePanel,
    notifications,
    preferences,
    updatePreferences,
    clearAllNotifications,
  } = useNotification();

  const [view, setView] = useState('notifications'); // 'notifications' or 'settings'

  return (
    <>
      {/* --- Overlay --- */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closePanel}
      />

      {/* --- Panel --- */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col transition-transform ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {view === 'notifications' ? 'Notifications' : 'Preferences'}
          </h2>
          <div>
            <button
              onClick={() => setView(v => v === 'notifications' ? 'settings' : 'notifications')}
              className="p-2 text-gray-500 hover:text-gray-800"
              aria-label={view === 'notifications' ? 'Open settings' : 'Back to notifications'}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={closePanel}
              className="p-2 text-gray-500 hover:text-gray-800"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Content --- */}
        {view === 'notifications' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <button
              onClick={clearAllNotifications}
              className="flex items-center justify-center gap-2 text-sm p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 p-6">No notifications yet.</p>
              ) : (
                notifications.map(notif => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))
              )}
            </div>
          </div>
        )}
        
        {view === 'settings' && (
          <div className="flex-1 overflow-y-auto">
            <p className="p-3 text-xs text-gray-500 bg-gray-50">
              Manage which notifications you receive.
            </p>
            <PreferenceToggle
              label="Blog Posts"
              pKey="blogs"
              isChecked={preferences.blogs}
              onChange={updatePreferences}
            />
            <PreferenceToggle
              label="Events"
              pKey="events"
              isChecked={preferences.events}
              onChange={updatePreferences}
            />
            <PreferenceToggle
              label="Hackathons"
              pKey="hackathons"
              isChecked={preferences.hackathons}
              onChange={updatePreferences}
            />
          </div>
        )}
      </div>
    </>
  );
}