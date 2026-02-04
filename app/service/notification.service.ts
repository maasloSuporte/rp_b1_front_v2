import { create } from 'zustand';

export interface NotificationMessage {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface NotificationState {
  notification: NotificationMessage | null;
  showToast: (title: string, message: string, type: 'success' | 'error' | 'warning') => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,
  showToast: (title: string, message: string, type: 'success' | 'error' | 'warning') => {
    set({ notification: { title, message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, 3000);
  },
  clearNotification: () => set({ notification: null }),
}));
