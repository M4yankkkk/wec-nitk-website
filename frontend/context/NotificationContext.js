import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

// --- Local Storage Keys ---
const PREFERENCES_KEY = 'wec_notification_prefs';
const NOTIFICATIONS_KEY = 'wec_notifications_list';
const LAST_SEEN_KEY = 'wec_last_seen_timestamp';

// --- Helper Functions for Storage ---
const getStorage = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.warn(`Error parsing localStorage key "${key}":`, e);
    return defaultValue;
  }
};

const setStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// --- Default State ---
const defaultPreferences = {
  blogs: true,
  events: true,
  hackathons: true,
};

// --- Create Context ---
const NotificationContext = createContext(null);
const socketUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // --- Load Initial State from Storage ---
  useEffect(() => {
    const storedPrefs = getStorage(PREFERENCES_KEY, defaultPreferences);
    const storedNotifs = getStorage(NOTIFICATIONS_KEY, []);
    const lastSeen = getStorage(LAST_SEEN_KEY, 0);

    setPreferences(storedPrefs);
    setNotifications(storedNotifs);

    // Check if any stored notifications are newer than the last time we checked
    if (storedNotifs.length > 0) {
      const latestNotifTime = Math.max(...storedNotifs.map(n => n.timestamp));
      if (latestNotifTime > lastSeen) {
        setHasUnread(true);
      }
    }
  }, []);

  // --- WebSocket Connection ---
  useEffect(() => {
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Socket.io connected');
    });

    socket.on('new-content', (data) => {
      // Use callback function to get fresh preferences state
      setPreferences(currentPrefs => {
        // 1. Check if user has this notification type enabled
        const typeKey = data.type.toLowerCase();
        if (!currentPrefs[typeKey]) {
          return currentPrefs; // Do nothing
        }

        // 2. Show Toast
        toast.success(`New ${data.type}: ${data.title}`, {
          position: 'top-center',
        });

        // 3. Add to notification list
        const newNotification = {
          id: Date.now(),
          timestamp: Date.now(),
          ...data,
        };

        setNotifications(currentNotifs => {
          const newList = [newNotification, ...currentNotifs].slice(0, 50); // Keep last 50
          setStorage(NOTIFICATIONS_KEY, newList);
          return newList;
        });

        // 4. Trigger Red Dot
        setHasUnread(true);
        
        return currentPrefs;
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // --- UI Functions ---
  const openPanel = () => {
    setIsPanelOpen(true);
    setHasUnread(false);
    setStorage(LAST_SEEN_KEY, Date.now());
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const updatePreferences = (key, value) => {
    setPreferences(currentPrefs => {
      const newPrefs = { ...currentPrefs, [key]: value };
      setStorage(PREFERENCES_KEY, newPrefs);
      return newPrefs;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setStorage(NOTIFICATIONS_KEY, []);
    setHasUnread(false); // Also clear the dot
  };

  // --- Value to Provide ---
  const value = {
    notifications,
    preferences,
    isPanelOpen,
    hasUnread,
    openPanel,
    closePanel,
    updatePreferences,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// --- Custom Hook to use the context ---
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};