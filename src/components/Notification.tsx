import { useNotificationStore } from '../services/notification.service';

export default function Notification() {
  const notification = useNotificationStore((state) => state.notification);

  if (!notification) return null;

  const bgColor =
    notification.type === 'success'
      ? 'bg-green-500'
      : notification.type === 'error'
      ? 'bg-red-500'
      : 'bg-yellow-500';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-md`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{notification.title}</h3>
            <p className="text-sm mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => useNotificationStore.getState().clearNotification()}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
