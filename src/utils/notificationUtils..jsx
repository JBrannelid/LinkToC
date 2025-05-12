export const getNotificationTypeStyles = (type) => {
  switch (type) {
    case "error":
      return {
        iconElement: (
          <div className="w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center">
            !
          </div>
        ),
        borderColor: "border-error-500",
      };
    case "success":
      return {
        iconElement: (
          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
            ✓
          </div>
        ),
        borderColor: "border-primary",
      };
    case "warning":
      return {
        iconElement: (
          <div className="w-6 h-6 bg-warning-300 text-black rounded-full flex items-center justify-center">
            !
          </div>
        ),
        borderColor: "border-warning-300",
      };
    case "comment":
      return {
        iconElement: (
          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
            💬
          </div>
        ),
        borderColor: "border-primary",
      };
    default:
      return {
        iconElement: (
          <div className="w-6 h-6 bg-primary-light text-primary rounded-full flex items-center justify-center">
            i
          </div>
        ),
        borderColor: "border-primary-light",
      };
  }
};

export const getNotificationBadgeCount = (count) => {
  return count > 9 ? "9+" : count;
};
