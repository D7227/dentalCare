import React, { useState } from "react";
import NotificationIcon from "../components/common/NotificationIcon";

const NotificationIconExample: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(2);

  const handleNotificationClick = () => {
    console.log("Notification clicked!");
    // Here you can add logic to mark notifications as read
    // or navigate to notifications page
  };

  const handleMarkAsRead = () => {
    setUnreadCount(0);
  };

  const handleAddNotification = () => {
    setUnreadCount((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Notification Icon Examples</h2>

      {/* Default Notification Icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Default (with 2 unread notifications)
        </h3>
        <NotificationIcon
          unreadCount={unreadCount}
          onClick={handleNotificationClick}
        />
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <NotificationIcon size="sm" unreadCount={5} />
            <p className="text-sm mt-2">Small</p>
          </div>
          <div className="text-center">
            <NotificationIcon size="md" unreadCount={12} />
            <p className="text-sm mt-2">Medium</p>
          </div>
          <div className="text-center">
            <NotificationIcon size="lg" unreadCount={25} />
            <p className="text-sm mt-2">Large</p>
          </div>
        </div>
      </div>

      {/* Different Border Styles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Border Styles</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <NotificationIcon
              unreadCount={3}
              borderStyle="solid"
              borderColor="#3b82f6"
              borderWidth={2}
            />
            <p className="text-sm mt-2">Solid Blue</p>
          </div>
          <div className="text-center">
            <NotificationIcon
              unreadCount={7}
              borderStyle="dashed"
              borderColor="#10b981"
              borderWidth={2}
            />
            <p className="text-sm mt-2">Dashed Green</p>
          </div>
          <div className="text-center">
            <NotificationIcon
              unreadCount={1}
              borderStyle="dotted"
              borderColor="#f59e0b"
              borderWidth={3}
            />
            <p className="text-sm mt-2">Dotted Orange</p>
          </div>
        </div>
      </div>

      {/* No Badge */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Badge</h3>
        <NotificationIcon unreadCount={5} showBadge={false} />
      </div>

      {/* Large Count */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large Count (shows 99+)</h3>
        <NotificationIcon unreadCount={150} maxCount={99} />
      </div>

      {/* Interactive Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Controls</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddNotification}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Notification
          </button>
          <button
            onClick={handleMarkAsRead}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Mark All as Read
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Current unread count: {unreadCount}
        </p>
      </div>
    </div>
  );
};

export default NotificationIconExample;
