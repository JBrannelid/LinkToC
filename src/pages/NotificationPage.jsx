import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import NotificationCard from "../components/layout/NotificationCard";
import mockNotificationsData from "../testing/mockNotifications.json";

const NotificationPage = ({ isDropdown = false }) => {
  const { notifications } = mockNotificationsData;

  if (isDropdown) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-medium mb-4">Important notifications</h2>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-35 lg:p-0 overflow-y-hidden">
      {/* Header */}
      <div className="bg-background lg:pt-10">
        <ModalHeader
          title="Important Notices"
          showCloseBtn={false}
          onCloseClick={() => window.history.back()}
        />
      </div>
      {/* Content */}
      <div className="flex-1 px-4 py-6 md:px-8 lg:px-16 xl:px-80 ">
        <p className="text-error-500 text-center text-sm">Placeholder</p>
        <div className="max-w-4xl mx-auto space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
